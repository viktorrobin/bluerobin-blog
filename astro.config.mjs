import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";

// Wrap every <table> in <div class="table-wrapper"> so wide tables scroll
// horizontally inside their own box instead of overflowing the page on mobile.
function rehypeWrapTables() {
  const isWrapped = (node) =>
    node.tagName === "div" &&
    []
      .concat(node.properties?.className ?? [])
      .includes("table-wrapper");

  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      walk(child);
      if (child.type === "element" && child.tagName === "table" && !isWrapped(node)) {
        return {
          type: "element",
          tagName: "div",
          properties: { className: ["table-wrapper"] },
          children: [child],
        };
      }
      return child;
    });
  };

  return (tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
  site: "https://blog.bluerobin.io",
  // Pages are served from src/pages at root (/)
  // Blog content lives at /articles/*, /tags/*, /architecture/*, etc.
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    rehypePlugins: [rehypeWrapTables],
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
  },
  output: "static",
  build: {
    assets: "assets",
  },
});
