import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

/**
 * Catalog-completeness gate. inlang's built-in message-lint rules (e.g. missing-translation) were
 * removed in the SDK v2 / lix rewrite and a replacement is still pending
 * (https://github.com/opral/lix/issues/239), so this version-proof script diffs the key set of
 * every non-base locale against the base locale and fails CI when they drift (a key missing from —
 * or unexpectedly extra in — a translation file). Revisit once that lands. Run via `pnpm
 * i18n:check`.
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

const baseKeys = messageKeys(catalogPath(settings.baseLocale));
const problems: string[] = [];

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
  `i18n catalog check passed: all locales match the base locale "${settings.baseLocale}" (${baseKeys.size} keys).`,
);
