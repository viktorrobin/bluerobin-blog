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
