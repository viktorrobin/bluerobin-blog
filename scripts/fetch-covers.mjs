#!/usr/bin/env node
/**
 * fetch-covers.mjs — populate public/covers/<slug>.jpg for the Library section.
 *
 * Reads every src/content/library/*.mdx, pulls `isbn` / `title` / `bookAuthor`
 * from the frontmatter, and downloads a cover image:
 *   1. Open Library Covers by ISBN  (covers.openlibrary.org/b/isbn/<ISBN>-L.jpg?default=false)
 *   2. Open Library search by title+author → cover by cover edition key
 *   3. Google Books by title+author → volumeInfo.imageLinks
 * Existing covers are skipped. Any book that can't be resolved is reported at the
 * end so it can be filled in manually. Covers are used editorially (review/commentary).
 *
 * Usage:  node scripts/fetch-covers.mjs            (fetch missing only)
 *         node scripts/fetch-covers.mjs --force    (re-fetch everything)
 */
import { readdir, readFile, writeFile, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src/content/library");
const OUT_DIR = path.join(ROOT, "public/covers");
const FORCE = process.argv.includes("--force");
const CONCURRENCY = 6;
const MIN_BYTES = 2000; // reject 1x1 / empty placeholders

const exists = async (p) => access(p, constants.F_OK).then(() => true).catch(() => false);

// Pull a double-quoted scalar (`key: "value"`) from frontmatter text.
function field(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "m"));
  return m ? m[1].replace(/\\"/g, '"') : null;
}

async function fetchBuffer(url, headers = {}) {
  const res = await fetch(url, { headers, redirect: "follow" });
  if (!res.ok) return null;
  const ct = res.headers.get("content-type") || "";
  if (!ct.startsWith("image/")) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.length >= MIN_BYTES ? buf : null;
}

async function fromOpenLibraryIsbn(isbn) {
  if (!isbn) return null;
  const clean = isbn.replace(/[^0-9Xx]/g, "");
  if (!clean) return null;
  return fetchBuffer(`https://covers.openlibrary.org/b/isbn/${clean}-L.jpg?default=false`);
}

async function fromOpenLibrarySearch(title, author) {
  const q = new URLSearchParams({ title, ...(author ? { author } : {}), limit: "1" });
  const res = await fetch(`https://openlibrary.org/search.json?${q}`).catch(() => null);
  if (!res || !res.ok) return null;
  const data = await res.json().catch(() => null);
  const doc = data?.docs?.[0];
  if (!doc) return null;
  if (doc.cover_i) {
    const buf = await fetchBuffer(`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg?default=false`);
    if (buf) return buf;
  }
  const isbn = doc.isbn?.find((x) => x.length >= 10);
  return isbn ? fromOpenLibraryIsbn(isbn) : null;
}

async function fromGoogleBooks(title, author, isbn) {
  const terms = [];
  if (isbn) terms.push(`isbn:${isbn.replace(/[^0-9Xx]/g, "")}`);
  else {
    terms.push(`intitle:${title}`);
    if (author) terms.push(`inauthor:${author.split("&")[0].trim()}`);
  }
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(terms.join("+"))}&maxResults=1&country=US`;
  const res = await fetch(url).catch(() => null);
  if (!res || !res.ok) return null;
  const data = await res.json().catch(() => null);
  const links = data?.items?.[0]?.volumeInfo?.imageLinks;
  if (!links) return null;
  const best = links.extraLarge || links.large || links.medium || links.thumbnail || links.smallThumbnail;
  if (!best) return null;
  return fetchBuffer(best.replace(/^http:/, "https:").replace(/&edge=curl/, ""));
}

async function resolveCover(book) {
  return (
    (await fromOpenLibraryIsbn(book.isbn)) ||
    (await fromGoogleBooks(book.title, book.author, book.isbn)) ||
    (await fromOpenLibrarySearch(book.title, book.author)) ||
    null
  );
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith(".mdx"));
  const books = [];
  for (const f of files) {
    const slug = f.replace(/\.mdx$/, "");
    const raw = await readFile(path.join(CONTENT_DIR, f), "utf8");
    const fm = raw.split(/^---$/m)[1] || "";
    books.push({
      slug,
      title: field(fm, "title") || slug,
      author: field(fm, "bookAuthor") || "",
      isbn: field(fm, "isbn") || "",
    });
  }

  console.log(`Found ${books.length} books. Output -> ${path.relative(ROOT, OUT_DIR)}/`);
  const missing = [];
  let done = 0;

  async function worker(queue) {
    for (const book of queue) {
      const out = path.join(OUT_DIR, `${book.slug}.jpg`);
      if (!FORCE && (await exists(out))) { done++; continue; }
      try {
        const buf = await resolveCover(book);
        if (buf) {
          await writeFile(out, buf);
          process.stdout.write(`  ✓ ${book.slug} (${Math.round(buf.length / 1024)}kb)\n`);
        } else {
          missing.push(book.slug);
          process.stdout.write(`  ✗ ${book.slug} — no cover found\n`);
        }
      } catch (e) {
        missing.push(book.slug);
        process.stdout.write(`  ✗ ${book.slug} — ${e.message}\n`);
      }
      done++;
    }
  }

  // Round-robin split into CONCURRENCY queues.
  const queues = Array.from({ length: CONCURRENCY }, () => []);
  books.forEach((b, i) => queues[i % CONCURRENCY].push(b));
  await Promise.all(queues.map(worker));

  console.log(`\nDone. ${done - missing.length}/${books.length} have covers.`);
  if (missing.length) {
    console.log(`Missing (${missing.length}) — add manually to public/covers/<slug>.jpg:`);
    missing.forEach((s) => console.log(`  - ${s}`));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
