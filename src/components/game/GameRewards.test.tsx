import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { portfolio } from "../../content/portfolio";
import { GameRewards } from "./GameRewards";

describe("GameRewards", () => {
  it("shows one achievement and dismisses it after the display window", () => {
    vi.useFakeTimers();
    render(<GameRewards rewardsUnlocked={1} />);

    expect(document.querySelector(".achievement-card p")).toHaveTextContent(
      portfolio.gameRewards[0].detail,
    );
    expect(screen.queryByText("ACHIEVEMENT UNLOCKED")).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4300));
    expect(document.querySelector(".achievement-card p")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
