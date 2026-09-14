import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GameRewards } from "./GameRewards";

describe("GameRewards", () => {
  it("shows one achievement and dismisses it after the display window", () => {
    vi.useFakeTimers();
    render(<GameRewards rewardsUnlocked={1} />);

    expect(screen.getAllByText("ACHIEVEMENT UNLOCKED")).toHaveLength(1);
    act(() => vi.advanceTimersByTime(4300));
    expect(screen.queryByText("ACHIEVEMENT UNLOCKED")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
