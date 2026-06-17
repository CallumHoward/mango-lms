import { createRouter } from "@tanstack/react-router";

import { deLocalizeUrl, localizeUrl } from "#/paraglide/runtime.js";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Keep file routes canonical (e.g. /about) while public URLs carry a locale
    // prefix: strip the prefix on the way in, add it back to outgoing <Link> hrefs.
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
  });

  return router;
};
