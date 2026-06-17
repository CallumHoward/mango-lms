import { describe, expect, it, vi } from "vitest";

import { getRouter } from "#/router";

// Stub only the two URL helpers so the test asserts how the router is wired, not
// Paraglide's own (un)localization logic. They must return real URLs because the
// router invokes rewrite.input while parsing its initial location during
// construction; distinct sentinel URLs make the delegation observable.
const { deLocalizeUrl, localizeUrl, deLocalized, localized } = vi.hoisted(() => {
  const deLocalized = new URL("https://example.com/about");
  const localized = new URL("https://example.com/de/about");
  return {
    deLocalized,
    localized,
    deLocalizeUrl: vi.fn<() => URL>(() => deLocalized),
    localizeUrl: vi.fn<() => URL>(() => localized),
  };
});

vi.mock("#/paraglide/runtime.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("#/paraglide/runtime.js")>()),
  deLocalizeUrl,
  localizeUrl,
}));

describe("getRouter", () => {
  it("strips the locale prefix from incoming URLs (rewrite.input → deLocalizeUrl)", () => {
    const { rewrite } = getRouter().options;
    deLocalizeUrl.mockClear(); // ignore the call made while parsing the initial location

    const incoming = new URL("https://example.com/de/about");
    const result = rewrite?.input?.({ url: incoming });

    expect(deLocalizeUrl).toHaveBeenCalledExactlyOnceWith(incoming);
    expect(result).toBe(deLocalized);
  });

  it("adds the locale prefix to outgoing URLs (rewrite.output → localizeUrl)", () => {
    const { rewrite } = getRouter().options;
    localizeUrl.mockClear();

    const outgoing = new URL("https://example.com/about");
    const result = rewrite?.output?.({ url: outgoing });

    expect(localizeUrl).toHaveBeenCalledExactlyOnceWith(outgoing);
    expect(result).toBe(localized);
  });
});
