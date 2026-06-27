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
 *   Verifies a Cloudflare Turnstile token, then notifies Victor over TWO
 *   independent channels (whichever are configured): an ntfy push (instant) and
 *   a Brevo email (durable, reply-to = the requester so you can reply directly).
 *   The request succeeds if AT LEAST ONE channel delivers, so a single channel
 *   outage never drops a genuine request.
 *
 * Secrets / vars (prod: `wrangler secret put` or dashboard; local: `.dev.vars`):
 *   TURNSTILE_SECRET_KEY  - Turnstile secret (required)
 *   --- ntfy channel (self-hosted) ---
 *   NTFY_WEBHOOK_URL      - full topic URL, e.g. https://ntfy.bluerobin.io/blog-access-requests
 *   NTFY_TOKEN            - bearer token with publish rights on that topic
 *   --- email channel (Brevo) ---
 *   BREVO_API_KEY         - Brevo transactional API key
 *   CONTACT_TO_EMAIL      - where to send (default victor@bluerobin.io)
 *   CONTACT_FROM_EMAIL    - verified Brevo sender (default noreply@bluerobin.io)
 *
 * At least one of {NTFY_WEBHOOK_URL, BREVO_API_KEY} must be set.
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
  BREVO_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

interface RequestPayload {
  name: string;
  email: string;
  message: string;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

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

// --- Channel: ntfy push -----------------------------------------------------
async function sendNtfy(env: Env, p: RequestPayload): Promise<boolean> {
  if (!env.NTFY_WEBHOOK_URL) return false;
  const headers: Record<string, string> = {
    Title: `Access request — ${p.name}`,
    Priority: "high",
    Tags: "bell,bluerobin",
    "Content-Type": "text/plain; charset=utf-8",
  };
  if (env.NTFY_TOKEN) headers.Authorization = `Bearer ${env.NTFY_TOKEN}`;
  const text = `From: ${p.name} <${p.email}>\n\n${p.message || "(no message)"}`;
  try {
    const res = await fetch(env.NTFY_WEBHOOK_URL, { method: "POST", body: text, headers });
    return res.ok;
  } catch {
    return false;
  }
}

// --- Channel: Brevo email (reply-to = requester) ----------------------------
async function sendEmail(env: Env, p: RequestPayload): Promise<boolean> {
  if (!env.BREVO_API_KEY) return false;
  const to = env.CONTACT_TO_EMAIL || "victor@bluerobin.io";
  const from = env.CONTACT_FROM_EMAIL || "noreply@bluerobin.io";
  const safeMsg = escapeHtml(p.message || "(no message)").replace(/\n/g, "<br>");
  const payload = {
    sender: { name: "BlueRobin site", email: from },
    to: [{ email: to }],
    replyTo: { email: p.email, name: p.name },
    subject: `BlueRobin access request — ${p.name}`,
    textContent: `New access request from the blog.\n\nName: ${p.name}\nEmail: ${p.email}\n\nMessage:\n${p.message || "(no message)"}\n\nReply directly to this email to reach them.`,
    htmlContent: `<p>New access request from the blog.</p><p><strong>Name:</strong> ${escapeHtml(p.name)}<br><strong>Email:</strong> <a href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a></p><p><strong>Message:</strong><br>${safeMsg}</p><p style="color:#64748b;font-size:13px">Reply directly to this email to reach them.</p>`,
  };
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok; // 201 Created on success
  } catch {
    return false;
  }
}

async function handleRequestAccess(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  // Turnstile is required; at least one notification channel must be configured.
  const hasChannel = Boolean(env.NTFY_WEBHOOK_URL || env.BREVO_API_KEY);
  if (!env.TURNSTILE_SECRET_KEY || !hasChannel) {
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
  if (!(await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip))) {
    return json({ ok: false, error: "turnstile_failed" }, 400);
  }

  // Fan out to every configured channel in parallel; succeed if any delivers.
  const payload: RequestPayload = { name, email, message };
  const [ntfyOk, emailOk] = await Promise.all([sendNtfy(env, payload), sendEmail(env, payload)]);
  const channels = {
    ntfy: env.NTFY_WEBHOOK_URL ? (ntfyOk ? "ok" : "fail") : "skip",
    email: env.BREVO_API_KEY ? (emailOk ? "ok" : "fail") : "skip",
  };

  if (!ntfyOk && !emailOk) return json({ ok: false, error: "notify_failed", channels }, 502);
  return json({ ok: true, channels });
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
