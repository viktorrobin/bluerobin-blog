import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@/config";
import type { APIContext } from "astro";

// Canonical URL per project area (Archives / Debug Agent / Leadership).
function postPath(project: string | undefined, slug: string): string {
  if (project === "debug-agent") return `/debug-agent/${slug}/`;
  if (project === "leadership") return `/leadership/${slug}/`;
  return `/articles/${slug}/`;
}

export async function GET(context: APIContext) {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const items = posts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postPath(post.data.project, post.slug),
      categories: post.data.tags,
    }));

  return rss({
    title: `${SITE.title} — Blog`,
    description: SITE.desc,
    site: context.site ?? SITE.website,
    items,
    customData: "<language>en</language>",
  });
}
