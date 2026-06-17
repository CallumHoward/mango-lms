import process from "node:process";

import { paraglideVitePlugin } from "@inlang/paraglide-js";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const developmentPlugins = [devtools(), nitro(), tanstackStart()];
  const analyzer = visualizer({
    filename: "./stats.html",
    open: true,
    gzipSize: true,
    brotliSize: true,
  });
  const analyzePlugins = process.env.ANALYZE === "true" ? [analyzer] : [];
  const modePlugins = mode === "test" ? [] : developmentPlugins;

  return {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      // Compiles the inlang project to typed message functions under src/paraglide.
      // URL strategy first so the per-request locale is resolved from the path
      // (e.g. /de/...) before falling back to the cookie / Accept-Language header.
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        outputStructure: "message-modules",
        cookieName: "PARAGLIDE_LOCALE",
        strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
      }),
      tailwindcss(),
      ...modePlugins,
      ...analyzePlugins,
      viteReact(),
      babel({
        presets: [reactCompilerPreset()],
      }),
    ],
    test: {
      environment: "jsdom",
      // In CI, also emit GitHub Actions annotations for failing tests.
      reporters: process.env.GITHUB_ACTIONS ? ["default", "github-actions"] : ["default"],
      setupFiles: ["./vitest-setup.ts"],
      // Restore vi.spyOn implementations and reset mock state after each test.
      restoreMocks: true,
      // Playwright e2e specs live in e2e/ and must not be picked up by Vitest.
      exclude: [...configDefaults.exclude, "e2e/**"],
      // Type tests (*.test-d.ts). Only spawns tsc when such files exist.
      typecheck: { enabled: true },
      coverage: {
        provider: "v8",
        // lcov feeds diff-cover (and editor coverage-gutters); text summarizes.
        reporter: ["text", "lcov"],
        // Measure all source, so untested changed files count as 0% in the
        // diff-coverage gate rather than being silently absent from the report.
        all: true,
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["src/**/*.test.{ts,tsx}", "src/routeTree.gen.ts"],
      },
    },
  };
});
