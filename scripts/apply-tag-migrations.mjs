#!/usr/bin/env node
/**
 * Tag Migration Script for BlueRobin Blog
 * 
 * This script applies the tag consolidation defined in generate-tags.mjs
 * 
 * Usage: 
 *   node scripts/apply-tag-migrations.mjs [--dry-run]
 * 
 * Options:
 *   --dry-run    Show what would be changed without modifying files
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '../src/content/blog');
const DRY_RUN = process.argv.includes('--dry-run');

// Tag consolidation mapping (old -> new)
// null means remove the tag entirely
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
  "tech1": null,
  "tech2": null,
  "tech3": null,
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

function processFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^(---\n)([\s\S]*?)(\n---)/);
  
  if (!frontmatterMatch) {
    return { modified: false };
  }
  
  const [fullMatch, start, frontmatter, end] = frontmatterMatch;
  const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]*)\]/);
  
  if (!tagsMatch) {
    return { modified: false };
  }
  
  const originalTagsStr = tagsMatch[1];
  const originalTags = originalTagsStr
    .split(',')
    .map(t => t.trim().replace(/"/g, ''))
    .filter(t => t);
  
  // Process tags
  const newTags = [];
  const changes = [];
  
  for (const tag of originalTags) {
    if (TAG_CONSOLIDATION.hasOwnProperty(tag)) {
      const newTag = TAG_CONSOLIDATION[tag];
      if (newTag === null) {
        changes.push({ type: 'remove', tag });
      } else {
        changes.push({ type: 'consolidate', from: tag, to: newTag });
        if (!newTags.includes(newTag)) {
          newTags.push(newTag);
        }
      }
    } else {
      if (!newTags.includes(tag)) {
        newTags.push(tag);
      }
    }
  }
  
  if (changes.length === 0) {
    return { modified: false };
  }
  
  // Create new tags string
  const newTagsStr = newTags.map(t => `"${t}"`).join(', ');
  const newFrontmatter = frontmatter.replace(
    /tags:\s*\[[^\]]*\]/,
    `tags: [${newTagsStr}]`
  );
  
  const newContent = content.replace(
    fullMatch,
    `${start}${newFrontmatter}${end}`
  );
  
  return {
    modified: true,
    originalTags,
    newTags,
    changes,
    newContent,
  };
}

function main() {
  console.log('🏷️  BlueRobin Tag Migration\n');
  console.log('='.repeat(60));
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'));
  let modifiedCount = 0;
  let totalChanges = 0;
  
  for (const file of files) {
    const filePath = join(CONTENT_DIR, file);
    const result = processFile(filePath);
    
    if (result.modified) {
      modifiedCount++;
      totalChanges += result.changes.length;
      
      console.log(`\n📄 ${file}:`);
      console.log(`   Original: [${result.originalTags.join(', ')}]`);
      console.log(`   New:      [${result.newTags.join(', ')}]`);
      
      for (const change of result.changes) {
        if (change.type === 'remove') {
          console.log(`   ❌ Removed: ${change.tag}`);
        } else {
          console.log(`   ♻️  ${change.from} → ${change.to}`);
        }
      }
      
      if (!DRY_RUN) {
        writeFileSync(filePath, result.newContent);
        console.log(`   ✅ File updated`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Files scanned: ${files.length}`);
  console.log(`   Files modified: ${modifiedCount}`);
  console.log(`   Total tag changes: ${totalChanges}`);
  
  if (DRY_RUN) {
    console.log('\n💡 Run without --dry-run to apply changes');
  } else {
    console.log('\n✅ Migration complete!');
  }
}

main();
