import { defineConfig } from "vite";

// Base path: on GitHub Pages the site is served from /<repo>/.
// Set BASE_PATH in the Pages workflow; defaults to "/" for local dev.
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  build: {
    target: "es2021",
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
