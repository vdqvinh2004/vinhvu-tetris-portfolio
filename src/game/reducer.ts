import { clearLines, collides, emptyBoard, lockPiece } from "./engine";
import type { ActivePiece, Board, PieceKind } from "./pieces";

export type GamePhase = "idle" | "playing" | "game-over" | "unlocked" | "skipped";

export const LINES_PER_ROUND = 2;
export const TOTAL_ROUNDS = 4;
export const TOTAL_LINES = LINES_PER_ROUND * TOTAL_ROUNDS;

export interface GameState {
  board: Board;
  activePiece: ActivePiece;
  nextPiece: PieceKind;
  score: number;
  linesCleared: number;
  round: number;
  rewardsUnlocked: number;
  phase: GamePhase;
}

export type GameAction =
  | { type: "start" }
  | { type: "move"; direction: -1 | 1 }
  | { type: "rotate" }
  | { type: "tick" }
  | { type: "drop" }
  | { type: "skip" }
  | { type: "restart" };

const spawnedPiece = (kind: PieceKind): ActivePiece => ({ kind, rotation: 0, x: 3, y: 0 });
const nextKind = (kind: PieceKind): PieceKind => {
  const order: PieceKind[] = ["T", "I", "O", "L", "J", "S", "Z"];
  return order[(order.indexOf(kind) + 1) % order.length];
};

export function initialGameState(): GameState {
  return {
    board: emptyBoard(),
    activePiece: spawnedPiece("T"),
    nextPiece: "I",
    score: 0,
    linesCleared: 0,
    round: 1,
    rewardsUnlocked: 0,
    phase: "idle",
  };
}

function moveDown(state: GameState): GameState {
  const lowered = { ...state.activePiece, y: state.activePiece.y + 1 };
  if (!collides(state.board, lowered)) return { ...state, activePiece: lowered };

  const cleared = clearLines(lockPiece(state.board, state.activePiece));
  const linesCleared = state.linesCleared + cleared.count;
  const rewardsUnlocked = Math.min(TOTAL_ROUNDS, Math.floor(linesCleared / LINES_PER_ROUND));
  const round = Math.min(TOTAL_ROUNDS, rewardsUnlocked + 1);
  if (linesCleared >= TOTAL_LINES) {
    return {
      ...state,
      board: cleared.board,
      score: state.score + cleared.count * 100,
      linesCleared,
      round,
      rewardsUnlocked,
      phase: "unlocked",
    };
  }

  const activePiece = spawnedPiece(state.nextPiece);
  const nextPiece = nextKind(state.nextPiece);
  return collides(cleared.board, activePiece)
    ? {
        ...state,
        board: cleared.board,
        score: state.score + cleared.count * 100,
        linesCleared,
        round,
        rewardsUnlocked,
        phase: "game-over",
      }
    : {
        ...state,
        board: cleared.board,
        score: state.score + cleared.count * 100,
        linesCleared,
        round,
        rewardsUnlocked,
        activePiece,
        nextPiece,
      };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "restart") return initialGameState();
  if (action.type === "skip") return { ...state, phase: "skipped" };
  if (action.type === "start" && state.phase === "idle") return { ...state, phase: "playing" };
  if (state.phase !== "playing") return state;

  if (action.type === "move") {
    const activePiece = { ...state.activePiece, x: state.activePiece.x + action.direction };
    return collides(state.board, activePiece) ? state : { ...state, activePiece };
  }
  if (action.type === "rotate") {
    const activePiece = { ...state.activePiece, rotation: state.activePiece.rotation + 1 };
    return collides(state.board, activePiece) ? state : { ...state, activePiece };
  }
  if (action.type === "drop") {
    let dropped = state;
    while (dropped.phase === "playing") {
      const beforeY = dropped.activePiece.y;
      dropped = moveDown(dropped);
      if (dropped.activePiece.y <= beforeY) break;
    }
    return dropped;
  }
  return moveDown(state);
}
