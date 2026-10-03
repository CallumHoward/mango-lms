import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

import { describe, expect, it } from "vitest";
import { parse } from "yaml";

// Guard the supply-chain settings in pnpm-workspace.yaml against silent
// regression. pnpm ignores unknown keys, so a removed or misspelled setting
// disables its protection with no error -- these assertions fail CI instead.

const config = parse(readFileSync(path.join(process.cwd(), "pnpm-workspace.yaml"), "utf8")) as {
  trustPolicy?: string;
  blockExoticSubdeps?: boolean;
  minimumReleaseAge?: number;
  minimumReleaseAgeStrict?: boolean;
  dangerouslyAllowAllBuilds?: boolean;
  autoDedupe?: boolean;
};

describe("pnpm supply-chain config", () => {
  it("blocks trust-level downgrades", () => {
    expect(config.trustPolicy).toBe("no-downgrade");
  });

  it("blocks transitive git/tarball dependencies", () => {
    expect(config.blockExoticSubdeps).toBe(true);
  });

  it("enforces at least a 7-day release-age cooldown", () => {
    expect(config.minimumReleaseAge).toBeGreaterThanOrEqual(10080);
  });

  it("fails resolution instead of falling back to immature versions", () => {
    expect(config.minimumReleaseAgeStrict).toBe(true);
  });

  it("does not globally allow dependency build scripts", () => {
    // allowBuilds is an explicit allowlist; this catches the escape hatch.
    expect(config.dangerouslyAllowAllBuilds).not.toBe(true);
  });

  it("deduplicates compatible dependency versions on install", () => {
    expect(config.autoDedupe).toBe(true);
  });
});
