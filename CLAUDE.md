# BlueRobin Blog — CLAUDE.md

## Project Overview

Technical blog for the BlueRobin platform. Astro 5 static site with 100+ MDX articles about homelab AI, .NET architecture, Kubernetes, and observability.

## Requirements as Code

The blog is part of the BlueRobin monorepo. Product requirements live in
[`/requirements`](../requirements/README.md) — the single source of truth for the
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
| Deployment | Docker multi-stage → nginx |
| Analytics | Self-hosted analytics (optional) |

## MCP Servers

For articles that reference external libraries or current platform state:

- **`context7`** — fact-check external API references before publishing.
- **`github-cluster`** — link directly to commits / PRs when citing implementation.

Canonical inventory:
[`../requirements/infra/mcp-servers.md`](../requirements/infra/mcp-servers.md).

## Commands

```bash
npm run dev          # Astro dev server (HMR)
npm run build        # astro check + astro build
npm run preview      # Preview static build
npm run lint         # ESLint (.ts, .tsx, .astro)
npm run format       # Prettier
```

## Directory Structure

```
src/
  content/
    blog/          # 100+ MDX articles
    architecture/  # Structurizr DSL diagrams
    cookbook/       # How-to guides
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
- **Categories**: architecture, messaging, infrastructure, security, ai, frontend, backend, database, ci-cd, observability, storage
- **Difficulty**: beginner, intermediate, advanced, expert
- **Collections**: blog, cookbook, architecture, pages (4 Zod-validated collections)
- **Optional**: updatedDate, draft, featured, toc, tags[], series (string or {name, order?, part?}), seriesOrder, readTime

## Conventions

- Site: `https://blog.bluerobin.io`
- All articles are MDX (not plain Markdown)
- Custom components: `<Callout>`, `<ImplementationNote>`, `<ExternalCite>`
- Remark plugins: remark-toc (auto TOC), remark-collapse (collapsible sections)
- Author defaults to "Victor Robin"
- Dockerfile: multi-stage (node build → nginx serve)
