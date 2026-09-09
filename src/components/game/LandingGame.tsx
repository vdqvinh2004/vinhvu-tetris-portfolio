import { useEffect, useReducer, useRef, useState } from "react";
import { GameBoard } from "./GameBoard";
import { GameControls } from "./GameControls";
import { GameRewards } from "./GameRewards";
import {
  LINES_PER_ROUND,
  TOTAL_LINES,
  TOTAL_ROUNDS,
  gameReducer,
  initialGameState,
} from "../../game/reducer";

interface LandingGameProps {
  onEnterPortfolio: () => void;
}

export function LandingGame({ onEnterPortfolio }: LandingGameProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, initialGameState);
  const [reducedMotion, setReducedMotion] = useState(false);
  const gameConsoleRef = useRef<HTMLDivElement>(null);
  const hasEnteredPortfolio = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (state.phase !== "playing" || reducedMotion) return undefined;
    const tickDelay = Math.max(400, 800 - (state.round - 1) * 125);
    const interval = window.setInterval(() => dispatch({ type: "tick" }), tickDelay);
    return () => window.clearInterval(interval);
  }, [reducedMotion, state.phase, state.round]);

  useEffect(() => {
    if (state.phase === "skipped" && !hasEnteredPortfolio.current) {
      hasEnteredPortfolio.current = true;
      onEnterPortfolio();
    }
  }, [onEnterPortfolio, state.phase]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const actions: Record<string, () => void> = {
      ArrowLeft: () => dispatch({ type: "move", direction: -1 }),
      a: () => dispatch({ type: "move", direction: -1 }),
      A: () => dispatch({ type: "move", direction: -1 }),
      ArrowRight: () => dispatch({ type: "move", direction: 1 }),
      d: () => dispatch({ type: "move", direction: 1 }),
      D: () => dispatch({ type: "move", direction: 1 }),
      " ": () => dispatch({ type: "rotate" }),
      ArrowUp: () => dispatch({ type: "drop" }),
      w: () => dispatch({ type: "drop" }),
      W: () => dispatch({ type: "drop" }),
      ArrowDown: () => dispatch({ type: "tick" }),
      s: () => dispatch({ type: "tick" }),
      S: () => dispatch({ type: "tick" }),
    };
    const action = actions[event.key];
    if (action && state.phase === "playing") {
      event.preventDefault();
      action();
    }
  };

  const restart = () => {
    hasEnteredPortfolio.current = false;
    dispatch({ type: "restart" });
    gameConsoleRef.current?.focus();
  };

  const start = () => {
    dispatch({ type: "start" });
    gameConsoleRef.current?.focus();
  };

  const enterPortfolio = () => {
    hasEnteredPortfolio.current = true;
    onEnterPortfolio();
  };

  const nextReward =
    state.rewardsUnlocked < TOTAL_ROUNDS
      ? `Clear ${LINES_PER_ROUND - (state.linesCleared % LINES_PER_ROUND)} line${
          LINES_PER_ROUND - (state.linesCleared % LINES_PER_ROUND) === 1 ? "" : "s"
        } to unlock reward ${state.rewardsUnlocked + 1}.`
      : "All portfolio files unlocked.";

  return (
    <section className="landing" aria-labelledby="landing-title">
      <div className="landing-copy">
        <p className="eyebrow">INSERT COIN / VIEW PORTFOLIO</p>
        <h1 id="landing-title">Vinh Vu builds systems that do not drop the ball.</h1>
        <p>
          Full-stack developer and automation QA engineer. Complete four rounds to reveal my work
          one file at a time, or take the express route below.
        </p>
        <button className="skip-button" onClick={() => dispatch({ type: "skip" })}>
          Skip intro <span aria-hidden="true">-&gt;</span>
        </button>
      </div>

      <div className="game-console" onKeyDown={onKeyDown} ref={gameConsoleRef} tabIndex={0}>
        <div className="game-hud" aria-live="polite">
          <span>SCORE {state.score.toString().padStart(5, "0")}</span>
          <span>
            ROUND {state.round}/{TOTAL_ROUNDS}
          </span>
          <span>
            LINES {state.linesCleared}/{TOTAL_LINES}
          </span>
        </div>
        <GameBoard state={state} />
        <section aria-labelledby="how-to-play-title" className="how-to-play">
          <h2 id="how-to-play-title">How to play</h2>
          <p>
            Clear {LINES_PER_ROUND} lines per round to reveal a portfolio file. Starting a game
            focuses this panel for keyboard play.
          </p>
          <dl>
            <div>
              <dt>A or Left Arrow</dt>
              <dd>Move left</dd>
            </div>
            <div>
              <dt>D or Right Arrow</dt>
              <dd>Move right</dd>
            </div>
            <div>
              <dt>Space</dt>
              <dd>Rotate</dd>
            </div>
            <div>
              <dt>W or Up Arrow</dt>
              <dd>Hard drop</dd>
            </div>
            <div>
              <dt>S or Down Arrow</dt>
              <dd>Soft drop</dd>
            </div>
          </dl>
          <p className="touch-control-note">Touch controls are available on small screens.</p>
        </section>
        <p className="game-status" role="status">
          {state.phase === "game-over"
            ? "Game over. Restart or skip to the portfolio."
            : state.phase === "unlocked"
              ? "Mission complete. Your full portfolio is ready."
              : state.phase === "idle"
                ? reducedMotion
                  ? "Reduced motion is on. Start to play at your pace."
                  : "Start game when ready."
                : nextReward}
        </p>
        {state.phase === "unlocked" ? (
          <button className="game-session-button" onClick={enterPortfolio}>
            Enter full portfolio
          </button>
        ) : (
          <GameControls
            isGameOver={state.phase === "game-over"}
            isPlaying={state.phase === "playing"}
            onDrop={() => dispatch({ type: "drop" })}
            onMove={(direction) => dispatch({ type: "move", direction })}
            onRestart={restart}
            onRotate={() => dispatch({ type: "rotate" })}
            onStart={start}
          />
        )}
        <GameRewards rewardsUnlocked={state.rewardsUnlocked} />
      </div>
    </section>
  );
}
