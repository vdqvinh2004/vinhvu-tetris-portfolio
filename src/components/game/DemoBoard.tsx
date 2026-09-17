import { getCells } from "../../game/pieces";
import type { DemoFrame } from "../../game/demo";

interface DemoBoardProps {
  frame: DemoFrame;
}

/**
 * Static render of one scripted attract-mode frame: the settled stack, the
 * falling piece, and a flash on rows about to clear. Presentational only —
 * all timing lives in useDemoPlayback.
 */
export function DemoBoard({ frame }: DemoBoardProps) {
  const board = frame.board.map((row) => [...row]);
  const falling = frame.falling;
  if (falling) {
    getCells({ kind: falling.kind, rotation: falling.rot, x: 0, y: 0 }).forEach(
      ([cellX, cellY]) => {
        const x = falling.x + cellX;
        const y = falling.y + cellY;
        if (y >= 0 && y < board.length && x >= 0 && x < board[0].length) {
          board[y][x] = falling.kind;
        }
      },
    );
  }

  return (
    <div className="game-board demo-board" aria-hidden="true">
      {board.flatMap((row, y) =>
        row.map((cell, x) => {
          const clearing = frame.clearingRows.includes(y);
          return (
            <span
              className={`game-cell${cell ? ` piece-${cell}` : ""}${clearing ? " demo-clearing" : ""}`}
              key={`${x}-${y}`}
            />
          );
        }),
      )}
    </div>
  );
}
