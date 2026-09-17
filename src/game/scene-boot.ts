/**
 * Shared boot helpers for the decorative WebGL scenes: idle scheduling plus
 * cooperative main-thread yields so phased init never forms a single long task.
 */

/** Defer to browser idle time so heavy init can't contend with first paint. */
export function scheduleIdle(callback: () => void): number {
  if (typeof window.requestIdleCallback === "function") {
    return window.requestIdleCallback(callback, { timeout: 800 });
  }
  return window.setTimeout(callback, 120);
}

export function cancelIdle(id: number): void {
  if (typeof window.cancelIdleCallback === "function") {
    window.cancelIdleCallback(id);
  } else {
    window.clearTimeout(id);
  }
}

/**
 * Yield the main thread between scene-build phases. Uses scheduler.yield()
 * where available (continues at input priority), else a macrotask break so
 * the browser can paint and process input between phases.
 */
export function yieldToMain(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (typeof scheduler?.yield === "function") return scheduler.yield();
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}
