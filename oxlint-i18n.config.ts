import { defineConfig } from "oxlint";

/**
 * Dedicated config for the untranslated-string check. It runs as a _second_ oxlint pass (see the
 * `lint` script) rather than living in `oxlint.config.ts`.
 *
 * Why a separate config: oxlint JS plugins are alpha, and a JS-plugin rule is currently global —
 * `overrides[].files` globs are ignored for it, so the rule can't be turned off for tests or scoped
 * to source from within the main config without leaking to (or from) every other file. Isolating it
 * here lets us `ignorePatterns` away tests, e2e, and generated output so the literal check only
 * sees application source, while the main config keeps linting everything.
 *
 * `no-literal-string` runs in Node (not the Rust core), so it is the slow pole; keeping it in its
 * own narrowly-scoped pass keeps the main lint fast.
 */
export default defineConfig({
  jsPlugins: ["eslint-plugin-i18next"],
  ignorePatterns: [
    ".output",
    "dist",
    "src/routeTree.gen.ts",
    "src/paraglide",
    "vitest-setup.ts",
    // Tests and e2e specs legitimately render/assert hardcoded UI copy.
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "e2e",
  ],
  rules: {
    // "jsx-only" checks JSX text *and* the user-facing attributes listed below
    "i18next/no-literal-string": [
      "error",
      {
        mode: "jsx-only",
        "jsx-attributes": {
          include: ["alt", "title", "placeholder", "aria-label"],
        },
        callees: { exclude: ["m", "t"] },
        words: { exclude: ["^[^A-Za-z]+$"] },
      },
    ],
  },
});
