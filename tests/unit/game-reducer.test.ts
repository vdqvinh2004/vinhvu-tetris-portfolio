import { describe, expect, it } from "vitest";
import { clearLines } from "../../src/game/engine";
import { BOARD_HEIGHT, BOARD_WIDTH, createBoard } from "../../src/game/pieces";
import {
  LINES_PER_ROUND,
  TOTAL_LINES,
  TOTAL_ROUNDS,
  gameReducer,
  initialGameState,
} from "../../src/game/reducer";

function stateReadyToClearTwoLines() {
  const board = createBoard();
  board[BOARD_HEIGHT - 2].fill("I");
  board[BOARD_HEIGHT - 1].fill("I");
  board[BOARD_HEIGHT - 2][5] = null;
  board[BOARD_HEIGHT - 1][5] = null;
  return {
    board,
    activePiece: { kind: "I" as const, rotation: 1, x: 3, y: BOARD_HEIGHT - 4 },
  };
}

describe("gameReducer", () => {
  it("starts a new game and moves the active piece", () => {
    const initial = initialGameState();
    const started = gameReducer(initial, { type: "start" });
    const moved = gameReducer(started, { type: "move", direction: -1 });

    expect(started.phase).toBe("playing");
    expect(moved.activePiece.x).toBe(initial.activePiece.x - 1);
  });

  it("does not move a piece beyond the board edge", () => {
    let state = gameReducer(initialGameState(), { type: "start" });
    for (let index = 0; index < BOARD_WIDTH; index += 1)
      state = gameReducer(state, { type: "move", direction: -1 });
    expect(state.activePiece.x).toBeGreaterThanOrEqual(0);
  });

  it("clears complete rows", () => {
    const board = createBoard();
    board[BOARD_HEIGHT - 1].fill("T");
    const result = clearLines(board);

    expect(result.count).toBe(1);
    expect(result.board[BOARD_HEIGHT - 1].every((cell) => cell === null)).toBe(true);
  });

  it("skips directly to the portfolio state", () => {
    expect(gameReducer(initialGameState(), { type: "skip" }).phase).toBe("skipped");
  });

  it("unlocks one portfolio reward after each round", () => {
    const state = gameReducer(initialGameState(), { type: "start" });
    const nearReward = {
      ...state,
      ...stateReadyToClearTwoLines(),
    };

    expect(gameReducer(nearReward, { type: "tick" })).toMatchObject({
      linesCleared: LINES_PER_ROUND,
      round: 2,
      rewardsUnlocked: 1,
      phase: "playing",
    });
  });

  it("completes after the final reward and never grants it twice", () => {
    const state = gameReducer(initialGameState(), { type: "start" });
    const finalRound = {
      ...state,
      ...stateReadyToClearTwoLines(),
      linesCleared: TOTAL_LINES - LINES_PER_ROUND,
      round: TOTAL_ROUNDS,
      rewardsUnlocked: TOTAL_ROUNDS - 1,
    };

    const complete = gameReducer(finalRound, { type: "tick" });
    expect(complete).toMatchObject({
      linesCleared: TOTAL_LINES,
      round: TOTAL_ROUNDS,
      rewardsUnlocked: TOTAL_ROUNDS,
      phase: "unlocked",
    });
    expect(gameReducer(complete, { type: "tick" })).toBe(complete);
  });

  it("resets to an idle session on restart", () => {
    const state = gameReducer(gameReducer(initialGameState(), { type: "start" }), {
      type: "restart",
    });
    expect(state).toMatchObject({
      phase: "idle",
      score: 0,
      linesCleared: 0,
      round: 1,
      rewardsUnlocked: 0,
    });
  });
});
