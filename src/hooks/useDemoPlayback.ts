import { useEffect, useMemo, useState } from "react";
import { buildDemoFrames } from "../game/demo";
import { LINES_PER_ROUND } from "../game/reducer";
import type { DemoFrame } from "../game/demo";

export interface DemoPlayback {
  frame: DemoFrame;
  /** 100 points per line cleared, derived from the frame position — ticks as clears flash. */
  score: number;
  /** Demo round (LINES_PER_ROUND lines) completed within the last few frames, else null. */
  roundFlash: number | null;
}

/**
 * Replays the scripted demo frames on an interval, looping forever. The caller
 * owns when playback runs (attract mode); `active: false` pauses cleanly. The
 * frame script is deterministic, so playback state is a single monotonic tick
 * and everything else (frame, score) is derived during render.
 */
export function useDemoPlayback(active: boolean): DemoPlayback | undefined {
  const [frames] = useState(() => buildDemoFrames());
  const [tick, setTick] = useState(0);

  // Prefix sum: cumulative lines cleared by frames 0..i within one loop.
  const cumClears = useMemo(
    () =>
      frames.reduce<number[]>((sums, frame) => {
        const previous = sums.length > 0 ? sums[sums.length - 1] : 0;
        sums.push(previous + frame.clearingRows.length);
        return sums;
      }, []),
    [frames],
  );

  useEffect(() => {
    if (!active) return undefined;
    const current = frames[tick % frames.length];
    const timer = window.setTimeout(() => {
      setTick((prev) => prev + 1);
    }, current?.delay ?? 700);
    return () => window.clearTimeout(timer);
  }, [active, frames, tick]);

  if (!active) return undefined;
  const index = tick % frames.length;
  const loops = Math.floor(tick / frames.length);
  const lines = loops * (cumClears[cumClears.length - 1] ?? 0) + (cumClears[index] ?? 0);

  // A round chip shows for a short window of frames after each round-completing
  // clear. Derived from the monotonic tick, so it survives pause/resume and
  // loop wrap-around without extra state.
  const linesAt = (t: number) =>
    Math.floor(t / frames.length) * (cumClears[cumClears.length - 1] ?? 0) +
    (cumClears[t % frames.length] ?? 0);
  const FLASH_FRAMES = 5;
  const roundNow = Math.floor(linesAt(tick) / LINES_PER_ROUND);
  const roundBeforeWindow = Math.floor(
    linesAt(Math.max(tick - FLASH_FRAMES + 1, 0)) / LINES_PER_ROUND,
  );
  const roundFlash = roundNow > roundBeforeWindow ? roundNow : null;

  return { frame: frames[index], score: lines * 100, roundFlash };
}
