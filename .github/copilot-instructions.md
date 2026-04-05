# Copilot Instructions for BlueRobin Blog

## MCP-First Policy

| Tool Category | MCP Tool | Required For |
|---------------|----------|--------------|
| **Library Docs** | `mcp_context7_*` | Writing/reviewing code using any external library (Astro, Tailwind, MDX) — resolve-library-id first, then get-library-docs |
| **Cross-Session Memory** | `mcp_mem0_*` | Store decisions/patterns when asked to "remember"; search at start of complex tasks |
| **Secrets** | `mcp_infisical-mcp_*` | Getting deployment secrets — project ID `0de628ca-1ba0-4bb0-8a37-c0bd89300959`, env `prod` |

## Overview

Technical blog built with Astro 5 + Tailwind CSS 4 + MDX. Static output deployed via Docker (nginx).

## Quick Reference

```bash
npm run dev        # Local dev server
npm run build      # astro check && astro build
npm run preview    # Preview production build
npm run lint       # ESLint (.ts, .tsx, .astro)
npm run format     # Prettier
```

## Content

- 4 content collections in `src/content/`: blog (100+ MDX articles), cookbook, architecture, pages
- Content schema defined in `src/content/config.ts`

### Frontmatter (required fields)

```yaml
title: "Article Title"
description: "Short description"
pubDate: 2024-10-25
author: "Victor Robin"
category: "backend"          # architecture|messaging|infrastructure|security|ai|frontend|backend|database|ci-cd|observability|storage
difficulty: "advanced"       # beginner|intermediate|advanced|expert
tags: ["dotnet", "ddd"]
readTime: "18 min"
```

Optional: `updatedDate`, `draft`, `featured`, `toc`, `series` (string or `{ name, order?, part? }`), `seriesOrder`

### Custom Components

Import in MDX files:
- `<Callout>` — info/warning/tip boxes
- `<ImplementationNote>` — collapsible implementation details
- `<ExternalCite>` — academic-style external citations

## Stack

| Component | Version |
|-----------|---------|
| Astro | 5.18 |
| Tailwind CSS | 4 (Vite plugin) |
| MDX | @astrojs/mdx |
| Sitemap | @astrojs/sitemap |
| Syntax | Shiki (dracula theme) |
| Search | Fuse.js |
| Diagrams | Mermaid |

## Conventions

- Site URL: `https://blog.bluerobin.io`
- Output: static (`output: "static"`)
- Remark plugins: remark-toc, remark-collapse
- Author is always "Victor Robin" unless specified
- Run `npm run build` (includes `astro check`) before committing
