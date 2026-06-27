# BlueRobin Tech Blog

A technical blog documenting the BlueRobin homelab project - from medical document search to production AI.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Framework**: [Astro](https://astro.build/) - Static site generator
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with OKLCH colors
- **Content**: MDX with custom components
- **Deployment**: Cloudflare Workers (static assets) via Workers Builds — see below

## Project Structure

```
src/
├── components/       # Astro components
├── content/
│   └── blog/        # Blog posts (MDX)
├── layouts/         # Page layouts
├── pages/           # Route pages
└── styles/          # Global CSS
```

## Writing Articles

Create a new `.mdx` file in `src/content/blog/`:

```mdx
---
title: "Your Article Title"
description: "A brief description"
pubDate: 2026-01-21
category: "ai"  # architecture | messaging | infrastructure | security | ai | frontend | backend | database | ci-cd | observability | storage | leadership
difficulty: "intermediate"  # beginner | intermediate | advanced | expert
project: "archives"  # archives | debug-agent | leadership
tags: ["dotnet", "kubernetes"]
series: "ddd-series"  # optional
seriesOrder: 1  # optional
readTime: "5 min"
---

Your content here...
```

## Custom Components

### Citations

```mdx
import ExternalCite from '@components/ExternalCite.astro';

<ExternalCite 
  title="Microsoft Docs" 
  url="https://docs.microsoft.com/..." 
/>
```

### Implementation Notes

```mdx
import ImplementationNote from '@components/ImplementationNote.astro';

<ImplementationNote>
  Through experimentation, I found this approach worked best.
</ImplementationNote>
```

### Callouts

```mdx
import Callout from '@components/Callout.astro';

<Callout type="tip">
  This is a helpful tip!
</Callout>

<Callout type="warning">
  Watch out for this gotcha.
</Callout>
```

## Deployment

Production is **Cloudflare Workers static assets**, deployed by **Cloudflare Workers
Builds** (Git integration) on every push to `main`:

1. Push to `main` → Cloudflare Workers Builds runs `npm run build` (`astro check && astro build`)
2. The static output in `./dist` is uploaded as Workers static assets (`wrangler.toml`)
3. A small Worker (`src/worker/index.ts`) handles the `POST /api/request-access` route
   (Turnstile verify → ntfy push); all other paths are served directly from assets
4. Live at `https://blog.bluerobin.io`

The `Dockerfile` + `nginx.conf` are a legacy container path and are **not** used in
production. Secrets (`TURNSTILE_SECRET_KEY`, `NTFY_WEBHOOK_URL`) are set with
`wrangler secret put`; local dev reads `.dev.vars`.

## Related Requirements

The blog is part of the BlueRobin monorepo. Product requirements — the single source of
truth for the platform — live under [`/requirements`](../bluerobin-requirements/README.md). Blog
content is not governed by feature specs.

## License

Proprietary — all rights reserved.
