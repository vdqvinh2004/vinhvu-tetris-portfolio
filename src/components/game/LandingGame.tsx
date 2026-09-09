import { useEffect, useReducer, useRef, useState } from "react";
import { GameBoard } from "./GameBoard";
import { GameControls } from "./GameControls";
import { gameReducer, initialGameState } from "../../game/reducer";

interface LandingGameProps {
  onEnterPortfolio: () => void;
}

export function LandingGame({ onEnterPortfolio }: LandingGameProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, initialGameState);
  const [reducedMotion, setReducedMotion] = useState(false);
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
    const interval = window.setInterval(() => dispatch({ type: "tick" }), 650);
    return () => window.clearInterval(interval);
  }, [reducedMotion, state.phase]);

  useEffect(() => {
    if ((state.phase === "unlocked" || state.phase === "skipped") && !hasEnteredPortfolio.current) {
      hasEnteredPortfolio.current = true;
      onEnterPortfolio();
    }
  }, [onEnterPortfolio, state.phase]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const actions: Record<string, () => void> = {
      ArrowLeft: () => dispatch({ type: "move", direction: -1 }),
      ArrowRight: () => dispatch({ type: "move", direction: 1 }),
      ArrowUp: () => dispatch({ type: "rotate" }),
      ArrowDown: () => dispatch({ type: "tick" }),
      " ": () => dispatch({ type: "drop" }),
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
  };

  return (
    <section className="landing" aria-labelledby="landing-title">
      <div className="landing-copy">
        <p className="eyebrow">INSERT COIN / VIEW PORTFOLIO</p>
        <h1 id="landing-title">Vinh Vu builds systems that do not drop the ball.</h1>
        <p>
          Full-stack developer and automation QA engineer. Clear three lines to unlock the
          portfolio, or take the express route below.
        </p>
        <button className="skip-button" onClick={() => dispatch({ type: "skip" })}>
          Skip intro <span aria-hidden="true">-&gt;</span>
        </button>
      </div>

      <div className="game-console" onKeyDown={onKeyDown} tabIndex={0}>
        <div className="game-hud" aria-live="polite">
          <span>SCORE {state.score.toString().padStart(5, "0")}</span>
          <span>LINES {state.linesCleared}/3</span>
        </div>
        <GameBoard state={state} />
        <p className="game-status" role="status">
          {state.phase === "game-over"
            ? "Game over. Restart or skip to the portfolio."
            : state.phase === "idle"
              ? reducedMotion
                ? "Reduced motion is on. Start to play at your pace."
                : "Start game when ready."
              : "Arrow keys move. Up rotates. Space drops."}
        </p>
        <GameControls
          isGameOver={state.phase === "game-over"}
          isPlaying={state.phase === "playing"}
          onDrop={() => dispatch({ type: "drop" })}
          onMove={(direction) => dispatch({ type: "move", direction })}
          onRestart={restart}
          onRotate={() => dispatch({ type: "rotate" })}
          onStart={() => dispatch({ type: "start" })}
        />
      </div>
    </section>
  );
}
