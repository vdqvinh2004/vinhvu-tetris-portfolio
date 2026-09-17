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
    expect(screen.getByRole("img", { name: /next block: I/i })).toBeInTheDocument();
    expect(screen.getByText(/Space/)).toBeInTheDocument();
    expect(screen.getByText(/Clear 4 lines in each round/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /skip intro/i }));

    expect(onEnterPortfolio).toHaveBeenCalledOnce();
  });

  it("ticks the demo score while attract mode clears lines", async () => {
    render(<LandingGame onEnterPortfolio={vi.fn()} />);

    // The score span is keyed per value (each clear replays the pop animation),
    // so re-query the current node on every poll instead of holding a reference.
    await vi.waitFor(
      () => {
        const score = screen.getByText(/^\d{5}$/);
        expect(Number(score.textContent)).toBeGreaterThan(0);
      },
      { timeout: 20000, interval: 250 },
    );
    const score = screen.getByText(/^\d{5}$/);
    expect(Number(score.textContent) % 100).toBe(0);
  });

  it("pulses a round chip when the demo completes a round", async () => {
    render(<LandingGame onEnterPortfolio={vi.fn()} />);

    // A demo round is 4 lines; the chip flashes for a short window after it.
    await vi.waitFor(
      () => {
        expect(screen.getByText(/demo round 1 clear/i)).toBeInTheDocument();
      },
      { timeout: 20000, interval: 200 },
    );
    const chip = screen.getByText(/demo round 1 clear/i).closest("div");
    expect(chip).toHaveAttribute("aria-hidden", "true");
  });

  it("starts the game through an accessible action", async () => {
    const user = userEvent.setup();
    render(<LandingGame onEnterPortfolio={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /play portfolio run/i }));

    expect(screen.getByText(/Start focuses this panel/i)).toBeInTheDocument();
    expect(screen.queryByText("RUNNING")).not.toBeInTheDocument();
    expect(screen.getByText(/A \/ Left/i)).toBeInTheDocument();
    expect(screen.getByText(/W \/ Up/i)).toBeInTheDocument();
  });
});
