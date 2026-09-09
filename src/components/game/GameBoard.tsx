import { mergeForDisplay } from "../../game/engine";
import type { GameState } from "../../game/reducer";

interface GameBoardProps {
  state: GameState;
}

export function GameBoard({ state }: GameBoardProps) {
  const board = mergeForDisplay(state.board, state.activePiece);

  return (
    <div className="game-board" aria-label="Tetris game board" role="grid">
      {board.flatMap((row, y) =>
        row.map((cell, x) => (
          <span
            aria-hidden="true"
            className={`game-cell${cell ? ` piece-${cell}` : ""}`}
            key={`${x}-${y}`}
            role="gridcell"
          />
        )),
      )}
    </div>
  );
}
