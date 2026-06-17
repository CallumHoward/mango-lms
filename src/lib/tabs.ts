// Single source of truth for the app's primary tabs, shared by the native
// tab bar (@capgo/capacitor-native-navigation) and the web fallback bar.
//
// Native iOS renders SF Symbols (which pick up the system Liquid Glass tint);
// `iconPath` (a 24x24 path) drives the web bar and the cross-platform SVG
// fallback used on Android / non-SF-Symbol platforms.

// Material-style 24x24 icon path data.
const ICON_PATHS = {
  home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  about:
    "M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v2h-2V7z",
  settings:
    "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
  notes:
    "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
} as const;

const toSvg = (path: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${path}"/></svg>`;

export interface TabDef {
  /** Stable id echoed back by the native `tabSelect` event. */
  id: string;
  /** Route this tab navigates to (must be a registered route). */
  path: "/" | "/notes" | "/about" | "/settings";
  title: string;
  /** SF Symbol name for iOS (rendered natively, gets the Liquid Glass tint). */
  sfSymbol: string;
  /** 24x24 path data for the web bar. */
  iconPath: string;
  /** Inline SVG string for the native cross-platform icon fallback. */
  svg: string;
}

export const TABS: readonly TabDef[] = [
  {
    id: "home",
    path: "/",
    title: "Home",
    sfSymbol: "house.fill",
    iconPath: ICON_PATHS.home,
    svg: toSvg(ICON_PATHS.home),
  },
  {
    id: "notes",
    path: "/notes",
    title: "Notes",
    sfSymbol: "note.text",
    iconPath: ICON_PATHS.notes,
    svg: toSvg(ICON_PATHS.notes),
  },
  {
    id: "about",
    path: "/about",
    title: "About",
    sfSymbol: "info.circle.fill",
    iconPath: ICON_PATHS.about,
    svg: toSvg(ICON_PATHS.about),
  },
  {
    id: "settings",
    path: "/settings",
    title: "Settings",
    sfSymbol: "gearshape.fill",
    iconPath: ICON_PATHS.settings,
    svg: toSvg(ICON_PATHS.settings),
  },
];

/** Resolve which tab owns a given pathname (longest-prefix match). */
export function tabIdForPath(pathname: string): string {
  const match = [...TABS]
    .sort((a, b) => b.path.length - a.path.length)
    .find((t) => pathname === t.path || (t.path !== "/" && pathname.startsWith(t.path)));
  return match?.id ?? "home";
}
