import { Capacitor } from "@capacitor/core";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts, createRootRoute, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect, useRef } from "react";

import { NotFound } from "@/components/not-found";
import { WebTabBar } from "@/components/web-tab-bar";
import { loadTransitions } from "@/lib/transitions";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf8",
      },
      {
        // viewport-fit=cover is required for env(safe-area-inset-*) to report
        // real values on notched iOS devices (see safe-area padding in styles.css).
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  notFoundComponent: NotFound,

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const outletRef = useRef<HTMLElement>(null);
  // Show the web fallback bar only for tabbed routes. It lives outside the
  // cap-router-outlet because the outlet's transform would re-anchor its
  // position:fixed; the bar is hidden on native via .is-native regardless.
  const showTabBar = useRouterState({
    select: (state) => state.matches.some((match) => match.routeId === "/_tabs"),
  });

  // App-wide flag so CSS can drop web-only chrome (fallback bar, in-page back
  // link/title) on native, regardless of which route mounts first.
  useEffect(() => {
    if (Capacitor.isNativePlatform()) document.documentElement.classList.add("is-native");
  }, []);

  // Page transitions: cap-router-outlet animates the <cap-page> bodies and
  // (on native iOS) drives the interactive edge swipe-back. Loaded client-only
  // (the package isn't SSR-safe); native bars stay owned by native-navigation.
  useEffect(() => {
    void loadTransitions()?.then((transitions) => {
      // ~native iOS push/pop duration (the library's 540 default feels floaty).
      // The interactive swipe settle is tuned separately in the patch
      // (proportional-to-remaining duration + ease-out, matching UIKit).
      transitions.initTransitions({ platform: "auto", duration: 330 });
      if (outletRef.current) {
        transitions.setupRouterOutlet(outletRef.current, {
          platform: "auto",
          swipeGesture: "auto",
          duration: 330,
        });
      }
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col items-center">
        <cap-router-outlet ref={outletRef} platform="auto" swipe-gesture="auto">
          {children}
        </cap-router-outlet>
        {showTabBar ? <WebTabBar /> : null}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
