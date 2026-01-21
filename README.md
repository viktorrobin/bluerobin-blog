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
- **Deployment**: Static files served via nginx on k3s

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
category: "cookbook"  # cookbook | guide | architecture | troubleshooting
difficulty: "intermediate"  # beginner | intermediate | advanced
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

The blog is automatically built and deployed when pushing to `main`:

1. GitHub Actions builds the static site
2. Docker image pushed to private registry
3. Flux reconciles and deploys to k3s
4. Available at `https://blog.bluerobin.local`

## License

MIT
