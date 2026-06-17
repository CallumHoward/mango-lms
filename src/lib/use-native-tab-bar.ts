import { Capacitor } from "@capacitor/core";
import { NativeNavigation } from "@capgo/capacitor-native-navigation";
import type { NativeNavigationTab } from "@capgo/capacitor-native-navigation";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";

import { useNativeChrome } from "@/lib/native-chrome";
import { TABS, tabIdForPath } from "@/lib/tabs";
import { setDirection } from "@/lib/transitions";

// The native setTabbar call rebuilds the whole bar from its options and treats a
// missing `tabs` as an empty array — so every call must re-send the full set or
// the bar disappears.
const NATIVE_TABS: NativeNavigationTab[] = TABS.map((tab) => ({
  id: tab.id,
  title: tab.title,
  icon: { ios: { sfSymbol: tab.sfSymbol }, svg: tab.svg },
}));

// Drives the native iOS/Android tab bar and bridges its taps to the router.
// No-op on the web, where the CSS WebTabBar handles navigation instead.
export function useNativeTabBar() {
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // Set up the native bar once and translate native tab taps into navigations.
  const register = useCallback(async () => {
    // contentInsetMode: "css" writes --cap-native-navigation-* vars we pad with.
    await NativeNavigation.configure({ enabled: true, contentInsetMode: "css" });
    await NativeNavigation.setTabbar({
      tabs: NATIVE_TABS,
      selectedId: tabIdForPath(router.state.location.pathname),
    });

    return NativeNavigation.addListener("tabSelect", (event) => {
      const tab = TABS.find((candidate) => candidate.id === event.id);
      if (!tab) return;
      // Tab switches swap instantly rather than sliding like a push/pop.
      setDirection("none");
      void router.navigate({ to: tab.path });
    });
  }, [router]);

  useNativeChrome(register);

  // Keep the native tab selection + navbar title in sync with the route.
  // The navbar stays visible (titled, no buttons) across tabbed routes so its
  // height matches the detail navbar — no layout shift navigating in/out.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const tabId = tabIdForPath(pathname);
    void NativeNavigation.setTabbar({ tabs: NATIVE_TABS, selectedId: tabId, animated: false });
    void NativeNavigation.setNavbar({
      title: TABS.find((tab) => tab.id === tabId)?.title ?? "",
      backButton: { visible: false },
      leftItems: [],
    });
  }, [pathname]);
}
