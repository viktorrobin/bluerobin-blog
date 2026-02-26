import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";

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
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
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
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "dracula",
      },
      wrap: true,
    },
  },
  output: "static",
  build: {
    assets: "assets",
  },
});
