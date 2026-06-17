import { Link } from "@tanstack/react-router";

import { TABS } from "@/lib/tabs";
import { setDirection } from "@/lib/transitions";

// Frosted-glass bottom tab bar for the web (and dev server). Hidden on native
// via `html.is-native` (see styles.css), where the real native bar takes over.
export function WebTabBar() {
  return (
    <nav className="web-tabbar" aria-label="Primary">
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          to={tab.path}
          className="web-tabbar-item"
          activeProps={{ "aria-current": "page" }}
          activeOptions={{ exact: tab.path === "/" }}
          onClick={() => setDirection("none")}
        >
          <svg className="web-tabbar-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d={tab.iconPath} />
          </svg>
          <span>{tab.title}</span>
        </Link>
      ))}
    </nav>
  );
}
