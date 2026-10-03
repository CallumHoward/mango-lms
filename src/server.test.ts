import { describe, expect, it, vi } from "vitest";

// Hoisted so the vi.mock factories below can reference them.
const { handlerFetch, paraglideMiddleware } = vi.hoisted(() => ({
  handlerFetch: vi.fn<(request: Request) => Response | Promise<Response>>(),
  // The real middleware resolves the locale, then calls the resolve callback;
  // model that by just invoking the callback and returning its result.
  paraglideMiddleware: vi.fn<(request: Request, resolve: () => unknown) => unknown>(
    (_request, resolve) => resolve(),
  ),
}));

vi.mock("@tanstack/react-start/server-entry", () => ({ default: { fetch: handlerFetch } }));
vi.mock("#/paraglide/server.js", () => ({ paraglideMiddleware }));

const { default: server } = await import("#/server");

describe("server entry", () => {
  it("forwards the original request to the handler (not a re-localized one)", async () => {
    const request = new Request("https://example.com/de/");
    const response = new Response("ok");
    handlerFetch.mockReturnValue(response);

    const result = await server.fetch(request);

    expect(paraglideMiddleware).toHaveBeenCalledOnce();
    // The router already delocalizes via rewrite.input; handing the handler the
    // *same* request avoids delocalizing twice (the documented redirect loop).
    expect(handlerFetch).toHaveBeenCalledExactlyOnceWith(request);
    expect(result).toBe(response);
  });
});
