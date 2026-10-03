import handler from "@tanstack/react-start/server-entry";

import { paraglideMiddleware } from "#/paraglide/server.js";

// Resolve the per-request locale (from URL, cookie, or Accept-Language) before
// the app renders, so server-rendered messages and <html lang> match the client.
//
// Gotcha: hand the *original* request to the framework handler, not the
// middleware-localized one. The router already delocalizes the URL via its
// `rewrite.input`; passing the rewritten request would delocalize twice and
// trigger a redirect loop.
export default {
  fetch(request: Request): Promise<Response> {
    return paraglideMiddleware(request, () => handler.fetch(request));
  },
};
