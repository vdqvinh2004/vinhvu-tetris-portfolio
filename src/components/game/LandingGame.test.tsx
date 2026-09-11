import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LandingGame } from "./LandingGame";

describe("LandingGame", () => {
  it("shows instructions and takes a visitor into the portfolio through skip", async () => {
    const user = userEvent.setup();
    const onEnterPortfolio = vi.fn();
    render(<LandingGame onEnterPortfolio={onEnterPortfolio} />);

    expect(screen.getByRole("heading", { name: /how to play/i })).toBeInTheDocument();
    expect(screen.getByText(/Space/)).toBeInTheDocument();
    expect(screen.getByText(/Clear 4 lines in each round/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /skip intro/i }));

    expect(onEnterPortfolio).toHaveBeenCalledOnce();
  });

  it("starts the game through an accessible action", async () => {
    const user = userEvent.setup();
    render(<LandingGame onEnterPortfolio={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /play portfolio run/i }));

    expect(screen.getByText(/Start focuses this panel/i)).toBeInTheDocument();
    expect(screen.getByText(/A \/ Left/i)).toBeInTheDocument();
    expect(screen.getByText(/W \/ Up/i)).toBeInTheDocument();
  });
});
