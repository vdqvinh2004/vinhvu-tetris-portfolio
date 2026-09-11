import { useEffect, useMemo, useState } from "react";
import { BOARD_HEIGHT, BOARD_WIDTH, getCells } from "../../game/pieces";
import { buildDemoFrames } from "../../game/demo";

export function PortfolioGameBackground({
  side = "right",
  startFrame = 0,
}: {
  side?: "right" | "left";
  startFrame?: number;
}) {
  const frames = useMemo(() => buildDemoFrames(), []);
  const calmIndexes = useMemo(
    () => frames.map((frame, index) => (frame.calm ? index : -1)).filter((index) => index >= 0),
    [frames],
  );
  const [frameIndex, setFrameIndex] = useState(startFrame % frames.length);
  const [reducedMotion, setReducedMotion] = useState(false);
  const frame = frames[frameIndex];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      const position = calmIndexes.indexOf(frameIndex);
      const next = calmIndexes[position >= 0 ? (position + 1) % calmIndexes.length : 0] ?? 0;
      const timer = window.setTimeout(() => setFrameIndex(next), 900);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(
      () => setFrameIndex((current) => (current + 1) % frames.length),
      frame.delay,
    );
    return () => window.clearTimeout(timer);
  }, [calmIndexes, frame.delay, frameIndex, frames.length, reducedMotion]);

  const displayBoard = frame.board.map((row) => [...row]);
  const fallingCells = new Set<string>();
  const hardDropCells = new Set<string>();

  if (frame.falling) {
    const { kind, rot, x, y, hardDrop } = frame.falling;
    getCells({ kind, rotation: rot, x: 0, y: 0 }).forEach(([cellX, cellY]) => {
      const px = x + cellX;
      const py = y + cellY;
      if (px >= 0 && px < BOARD_WIDTH && py >= 0 && py < BOARD_HEIGHT) {
        displayBoard[py][px] = kind;
        fallingCells.add(`${px}-${py}`);
        if (hardDrop) hardDropCells.add(`${px}-${py}`);
      }
    });
  }

  return (
    <div aria-hidden="true" className="portfolio-game-background">
      <div
        className={
          frame.clearingRows.length > 0
            ? `portfolio-ghost-board${side === "left" ? " is-left" : ""} is-clearing`
            : `portfolio-ghost-board${side === "left" ? " is-left" : ""}`
        }
      >
        {displayBoard.flatMap((row, y) =>
          row.map((cell, x) => {
            const key = `${x}-${y}`;
            const isFilled = cell !== null;
            const isFalling = fallingCells.has(key);
            const isHardDrop = hardDropCells.has(key);
            const isClearing = frame.clearingRows.includes(y) && isFilled;
            const className = [
              "portfolio-ghost-cell",
              isFilled && "is-filled",
              isFalling && !isHardDrop && "is-falling",
              isHardDrop && "is-hard-drop",
              isClearing && "is-clearing",
            ]
              .filter(Boolean)
              .join(" ");
            return <span className={className} key={key} />;
          }),
        )}
      </div>
    </div>
  );
}
