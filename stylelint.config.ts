import type { Config } from "stylelint";

const config: Config = {
  extends: ["stylelint-config-standard"],
  // www/ and ios/ hold generated Capacitor build output (minified bundles).
  ignoreFiles: ["dist/**", ".output/**", "node_modules/**", "www/**", "ios/**"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "theme",
          "apply",
          "custom-variant",
          "variant",
          "utility",
          "source",
          "plugin",
          "reference",
          "config",
          "tailwind",
          "screen",
          "responsive",
        ],
      },
    ],
  },
};

export default config;
