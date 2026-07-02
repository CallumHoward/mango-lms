import type { FormEvent } from "react";

import { useTheme } from "#/components/theme/theme-context";
import { isTheme, setThemeServerFn, THEMES, type Theme } from "#/lib/theme";
import { m } from "#/paraglide/messages.js";

const LABELS: Record<Theme, () => string> = {
  light: m.theme_light,
  dark: m.theme_dark,
  system: m.theme_system,
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const value = submitter instanceof HTMLButtonElement ? submitter.value : undefined;
    // Progressive enhancement: when JS runs, apply the theme client-side and skip
    // the round-trip. Without JS this handler never fires and the form posts to
    // setThemeServerFn, which sets the cookie and redirects back.
    if (isTheme(value)) {
      event.preventDefault();
      setTheme(value);
    }
  }

  return (
    <form method="post" action={setThemeServerFn.url} onSubmit={handleSubmit}>
      <fieldset
        aria-label={m.theme_aria_label()}
        className="inline-flex gap-1 rounded-lg border border-border bg-card p-1"
      >
        {THEMES.map((option) => (
          <button
            key={option}
            type="submit"
            name="theme"
            value={option}
            aria-pressed={theme === option}
            className="cursor-pointer rounded-md px-3 py-1 text-sm text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {LABELS[option]()}
          </button>
        ))}
      </fieldset>
    </form>
  );
}
