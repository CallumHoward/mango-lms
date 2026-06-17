import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LocaleSwitcher } from "#/components/locale-switcher";

import { axe } from "../../vitest-setup";

describe("LocaleSwitcher", () => {
  it("renders a button for every available locale", () => {
    render(<LocaleSwitcher />);

    const group = screen.getByRole("group", { name: /language/i });
    expect(within(group).getAllByRole("button").length).toBeGreaterThanOrEqual(2);
  });

  it("marks the active locale as pressed", () => {
    render(<LocaleSwitcher />);

    // The base locale (en) is active by default in the test environment.
    expect(screen.getByRole("button", { name: "en" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "de" })).toHaveAttribute("aria-pressed", "false");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<LocaleSwitcher />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
