import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: [
    "typescript",
    "unicorn",
    "oxc",
    "react",
    "jsx-a11y",
    "import",
    "vitest",
    "promise",
    "jsdoc",
  ],
  jsPlugins: [
    "eslint-plugin-playwright",
    { name: "react-hooks-js", specifier: "eslint-plugin-react-hooks" },
    { name: "router", specifier: "@tanstack/eslint-plugin-router" },
    { name: "check-file", specifier: "eslint-plugin-check-file" },
    "eslint-plugin-testing-library",
    {
      name: "no-effect",
      specifier: "eslint-plugin-react-you-might-not-need-an-effect",
    },
  ],
  categories: {
    correctness: "error",
  },
  env: {
    builtin: true,
  },
  ignorePatterns: [".output", "dist", "src/routeTree.gen.ts", "vitest-setup.ts"],
  rules: {
    "unicorn/filename-case": ["error", { case: "kebabCase" }],
    "unicorn/no-null": "off",
    "react/only-export-components": "warn",
    "react/no-array-index-key": "error",

    "typescript/no-floating-promises": "error",
    "typescript/no-misused-promises": "error",
    "typescript/await-thenable": "error",
    "typescript/switch-exhaustiveness-check": "error",
    "typescript/no-unnecessary-condition": "warn",

    "import/no-cycle": "error",

    // Consolidate on the `#/` src alias (Node subpath import); ban the old `@/`.
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            regex: "^@/",
            message: "Use the '#/' alias for src imports (the '@/' alias was removed).",
          },
        ],
      },
    ],

    "check-file/filename-blocklist": [
      "error",
      {
        "**/*.js": "*.ts",
        "**/*.jsx": "*.tsx",
        "**/*.mjs": "*.ts",
        "**/*.cjs": "*.ts",
        "**/__test*/**": "co-located *.test.ts (no __tests__ dirs)",
      },
    ],

    "check-file/filename-naming-convention": [
      "error",
      {
        "src/**/*.{ts,tsx}": "+([^.])?(.@(test|test-d|stories|d))",
        "e2e/**/*.{ts,tsx}": "+([^.])?(.@(spec))",
        "*.{ts,tsx}": "+([^.])?(.@(config|d))",
      },
      { ignoreMiddleExtensions: false },
    ],

    "jsdoc/check-tag-names": "error",
    "jsdoc/check-property-names": "error",
    "jsdoc/check-access": "error",
    "jsdoc/empty-tags": "error",
    "jsdoc/implements-on-classes": "error",

    // React Compiler rules: native oxlint ports, with the JS plugin only for rules not yet ported.
    // Overlap on most violations, but only rules-of-hooks flags non-component callers and
    // only hooks flags first-class hook usage.
    "react/rules-of-hooks": "error",
    "react/hooks": "error",
    "react/capitalized-calls": "error",
    "react/no-deriving-state-in-effects": "error",
    "react/memo-dependencies": "error",
    // Newer/noisier effect-dependency rules: start as warnings.
    "react/exhaustive-effect-dependencies": "warn",
    "react-hooks-js/memoized-effect-dependencies": "warn",

    "react/static-components": "error",
    "react/use-memo": "error",
    "react/void-use-memo": "error",
    "react/preserve-manual-memoization": "error",
    "react/incompatible-library": "warn",
    "react/immutability": "error",
    "react/globals": "error",
    "react/refs": "error",
    "react/set-state-in-effect": "error",
    "react/error-boundaries": "error",
    "react/purity": "error",
    "react/set-state-in-render": "error",
    "react/unsupported-syntax": "warn",
    "react-hooks-js/component-hook-factories": "error",
    "react-hooks-js/config": "error",
    "react-hooks-js/gating": "error",

    // "You Might Not Need an Effect" rules (heuristic; start as warnings).
    // no-derived-state is omitted: it overlaps react/no-deriving-state-in-effects.
    "no-effect/no-chain-state-updates": "warn",
    "no-effect/no-event-handler": "warn",
    "no-effect/no-adjust-state-on-prop-change": "warn",
    "no-effect/no-reset-all-state-on-prop-change": "warn",
    "no-effect/no-pass-live-state-to-parent": "warn",
    "no-effect/no-pass-data-to-parent": "warn",
    "no-effect/no-external-store-subscription": "warn",
    "no-effect/no-initialize-state": "warn",
  },
  overrides: [
    {
      files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "!e2e/**"],
      rules: {
        "vitest/require-top-level-describe": "error",
        "vitest/consistent-test-it": ["error", { fn: "it", withinDescribe: "it" }],
        "vitest/no-identical-title": "error",
        "vitest/no-commented-out-tests": "warn",
        "vitest/no-duplicate-hooks": "error",
        "vitest/prefer-hooks-in-order": "error",
        "vitest/prefer-hooks-on-top": "error",
        "vitest/require-hook": "error",

        "testing-library/await-async-queries": "error",
        "testing-library/await-async-utils": "error",
        "testing-library/no-await-sync-queries": "error",
        "testing-library/no-debugging-utils": "warn",
        "testing-library/no-dom-import": ["error", "react"],
        "testing-library/no-node-access": "error",
        "testing-library/no-promise-in-fire-event": "error",
        "testing-library/no-unnecessary-act": "error",
        "testing-library/no-wait-for-multiple-assertions": "error",
        "testing-library/no-wait-for-side-effects": "error",
        "testing-library/prefer-find-by": "error",
        "testing-library/prefer-presence-queries": "error",
        "testing-library/prefer-query-by-disappearance": "error",
        "testing-library/prefer-screen-queries": "error",
        "testing-library/prefer-user-event": "error",
        "testing-library/render-result-naming-convention": "error",
      },
    },
    {
      files: ["src/routes/**/*.{ts,tsx}"],
      rules: {
        "react/only-export-components": "off",
        "router/create-route-property-order": "error",
        "router/route-param-names": "error",
        // Required for TanStack Router: route files ($postId, _layout, dotted
        // nesting) aren't kebab and their dots look like secondary extensions.
        "unicorn/filename-case": "off",
        "check-file/filename-naming-convention": "off",
      },
    },
    {
      files: ["e2e/**/*.{ts,tsx}"],
      rules: {
        "playwright/require-top-level-describe": "error",
        "playwright/no-skipped-test": "warn",
        "playwright/no-focused-test": "error",
        "playwright/no-conditional-in-test": "warn",
        "playwright/valid-expect": "error",
      },
    },
  ],
});
