import { BOARD_HEIGHT, BOARD_WIDTH, getCells } from "./pieces";
import type { ActivePiece, Board, Cell, PieceKind } from "./pieces";

export interface DemoMove {
  kind: PieceKind;
  rot: number;
  x: number;
}

export interface DemoFalling {
  kind: PieceKind;
  rot: number;
  x: number;
  y: number;
  hardDrop: boolean;
}

export interface DemoFrame {
  board: Board;
  falling: DemoFalling | null;
  clearingRows: number[];
  delay: number;
  /** True for settled states that are safe to show when reduced motion is on. */
  calm: boolean;
}

/**
 * Two scripted games. Each one is physically honest: every lock position is a
 * real gravity drop, every clear fires the moment its rows complete, and each
 * game ends with a completely empty board so the loop restarts perfectly.
 *
 * Game 1 clears single, single, double using T J L I Z S.
 * Game 2 clears single, single, double using T J L I O.
 * Together the loop shows all seven tetrominoes.
 */
export const DEMO_GAMES: DemoMove[][] = [
  [
    { kind: "T", rot: 0, x: 3 },
    { kind: "J", rot: 0, x: 0 },
    { kind: "L", rot: 0, x: 7 },
    { kind: "I", rot: 1, x: 4 },
    { kind: "Z", rot: 0, x: 0 },
    { kind: "T", rot: 1, x: 2 },
    { kind: "L", rot: 3, x: 4 },
    { kind: "S", rot: 0, x: 7 },
    { kind: "J", rot: 2, x: 0 },
    { kind: "L", rot: 2, x: 7 },
  ],
  [
    { kind: "T", rot: 0, x: 3 },
    { kind: "J", rot: 0, x: 0 },
    { kind: "L", rot: 0, x: 7 },
    { kind: "I", rot: 1, x: 4 },
    { kind: "O", rot: 0, x: 0 },
    { kind: "T", rot: 1, x: 2 },
    { kind: "L", rot: 3, x: 4 },
    { kind: "O", rot: 0, x: 6 },
    { kind: "L", rot: 2, x: 0 },
    { kind: "J", rot: 2, x: 7 },
  ],
];

const ROTATION_COUNTS: Record<PieceKind, number> = {
  I: 2,
  O: 1,
  T: 4,
  S: 2,
  Z: 2,
  J: 4,
  L: 4,
};

function emptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array<Cell>(BOARD_WIDTH).fill(null));
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function collidesAt(board: Board, piece: ActivePiece): boolean {
  return getCells(piece).some(([cellX, cellY]) => {
    const x = piece.x + cellX;
    const y = piece.y + cellY;
    return x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT || (y >= 0 && board[y][x] !== null);
  });
}

function dropY(board: Board, kind: PieceKind, rot: number, x: number): number {
  let y = -4;
  while (!collidesAt(board, { kind, rotation: rot, x, y: y + 1 })) {
    y += 1;
  }
  return y;
}

function lockBoard(board: Board, kind: PieceKind, rot: number, x: number, y: number): Board {
  const next = cloneBoard(board);
  getCells({ kind, rotation: rot, x, y: 0 }).forEach(([cellX, cellY]) => {
    const px = x + cellX;
    const py = y + cellY;
    if (py >= 0 && py < BOARD_HEIGHT && px >= 0 && px < BOARD_WIDTH) {
      next[py][px] = kind;
    }
  });
  return next;
}

function fullRows(board: Board): number[] {
  const rows: number[] = [];
  board.forEach((row, y) => {
    if (row.every((cell) => cell !== null)) rows.push(y);
  });
  return rows;
}

function clearedBoard(board: Board): Board {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const blankRows = Array.from({ length: BOARD_HEIGHT - remaining.length }, () =>
    Array<Cell>(BOARD_WIDTH).fill(null),
  );
  return [...blankRows, ...remaining];
}

function isEmpty(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell === null));
}

const SPAWN_X = 3;

export function buildDemoFrames(): DemoFrame[] {
  const frames: DemoFrame[] = [];
  frames.push({ board: emptyBoard(), falling: null, clearingRows: [], delay: 700, calm: true });

  for (const game of DEMO_GAMES) {
    let board = emptyBoard();

    for (const move of game) {
      const targetY = dropY(board, move.kind, move.rot, move.x);
      const rotations = ROTATION_COUNTS[move.kind];
      const spawnRot = rotations > 1 ? (move.rot + rotations - 1) % rotations : 0;

      // Highest y where the final orientation sits without overlapping the stack,
      // so the mid-air rotation reads as intentional rather than clipping.
      let rotateY = Math.max(0, targetY - 3);
      while (
        rotateY > 1 &&
        collidesAt(board, { kind: move.kind, rotation: move.rot, x: move.x, y: rotateY })
      ) {
        rotateY -= 1;
      }
      const fallY = (() => {
        let y = Math.max(1, Math.min(rotateY - 2, targetY - 1));
        while (y > 1 && collidesAt(board, { kind: move.kind, rotation: spawnRot, x: move.x, y })) {
          y -= 1;
        }
        return y;
      })();
      const driftX = SPAWN_X + Math.trunc((move.x - SPAWN_X) / 2);

      const push = (falling: DemoFalling | null, delay: number, calm: boolean) => {
        frames.push({
          board: cloneBoard(board),
          falling,
          clearingRows: [],
          delay,
          calm,
        });
      };

      // Spawn, drift sideways while falling, keep falling, rotate mid-air, hard drop.
      push({ kind: move.kind, rot: spawnRot, x: SPAWN_X, y: 0, hardDrop: false }, 150, false);
      push({ kind: move.kind, rot: spawnRot, x: driftX, y: 1, hardDrop: false }, 130, false);
      push({ kind: move.kind, rot: spawnRot, x: move.x, y: fallY, hardDrop: false }, 130, false);
      push({ kind: move.kind, rot: move.rot, x: move.x, y: rotateY, hardDrop: false }, 150, false);
      push({ kind: move.kind, rot: move.rot, x: move.x, y: targetY, hardDrop: true }, 120, false);

      board = lockBoard(board, move.kind, move.rot, move.x, targetY);
      const cleared = fullRows(board);
      push(null, cleared.length > 0 ? 320 : 300, true);

      if (cleared.length > 0) {
        const lastGameMove = game.indexOf(move) === game.length - 1 && isEmpty(clearedBoard(board));
        frames.push({
          board: cloneBoard(board),
          falling: null,
          clearingRows: cleared,
          delay: lastGameMove ? 950 : 650,
          calm: true,
        });
        board = clearedBoard(board);
        frames.push({
          board: cloneBoard(board),
          falling: null,
          clearingRows: [],
          delay: 380,
          calm: true,
        });
      }
    }
  }

  return frames;
}
