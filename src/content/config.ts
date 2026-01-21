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
    category: z.enum(["cookbook", "guide", "architecture", "troubleshooting"]),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    
    // Tags for filtering and series grouping
    tags: z.array(z.string()).default([]),
    
    // Series navigation
    series: z.string().optional(),
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
  pages,
};
