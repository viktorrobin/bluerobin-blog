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
    project: z.enum(["archives", "debug-agent"]).default("archives"),

    // Article categorization
    category: z.enum(["architecture", "messaging", "infrastructure", "security", "ai", "frontend", "backend", "database", "ci-cd", "observability", "storage"]),
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

const cookbook = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Victor Robin"),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    
    // Recipe categorization
    category: z.enum(["infrastructure", "database", "messaging", "security", "ai", "frontend", "backend", "networking", "ci-cd", "observability"]),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    
    // Tags for filtering
    tags: z.array(z.string()).default([]),
    
    // Reading metadata
    readTime: z.string().optional(),
    
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
    // decision (e.g. MinIO -> R2, SigNoz -> LGTM). Renders a banner; the
    // article is kept for historical context, not deleted.
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

export const collections = {
  blog,
  cookbook,
  architecture,
  pages,
};
