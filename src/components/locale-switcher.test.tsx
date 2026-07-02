import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LocaleSwitcher } from "#/components/locale-switcher";

import { axe } from "../../vitest-setup";

// setLocale navigates the document (window.location) in the real runtime, which
// jsdom can't do, so stub just that function and keep the rest of the runtime real.
const { setLocale } = vi.hoisted(() => ({
  setLocale: vi.fn<typeof import("#/paraglide/runtime.js").setLocale>(),
}));

vi.mock("#/paraglide/runtime.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("#/paraglide/runtime.js")>()),
  setLocale,
}));

describe("LocaleSwitcher", () => {
  it("renders a button for every available locale", () => {
    render(<LocaleSwitcher />);

    const group = screen.getByRole("group", { name: /language/i });
    expect(within(group).getAllByRole("button").length).toBeGreaterThanOrEqual(2);
  });

  it("marks the active locale as pressed", () => {
    render(<LocaleSwitcher />);

    expect(screen.getByRole("button", { name: "en" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "de" })).toHaveAttribute("aria-pressed", "false");
  });

  it("switches to the locale of the clicked button", async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByRole("button", { name: "de" }));

    expect(setLocale).toHaveBeenCalledExactlyOnceWith("de");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<LocaleSwitcher />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
