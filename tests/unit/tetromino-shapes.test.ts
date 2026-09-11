import { describe, expect, it } from "vitest";
import { baseCells, pieceKinds } from "../../src/game/pieces";
import type { PieceKind } from "../../src/game/pieces";

describe("tetromino base shapes", () => {
  it("covers all seven kinds with four cells each", () => {
    expect([...pieceKinds].sort()).toEqual(["I", "J", "L", "O", "S", "T", "Z"]);
    for (const kind of pieceKinds) {
      expect(baseCells(kind)).toHaveLength(4);
    }
  });

  it("uses seven distinct layouts", () => {
    const layouts = new Set(pieceKinds.map((kind) => JSON.stringify(baseCells(kind))));
    expect(layouts.size).toBe(7);
  });

  it("matches the canonical 3D cluster layouts", () => {
    const expected: Record<PieceKind, readonly (readonly [number, number])[]> = {
      I: [
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      O: [
        [1, 0],
        [2, 0],
        [1, 1],
        [2, 1],
      ],
      T: [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      S: [
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
      ],
      Z: [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
      ],
      J: [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      L: [
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
    };
    for (const kind of pieceKinds) {
      expect(baseCells(kind)).toEqual(expected[kind]);
    }
  });
});
