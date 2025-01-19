import { defineEcConfig } from "astro-expressive-code";

export default defineEcConfig({
  // Customize themes to show dark in dark, light in light
  themes: ["one-light", "catppuccin-frappe"],
  customizeTheme: (theme) => {
    if (theme.name === "one-light") theme.name = "light";
    if (theme.name === "catppuccin-frappe") theme.name = "dark";
    return theme;
  },
  styleOverrides: {
    frames: {
      frameBoxShadowCssValue: ({ resolveSetting }) => `0 0.1rem 0.2rem ${resolveSetting("frames.shadowColor")}`,
    },
    borderRadius: "0",
    codePaddingBlock: "0.75rem",
  },
});
