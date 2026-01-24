#!/usr/bin/env node
/**
 * Tag Generation Script for BlueRobin Blog
 * 
 * This script analyzes existing articles and generates a consolidated
 * tag taxonomy with categories and subcategories.
 * 
 * Usage: 
 *   node scripts/generate-tags.mjs
 * 
 * The script will:
 * 1. Read all MDX articles
 * 2. Analyze content and current tags
 * 3. Generate a new consolidated tag mapping
 * 4. Output a migration plan
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '../src/content/blog');

// Proposed consolidated tag taxonomy
// Category -> Subcategories
const TAG_TAXONOMY = {
  // Development
  "dotnet": ["csharp", "efcore", "blazor", "aspnet", "fastendpoints", "fluent-validation", "polly"],
  "frontend": ["css", "tailwind", "components", "ui", "forms", "state-management"],
  "backend": ["api", "async", "background-jobs", "caching", "performance", "resilience"],
  
  // Architecture & Design
  "architecture": ["ddd", "patterns", "design-patterns", "event-driven", "microservices"],
  "messaging": ["nats", "jetstream", "real-time"],
  "database": ["postgresql", "efcore", "migrations", "qdrant", "ravendb", "falkordb"],
  
  // AI & ML
  "ai": ["rag", "semantic-kernel", "embeddings", "llm", "mcp", "tool-calling", "ai-agents"],
  "search": ["semantic-search", "qdrant", "knowledge-graph"],
  "document-processing": ["ocr", "docling"],
  
  // Infrastructure
  "kubernetes": ["k3s", "helm", "gitops", "flux", "containers"],
  "infrastructure": ["homelab", "bare-metal", "hardware", "networking", "dns"],
  "ci-cd": ["github-actions", "automation", "testing", "testcontainers"],
  "storage": ["minio", "s3", "encryption"],
  
  // Security & Operations
  "security": ["encryption", "sse", "kes", "authelia", "zero-trust", "rbac", "pki", "yubikey"],
  "observability": ["monitoring", "signoz", "tracing", "health-checks"],
  "configuration": ["secrets", "infisical", "env-vars"],
};

// Tag consolidation mapping (old -> new)
const TAG_CONSOLIDATION = {
  // Merge similar tags
  "lessons-learned": "patterns",
  "opinion": "architecture",
  "strategy": "patterns",
  "design": "architecture",
  "optimization": "performance",
  "scaling": "performance",
  "benchmarking": "performance",
  "orchestration": "kubernetes",
  "ops": "infrastructure",
  "setup": "infrastructure",
  "cd": "ci-cd",
  "tech1": null, // Remove
  "tech2": null, // Remove
  "tech3": null, // Remove
  "dev-experience": "patterns",
  "error-handling": "resilience",
  "lifecycle": "patterns",
  "migration": "database",
  "graph": "knowledge-graph",
  "cypher": "falkordb",
  "bot": "ai-agents",
  "no-code": "automation",
  "serverless": "infrastructure",
  "service-accounts": "security",
  "secrets": "configuration",
  "routing": "networking",
  "cloud-exit": "homelab",
  "javascript": "frontend",
  "python": "ai",
  "validation": "patterns",
};

function readArticles() {
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'));
  const articles = [];
  
  for (const file of files) {
    const content = readFileSync(join(CONTENT_DIR, file), 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
      const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/);
      const categoryMatch = frontmatter.match(/category:\s*"([^"]+)"/);
      
      articles.push({
        file,
        title: titleMatch ? titleMatch[1] : 'Unknown',
        tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/"/g, '')) : [],
        category: categoryMatch ? categoryMatch[1] : 'unknown',
      });
    }
  }
  
  return articles;
}

function analyzeCurrentTags(articles) {
  const tagCounts = {};
  const tagsByCategory = {};
  
  for (const article of articles) {
    for (const tag of article.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      
      if (!tagsByCategory[article.category]) {
        tagsByCategory[article.category] = {};
      }
      tagsByCategory[article.category][tag] = (tagsByCategory[article.category][tag] || 0) + 1;
    }
  }
  
  return { tagCounts, tagsByCategory };
}

function generateMigrationPlan(articles) {
  const migrations = [];
  
  for (const article of articles) {
    const newTags = [];
    const removedTags = [];
    const consolidatedTags = [];
    
    for (const tag of article.tags) {
      if (TAG_CONSOLIDATION[tag] === null) {
        removedTags.push(tag);
      } else if (TAG_CONSOLIDATION[tag]) {
        consolidatedTags.push({ from: tag, to: TAG_CONSOLIDATION[tag] });
        if (!newTags.includes(TAG_CONSOLIDATION[tag])) {
          newTags.push(TAG_CONSOLIDATION[tag]);
        }
      } else {
        newTags.push(tag);
      }
    }
    
    if (removedTags.length > 0 || consolidatedTags.length > 0) {
      migrations.push({
        file: article.file,
        title: article.title,
        originalTags: article.tags,
        newTags,
        removedTags,
        consolidatedTags,
      });
    }
  }
  
  return migrations;
}

function main() {
  console.log('🏷️  BlueRobin Tag Analysis\n');
  console.log('='.repeat(60));
  
  const articles = readArticles();
  console.log(`\n📚 Found ${articles.length} articles\n`);
  
  const { tagCounts, tagsByCategory } = analyzeCurrentTags(articles);
  
  // Sort tags by frequency
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1]);
  
  console.log('📊 Tag Frequency Analysis:');
  console.log('-'.repeat(40));
  for (const [tag, count] of sortedTags.slice(0, 20)) {
    const consolidation = TAG_CONSOLIDATION[tag];
    const status = consolidation === null ? '❌ remove' : 
                   consolidation ? `→ ${consolidation}` : '✓';
    console.log(`  ${count.toString().padStart(3)} × ${tag.padEnd(25)} ${status}`);
  }
  
  console.log('\n📁 Tags by Category:');
  console.log('-'.repeat(40));
  for (const [category, tags] of Object.entries(tagsByCategory)) {
    console.log(`\n  ${category}:`);
    const sorted = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 5);
    for (const [tag, count] of sorted) {
      console.log(`    ${count} × ${tag}`);
    }
  }
  
  const migrations = generateMigrationPlan(articles);
  
  if (migrations.length > 0) {
    console.log('\n🔄 Migration Plan:');
    console.log('-'.repeat(40));
    for (const m of migrations.slice(0, 10)) {
      console.log(`\n  ${m.file}:`);
      if (m.removedTags.length > 0) {
        console.log(`    Remove: ${m.removedTags.join(', ')}`);
      }
      for (const c of m.consolidatedTags) {
        console.log(`    ${c.from} → ${c.to}`);
      }
    }
    if (migrations.length > 10) {
      console.log(`\n  ... and ${migrations.length - 10} more articles`);
    }
  }
  
  // Generate proposed taxonomy
  console.log('\n📋 Proposed Tag Taxonomy:');
  console.log('-'.repeat(40));
  for (const [category, subcategories] of Object.entries(TAG_TAXONOMY)) {
    console.log(`\n  ${category}:`);
    console.log(`    ${subcategories.join(', ')}`);
  }
  
  console.log('\n✅ Analysis complete!\n');
  console.log('To apply migrations, run: node scripts/apply-tag-migrations.mjs');
}

main();
