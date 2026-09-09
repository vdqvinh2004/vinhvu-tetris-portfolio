import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LandingGame } from "./LandingGame";

describe("LandingGame", () => {
  it("shows instructions and takes a visitor into the portfolio through skip", async () => {
    const user = userEvent.setup();
    const onEnterPortfolio = vi.fn();
    render(<LandingGame onEnterPortfolio={onEnterPortfolio} />);

    expect(screen.getByText(/Clear three lines/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /skip intro/i }));

    expect(onEnterPortfolio).toHaveBeenCalledOnce();
  });

  it("starts the game through an accessible action", async () => {
    const user = userEvent.setup();
    render(<LandingGame onEnterPortfolio={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /start game/i }));

    expect(screen.getByRole("button", { name: /move piece left/i })).toBeInTheDocument();
  });
});
