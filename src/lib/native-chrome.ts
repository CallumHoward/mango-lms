import { Capacitor } from "@capacitor/core";
import type { PluginListenerHandle } from "@capacitor/core";
import { useEffect } from "react";

// Shared lifecycle for the native-navigation hooks: on mount (native only) run
// `register` — which configures the native chrome and returns an event listener
// handle — and remove that listener on unmount. Pass a stable `register`
// (useCallback) so the effect only re-runs when its inputs change.
export function useNativeChrome(register: () => Promise<PluginListenerHandle>) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let handle: PluginListenerHandle | undefined;
    let cancelled = false;

    void register().then((listener) => {
      if (cancelled) void listener.remove();
      else handle = listener;
    });

    return () => {
      cancelled = true;
      void handle?.remove();
    };
  }, [register]);
}
