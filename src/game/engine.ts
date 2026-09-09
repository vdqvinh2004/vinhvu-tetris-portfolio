import { BOARD_HEIGHT, BOARD_WIDTH, createBoard, getCells } from "./pieces";
import type { ActivePiece, Board, Cell } from "./pieces";

export function collides(board: Board, piece: ActivePiece): boolean {
  return getCells(piece).some(([cellX, cellY]) => {
    const x = piece.x + cellX;
    const y = piece.y + cellY;
    return x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT || (y >= 0 && board[y][x] !== null);
  });
}

export function lockPiece(board: Board, piece: ActivePiece): Board {
  const next = board.map((row) => [...row]);
  getCells(piece).forEach(([cellX, cellY]) => {
    const x = piece.x + cellX;
    const y = piece.y + cellY;
    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) next[y][x] = piece.kind;
  });
  return next;
}

export function clearLines(board: Board): { board: Board; count: number } {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const count = BOARD_HEIGHT - remaining.length;
  const blankRows = Array.from({ length: count }, () => Array<Cell>(BOARD_WIDTH).fill(null));
  return { board: [...blankRows, ...remaining], count };
}

export function mergeForDisplay(board: Board, piece: ActivePiece): Board {
  const display = board.map((row) => [...row]);
  getCells(piece).forEach(([cellX, cellY]) => {
    const x = piece.x + cellX;
    const y = piece.y + cellY;
    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) display[y][x] = piece.kind;
  });
  return display;
}

export function emptyBoard(): Board {
  return createBoard();
}
