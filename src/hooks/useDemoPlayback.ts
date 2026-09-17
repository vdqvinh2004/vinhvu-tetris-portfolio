import { useEffect, useState } from "react";
import { buildDemoFrames } from "../game/demo";
import type { DemoFrame } from "../game/demo";

/**
 * Replays the scripted demo frames on an interval, looping forever. The caller
 * owns when playback runs (attract mode); `active: false` pauses cleanly. The
 * frame script is deterministic, so it is built once via a lazy initializer.
 */
export function useDemoPlayback(active: boolean): DemoFrame | undefined {
  const [frames] = useState(() => buildDemoFrames());
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    const current = frames[frameIndex % frames.length];
    const timer = window.setTimeout(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, current?.delay ?? 700);
    return () => window.clearTimeout(timer);
  }, [active, frames, frameIndex]);

  return active ? frames[frameIndex % frames.length] : undefined;
}
