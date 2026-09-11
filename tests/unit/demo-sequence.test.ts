import { describe, expect, it } from "vitest";
import { DEMO_GAMES, buildDemoFrames } from "../../src/game/demo";
import type { PieceKind } from "../../src/game/pieces";

describe("portfolio autoplay demo", () => {
  it("shows every tetromino across the loop without mirrored repeats", () => {
    const kinds = new Set<PieceKind>();
    const order: PieceKind[] = [];
    for (const game of DEMO_GAMES) {
      for (const move of game) {
        kinds.add(move.kind);
        order.push(move.kind);
      }
    }

    expect([...kinds].sort()).toEqual(["I", "J", "L", "O", "S", "T", "Z"]);
    for (let index = 1; index < order.length; index += 1) {
      expect(order[index]).not.toBe(order[index - 1]);
    }
  });

  it("clears single, single, double in each game and restarts from empty", () => {
    const frames = buildDemoFrames();
    expect(frames.length).toBeGreaterThan(80);

    const clearEvents = frames
      .filter((frame) => frame.clearingRows.length > 0)
      .map((frame) => frame.clearingRows.length);
    expect(clearEvents).toEqual([1, 1, 2, 1, 1, 2]);

    const calmEmpty = frames.filter(
      (frame) =>
        frame.calm &&
        frame.falling === null &&
        frame.clearingRows.length === 0 &&
        frame.board.every((row) => row.every((cell) => cell === null)),
    );
    // Loop start plus the end of each of the two games.
    expect(calmEmpty.length).toBeGreaterThanOrEqual(3);
  });

  it("clears completed rows on the very next beat, never leaving them sitting", () => {
    const frames = buildDemoFrames();
    for (let index = 0; index < frames.length; index += 1) {
      const frame = frames[index];
      if (frame.falling !== null || frame.clearingRows.length > 0) continue;
      const completed = frame.board
        .map((row, y) => (row.every((cell) => cell !== null) ? y : -1))
        .filter((y) => y >= 0);
      if (completed.length === 0) continue;
      const next = frames[(index + 1) % frames.length];
      expect(next.clearingRows).toEqual(expect.arrayContaining(completed));
    }
  });

  it("rotates every non-square piece mid-fall before the hard drop", () => {
    const frames = buildDemoFrames();
    const rotsByKind = new Map<PieceKind, Set<number>>();
    for (const frame of frames) {
      if (!frame.falling || frame.falling.hardDrop) continue;
      const set = rotsByKind.get(frame.falling.kind) ?? new Set<number>();
      set.add(frame.falling.rot);
      rotsByKind.set(frame.falling.kind, set);
    }
    for (const kind of ["I", "T", "S", "Z", "J", "L"] as const) {
      // Spawn rotation always differs from landing rotation, so at least
      // two distinct orientations must appear across the fall frames.
      expect(rotsByKind.get(kind)?.size ?? 0).toBeGreaterThanOrEqual(2);
    }
    expect(rotsByKind.get("O")).toEqual(new Set([0]));
  });
});
