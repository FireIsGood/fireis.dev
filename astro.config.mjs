import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://fireis.dev/",
  integrations: [mdx(), sitemap(), svelte()],
  server: {
    port: 1625,
    open: "/", // Auto-open
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    shikiConfig: {
      // https://shiki.style/themes
      theme: "catppuccin-macchiato",
    },
  },
});
