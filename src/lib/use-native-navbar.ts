import { NativeNavigation } from "@capgo/capacitor-native-navigation";
import { useRouter } from "@tanstack/react-router";
import { useCallback } from "react";

import { useNativeChrome } from "@/lib/native-chrome";
import { setDirection } from "@/lib/transitions";

// Native top navbar (Liquid Glass on iOS 26+) with a chevron back button, for
// pushed detail routes outside the tabbed layout. Hides the tab bar while shown
// and routes the back tap. The navbar itself is left visible on exit — the
// _tabs layout re-titles it — so its height never changes (no layout shift).
// No-op on the web (the page's own back link covers it there).
export function useNativeNavbar(title: string) {
  const router = useRouter();

  const register = useCallback(async () => {
    // Idempotent; also covers deep-linking straight to a detail route without
    // first passing through the tabbed layout.
    await NativeNavigation.configure({ enabled: true, contentInsetMode: "css" });
    await NativeNavigation.setTabbar({ hidden: true });
    // chevron.backward is the standard iOS back glyph (an SF Symbol). The
    // plugin's text backButton can't show it, so use a left bar item.
    await NativeNavigation.setNavbar({
      title,
      backButton: { visible: false },
      leftItems: [{ id: "back", title: "Notes", icon: { ios: { sfSymbol: "chevron.backward" } } }],
    });

    return NativeNavigation.addListener("navbarItemTap", (event) => {
      if (event.id !== "back") return;
      // Pop through history so the cap-router-outlet plays the back animation
      // and the URL stays in sync (same path the swipe gesture takes).
      setDirection("back");
      if (router.history.canGoBack()) router.history.back();
      else void router.navigate({ to: "/notes" });
    });
  }, [router, title]);

  useNativeChrome(register);
}
