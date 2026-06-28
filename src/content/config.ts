import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Victor Robin"),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),

    // Project area — which BlueRobin project this article belongs to.
    // Defaults to "archives" so the 100+ existing posts need no backfill.
    // "leadership" is a director-track essay (lives under /leadership/, kept out
    // of the Archives listings).
    project: z.enum(["archives", "debug-agent", "leadership"]).default("archives"),

    // Article categorization
    category: z.enum(["architecture", "messaging", "infrastructure", "security", "ai", "frontend", "backend", "database", "ci-cd", "observability", "storage", "leadership"]),
    difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]),

    // Tags for filtering and series grouping
    tags: z.array(z.string()).default([]),

    // Series navigation - supports both string and object format
    series: z.union([
      z.string(),
      z.object({
        name: z.string(),
        part: z.number().optional(),
        order: z.number().optional(),
      })
    ]).optional(),
    seriesOrder: z.number().optional(),

    // Reading metadata
    readTime: z.string().optional(), // e.g., "5 min"
    wordCount: z.number().optional(),

    // SEO & Social
    ogImage: z.string().optional(),
    canonicalURL: z.string().url().optional(),

    // Table of contents
    toc: z.boolean().default(true),

    // Deprecation — set when the article's subject was superseded by a newer
    // decision (e.g. MinIO -> R2, SigNoz -> LGTM). Renders a banner; the
    // article is kept for historical context, not deleted.
    deprecated: z.boolean().default(false),
    deprecatedReason: z.string().optional(),
  }),
});

const architecture = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Victor Robin"),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),

    // Architecture categorization
    category: z.enum(["system", "messaging", "storage", "security", "ai", "api", "infrastructure", "observability"]),
    difficulty: z.enum(["intermediate", "advanced", "expert"]),

    // Tags for filtering
    tags: z.array(z.string()).default([]),

    // Reading metadata
    readTime: z.string().optional(),

    // Table of contents
    toc: z.boolean().default(true),

    // Deprecation — set when the article's subject was superseded by a newer
    // decision. Renders a banner; the article is kept for historical context.
    deprecated: z.boolean().default(false),
    deprecatedReason: z.string().optional(),
  }),
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updatedDate: z.coerce.date().optional(),
  }),
});

// The Library — a reviewed bookshelf. Each entry is one book I bought, with a
// verdict, who-should-read-it, the public (Goodreads-style) rating as a seed, and
// links to the article/essay/project where the book actually paid off.
const library = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(), // book title
    bookAuthor: z.string(), // the book's author (distinct from the reviewer)
    description: z.string(), // one-line verdict tagline
    author: z.string().default("Victor Robin"), // the reviewer

    // Dates. purchaseDate comes from the order history; readDate falls back to the
    // purchase month at render time when omitted.
    purchaseDate: z.coerce.date(),
    readDate: z.coerce.date().optional(),
    status: z.enum(["read", "reading", "reference", "unread"]).default("read"),

    // Grouping dimension — keep in sync with LIBRARY_THEMES in src/config.ts.
    theme: z.enum([
      "software-architecture",
      "programming-craft",
      "sre-devops",
      "ai-ml",
      "security-cyber",
      "algorithms-math",
      "leadership-management",
      "product-startup",
      "strategy-influence",
      "productivity-mind",
      "money-finance",
      "philosophy-reflection",
      "fiction-literature",
      "history-society",
      "craft-hobbies",
    ]),

    // Verdict — keep in sync with RECOMMENDATIONS in src/config.ts.
    recommendation: z.enum(["essential", "recommended", "situational", "skip"]),
    rating: z.number().min(0).max(5).optional(), // my rating
    goodreadsRating: z.number().min(0).max(5).optional(), // public seed

    // Who should read it.
    audience: z.array(z.string()).default([]),

    // Where it earned its place — links to the real article/essay/project it informed.
    relatedProjects: z
      .array(z.enum(["archives", "debug-agent", "leadership", "platform"]))
      .default([]),
    relatedLinks: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),

    // Media + identity.
    cover: z.string().optional(), // /covers/<slug>.jpg
    isbn: z.string().optional(),

    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),

    // Off-topic for an engineering portfolio (fiction, hobbies, etc.). Kept, but
    // surfaced in a "confirm keep or drop" strip on the hub.
    flagged: z.boolean().default(false),

    draft: z.boolean().default(false),
    toc: z.boolean().default(false),
  }),
});

export const collections = {
  blog,
  architecture,
  pages,
  library,
};
