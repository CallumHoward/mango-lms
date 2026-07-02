// fallow-ignore-file unused-file
import { defineConfig } from "oxfmt";

export default defineConfig({
  jsdoc: true,
  sortImports: true,
  sortTailwindcss: { stylesheet: "src/styles.css" },
  ignorePatterns: [".claude/**", "src/routeTree.gen.ts", "src/paraglide/**", "pnpm-lock.yaml"],
});
