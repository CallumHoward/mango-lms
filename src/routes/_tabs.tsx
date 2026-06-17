import { Outlet, createFileRoute } from "@tanstack/react-router";

import { useNativeTabBar } from "@/lib/use-native-tab-bar";

// Pathless layout for the tabbed section of the app. Routes nested under it
// (Home, About, Settings, Notes list) share the bottom navigation; routes
// outside it (e.g. a note detail) render without tabs. The web fallback bar is
// rendered at the root (outside the transition outlet) keyed off this layout.
export const Route = createFileRoute("/_tabs")({
  component: TabsLayout,
});

function TabsLayout() {
  useNativeTabBar();

  return <Outlet />;
}
