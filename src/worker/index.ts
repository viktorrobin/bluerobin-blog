/**
 * BlueRobin blog Worker.
 *
 * The site is a static Astro build served from Cloudflare Workers static assets.
 * With `main` set and an `[assets] binding`, Cloudflare serves matching static
 * files FIRST and only invokes this Worker for paths that are NOT static assets
 * (e.g. /api/*). So this handler just needs to own the API routes and fall
 * through to ASSETS for everything else.
 *
 * Route: POST /api/request-access
 *   Verifies a Cloudflare Turnstile token, then pushes a notification to ntfy
 *   so Victor gets an instant phone push when someone requests access.
 *
 * Secrets / vars (set via `wrangler secret put` in production, `.dev.vars` locally):
 *   TURNSTILE_SECRET_KEY  - Turnstile secret (server-side)
 *   NTFY_WEBHOOK_URL      - full ntfy topic URL, e.g. https://ntfy.sh/<topic>
 *   NTFY_TOKEN            - optional bearer token for a protected ntfy instance
 */

// Minimal local types so this file type-checks under the Astro tsconfig without
// pulling in @cloudflare/workers-types. Wrangler bundles this entry separately.
interface AssetsBinding {
  fetch: (request: Request) => Promise<Response>;
}

interface Env {
  ASSETS: AssetsBinding;
  TURNSTILE_SECRET_KEY?: string;
  NTFY_WEBHOOK_URL?: string;
  NTFY_TOKEN?: string;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function handleRequestAccess(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  if (!env.TURNSTILE_SECRET_KEY || !env.NTFY_WEBHOOK_URL) {
    return json({ ok: false, error: "server_misconfigured" }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  // Honeypot — bots fill hidden fields. Pretend success, drop the request.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const token = String(body.turnstileToken ?? "");

  if (!name || name.length > 100) return json({ ok: false, error: "invalid_name" }, 400);
  if (!EMAIL_RE.test(email) || email.length > 200) return json({ ok: false, error: "invalid_email" }, 400);
  if (message.length > 500) return json({ ok: false, error: "message_too_long" }, 400);
  if (!token) return json({ ok: false, error: "missing_turnstile" }, 400);

  const ip = request.headers.get("CF-Connecting-IP");
  const ok = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip);
  if (!ok) return json({ ok: false, error: "turnstile_failed" }, 400);

  // Push to ntfy.
  const ntfyBody = `From: ${name} <${email}>\n\n${message || "(no message)"}`;
  const headers: Record<string, string> = {
    Title: "BlueRobin — access request",
    Priority: "high",
    Tags: "bell,bluerobin",
    "Content-Type": "text/plain; charset=utf-8",
  };
  if (env.NTFY_TOKEN) headers.Authorization = `Bearer ${env.NTFY_TOKEN}`;

  try {
    const res = await fetch(env.NTFY_WEBHOOK_URL, { method: "POST", body: ntfyBody, headers });
    if (!res.ok) return json({ ok: false, error: "notify_failed" }, 502);
  } catch {
    return json({ ok: false, error: "notify_failed" }, 502);
  }

  return json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/request-access") {
      return handleRequestAccess(request, env);
    }
    // Not an API route — defer to static assets.
    return env.ASSETS.fetch(request);
  },
};
