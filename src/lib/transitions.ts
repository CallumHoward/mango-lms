// SSR-safe seam for @capgo/capacitor-transitions.
//
// The package defines custom-element classes (`class … extends HTMLElement`)
// at import time, which throws in Node during our SPA shell prerender. So we
// never import it statically: the runtime is loaded once on the client via
// dynamic import, and callers use the thin wrappers below (no-ops until loaded,
// which happens on the first client paint — before any user interaction).
//
// The `import type` keeps the package's JSX augmentation (cap-router-outlet,
// cap-page, …) active project-wide without emitting any runtime import.
import type { TransitionDirection } from "@capgo/capacitor-transitions/react";

type TransitionsApi = typeof import("@capgo/capacitor-transitions/react");

let api: TransitionsApi | null = null;
let apiPromise: Promise<TransitionsApi> | null = null;

/** Load + register the transition runtime (client only). Safe to call repeatedly. */
export function loadTransitions(): Promise<TransitionsApi> | undefined {
  if (typeof window === "undefined") return undefined;
  if (!apiPromise) {
    apiPromise = (async () => {
      await import("@capgo/capacitor-transitions"); // registers the custom elements
      api = await import("@capgo/capacitor-transitions/react");
      return api;
    })();
  }
  return apiPromise;
}

/** Set the direction for the next router navigation (no-op until loaded). */
export function setDirection(direction: TransitionDirection): void {
  api?.setDirection(direction);
}
