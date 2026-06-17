import { m } from "#/paraglide/messages.js";
import { getLocale, locales, setLocale } from "#/paraglide/runtime.js";

/**
 * Lets the user switch the active locale. Each button calls Paraglide's `setLocale`, which persists
 * the choice (cookie) and navigates to the localized URL so the whole document re-renders in the
 * new language.
 */
export function LocaleSwitcher() {
  const active = getLocale();

  return (
    <fieldset
      aria-label={m.locale_switcher_aria_label()}
      className="inline-flex gap-1 rounded-lg border border-border bg-card p-1"
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => {
            void setLocale(locale);
          }}
          aria-pressed={locale === active}
          className="cursor-pointer rounded-md px-3 py-1 text-sm text-muted-foreground uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-primary aria-pressed:text-primary-foreground"
        >
          {locale}
        </button>
      ))}
    </fieldset>
  );
}
