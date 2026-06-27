# BlueRobin Blog — Content Status

**Author:** Victor Robin
**Model:** Content is **commit-driven**, not plan-driven. A weekly Claude agent
diffs `bluerobin-app`, `bluerobin-infra`, and `bluerobin-debug-agent`, classifies
the changes, and opens a PR proposing article creates/updates/retirements. Victor
reviews and merges. See the *How this blog is generated* section on the
[About page](../src/content/pages/about.md).

> The previous version of this file was an aspirational 58-article backlog that no
> longer matches reality (the blog now ships **112 articles** across two projects)
> and referenced retired technologies (SigNoz, MinIO). It has been replaced with
> the accurate snapshot below.

## Current snapshot

- **~112 articles** in `src/content/blog/`, two project areas (`archives`,
  `debug-agent`) — see frontmatter `project`.
- **5 arXiv-style papers** in `papers/` (RCA / SRE / agents).
- **9 architecture/Mermaid diagrams** in `src/content/diagrams/` +
  `src/content/architecture/`.
- **9 posts** flagged `deprecated: true` with `deprecatedReason` (kept for
  historical context; superseded by ADRs).

## Editorial standards (for new posts)

- Start with a concrete production problem, not a generic definition.
- Lead with the **outcome** (metrics, before/after) where one exists.
- Use the actual current stack — **LGTM (Prometheus/Loki/Tempo/Grafana)** for
  observability, **Cloudflare R2/AI Gateway**, **CNPG**, **NATS JetStream**.
  Do **not** reintroduce retired tech (SigNoz, MinIO, KES).
- End with 2–3 targeted internal links to build topical depth.
- Cite a requirement ID (`FEAT-NNN`, `FR-N`, …) in the commit/PR per the repo's
  citation gate.

## Active tracks

- **Leadership** (`category: leadership`) — director-level essays; see
  `src/pages/leadership/`.
- **Impact** — measurable outcomes surfaced at `/impact`.

_For the working review + roadmap, see `docs/editorial-review-2026-02-26.md`._
