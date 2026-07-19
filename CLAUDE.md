# BlueRobin Blog — CLAUDE.md

## Mandatory reading — BlueRobin requirements framework

Auto-loaded on session start. The full framework at `../bluerobin-requirements/` is the source of truth — blog content MUST stay consistent with the architecture and ADRs documented there.

@../bluerobin-requirements/CLAUDE.md
@../bluerobin-requirements/agent-charters.md

## Project Overview

Technical blog for the BlueRobin platform. Astro 5 static site with 100+ MDX articles about homelab AI, .NET architecture, Kubernetes, and observability. Also hosts a Library collection (163 reviewed books) and a leadership-essay track (a `leadership` project/category value). A small request-access Worker (`src/worker/index.ts`: Turnstile + ntfy + Brevo; secrets via wrangler) gates optional access requests.

## Requirements as Code

The blog is part of the BlueRobin monorepo. Product requirements live in
[`/requirements`](../bluerobin-requirements/README.md) — the single source of truth for the
platform. Blog *content* is not governed by feature specs, but technical articles
should stay consistent with the architecture and ADRs documented there.

## Tech Stack

| Component | Detail |
|-----------|--------|
| Framework | Astro 5.18 (static output) |
| Content | MDX with Zod-validated frontmatter |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Syntax | Shiki (dracula theme) |
| Search | Fuse.js (client-side) |
| Diagrams | Mermaid |
| Deployment | Cloudflare Workers (static assets + request-access Worker) via Cloudflare Workers Builds Git integration; `wrangler.toml` is the deploy config. Legacy self-host: Docker multi-stage → nginx |
| Analytics | Self-hosted analytics (optional) |

## MCP Servers

For articles that reference external libraries or current platform state:

- **`context7`** — fact-check external API references before publishing.
- **`github-cluster`** — link directly to commits / PRs when citing implementation.

Canonical inventory:
[`../bluerobin-requirements/infra/mcp-servers.md`](../bluerobin-requirements/infra/mcp-servers.md).

## Commands

```bash
npm run dev          # Astro dev server (HMR)
npm run build        # astro check + astro build
npm run preview      # Preview static build
npm run lint         # NON-FUNCTIONAL (eslint not installed); real gate = astro check (in build) + format
npm run format       # Prettier
```

## Directory Structure

```
src/
  content/
    blog/          # 100+ MDX articles
    architecture/  # architecture content collection
    library/       # reviewed bookshelf (163 books)
    diagrams/      # diagram sources
    config.ts      # Zod collection schemas
  components/      # Astro components (Callout, ExternalCite, ImplementationNote)
  layouts/         # Page layouts
  pages/           # Route pages
  styles/          # Tailwind source CSS
public/            # Static assets
scripts/           # Content migration scripts (Python/JS)
```

## Content Schema

Frontmatter validated by Zod in `src/content/config.ts`:
- **Required**: title, description, pubDate, category, difficulty
- **Categories**: architecture, messaging, infrastructure, security, ai, frontend, backend, database, ci-cd, observability, storage, leadership (12 values)
- **Difficulty**: beginner, intermediate, advanced, expert
- **Collections**: blog, architecture, pages, library (4 Zod-validated collections)
- **Optional**: updatedDate, draft, featured, toc, tags[], series (string or {name, order?, part?}), seriesOrder, readTime

## Active work / known invariants

- **Light/dark theme toggle shipped** — default light (NFR-13).
- **OKLCH token ramps in the Web app are deliberately INVERTED for dark theme** — do NOT sync token values from `bluerobin-app/DESIGN-SYSTEM.md` into `src/styles/global.css`; it will corrupt the blog palette.

## Conventions

- Site: `https://blog.bluerobin.io`
- All articles are MDX (not plain Markdown)
- Custom components: `<Callout>`, `<ImplementationNote>`, `<ExternalCite>`
- Remark plugins: remark-toc (auto TOC), remark-collapse (collapsible sections)
- Author defaults to "Victor Robin"
- Dockerfile: multi-stage (node build → nginx serve)
