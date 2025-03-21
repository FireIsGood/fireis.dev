import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import { h } from "hastscript";

import expressiveCode from "astro-expressive-code";

const headerLink = h(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    viewBox: "0 0 24 24",
    style: "height: 0.7em",
    class: "header-permalink",
  },
  h("path", { d: "M9 17H7A5 5 0 0 1 7 7h2" }),
  h("path", { d: "M15 7h2a5 5 0 1 1 0 10h-2" }),
  h("line", { x1: "8", x2: "16", y1: "12", y2: "12" })
);

// https://astro.build/config
export default defineConfig({
  site: "https://fireis.dev/",
  integrations: [expressiveCode(), mdx(), sitemap(), svelte()],
  server: {
    port: 1625,
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    rehypePlugins: [
      rehypeAccessibleEmojis,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append", content: headerLink }],
    ],
  },
});
