import type { ReactNode } from "react";

// Wraps a route's body in the custom elements the cap-router-outlet animates.
// Native bars are owned by @capgo/capacitor-native-navigation, so there is no
// cap-header/cap-footer here — only the page content.
export function Page({ children }: { children: ReactNode }) {
  return (
    <cap-page>
      <cap-content slot="content" fullscreen>
        {children}
      </cap-content>
    </cap-page>
  );
}
