import { useEffect, useState } from "react";
import { portfolio } from "../../content/portfolio";

interface GameRewardsProps {
  rewardsUnlocked: number;
}

const DISPLAY_MS = 4300;

export function GameRewards({ rewardsUnlocked }: GameRewardsProps) {
  const latestReward = portfolio.gameRewards[rewardsUnlocked - 1];
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!latestReward) return undefined;
    const timer = window.setTimeout(() => setDismissed(true), DISPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [latestReward]);

  return (
    <>
      <div aria-live="polite" className="sr-only" role="status">
        {latestReward
          ? latestReward.detail
          : "Clear four lines to unlock the first portfolio achievement."}
      </div>
      {latestReward && !dismissed && (
        <div aria-hidden="true" className="achievement-overlay">
          <div className="achievement-card">
            <p>{latestReward.detail}</p>
          </div>
        </div>
      )}
    </>
  );
}
