import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://fireis.dev/",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // https://shiki.style/themes
      theme: "catppuccin-macchiato",
    },
  },
});
