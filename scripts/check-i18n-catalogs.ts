import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

/**
 * Catalog gate for the inlang message catalogs. inlang's built-in message-lint rules
 * (missing-translation, valid-js-identifier, …) were removed in the SDK v2 / lix rewrite and a
 * replacement is still pending (https://github.com/opral/lix/issues/239), and oxlint lints JS/TS
 * rather than JSON, so this version-proof script validates the catalogs directly. It enforces:
 *
 * 1. Completeness — every non-base locale defines exactly the base locale's keys.
 * 2. Key shape — keys are flat snake_case (Paraglide's idiomatic style; see
 *    https://github.com/opral/paraglide-js/blob/main/docs/message-keys.md).
 *
 * Revisit once lix validation rules land. Run via `pnpm i18n:check`.
 */

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

interface InlangSettings {
  baseLocale: string;
  locales: string[];
  "plugin.inlang.messageFormat"?: { pathPattern?: string };
}

function readJson(filePath: string): Record<string, unknown> {
  return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;
}

function messageKeys(filePath: string): Set<string> {
  const keys = Object.keys(readJson(filePath)).filter((key) => key !== "$schema");
  return new Set(keys);
}

const settings = readJson(
  path.join(projectRoot, "project.inlang", "settings.json"),
) as unknown as InlangSettings;
const pathPattern =
  settings["plugin.inlang.messageFormat"]?.pathPattern ?? "./messages/{locale}.json";

function catalogPath(locale: string): string {
  return path.resolve(projectRoot, pathPattern.replace("{locale}", locale));
}

// The configured (relative) catalog path, so failure messages point at the real
// file even if `pathPattern` is customized in settings.json.
function catalogLabel(locale: string): string {
  return pathPattern.replace("{locale}", locale);
}

// Flat snake_case: lowercase word segments joined by single underscores, starting
// with a letter. Rejects camelCase, kebab-case, dotted keys (`a.b` compiles to
// clunky `m["a.b"]()` bracket access), and anything that isn't a valid JS
// identifier for `m.key()`.
const KEY_PATTERN = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;

const problems: string[] = [];

// Key-shape check, run on every locale (the base defines the source of truth).
// Note: this also rejects non-string values, i.e. keeps catalogs flat. If/when
// plurals or variants are adopted (inlang's matcher object form), relax the
// `typeof value` check to allow that specific shape.
for (const locale of settings.locales) {
  const label = catalogLabel(locale);
  for (const [key, value] of Object.entries(readJson(catalogPath(locale)))) {
    if (key === "$schema") continue;
    if (!KEY_PATTERN.test(key)) {
      problems.push(
        `${label} key "${key}" is not flat snake_case (lowercase words joined by single underscores; no periods, camelCase, or hyphens)`,
      );
    }
    if (typeof value !== "string") {
      problems.push(
        `${label} key "${key}" must map to a string — nested objects / namespaces aren't allowed (keep catalogs flat)`,
      );
    }
  }
}

const baseKeys = messageKeys(catalogPath(settings.baseLocale));

for (const locale of settings.locales) {
  if (locale === settings.baseLocale) continue;

  const keys = messageKeys(catalogPath(locale));
  const missing = [...baseKeys].filter((key) => !keys.has(key));
  const extra = [...keys].filter((key) => !baseKeys.has(key));

  if (missing.length > 0) {
    problems.push(`${catalogLabel(locale)} is missing keys: ${missing.join(", ")}`);
  }
  if (extra.length > 0) {
    problems.push(
      `${catalogLabel(locale)} has unknown keys (not in base "${settings.baseLocale}"): ${extra.join(", ")}`,
    );
  }
}

if (problems.length > 0) {
  console.error("i18n catalog check failed:");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(
  `i18n catalog check passed: ${baseKeys.size} flat snake_case keys, consistent across all locales (base "${settings.baseLocale}").`,
);
