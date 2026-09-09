import { portfolio } from "../../content/portfolio";

interface GameRewardsProps {
  rewardsUnlocked: number;
}

export function GameRewards({ rewardsUnlocked }: GameRewardsProps) {
  const latestReward = portfolio.gameRewards[rewardsUnlocked - 1];

  return (
    <section aria-labelledby="reward-title" className="game-rewards">
      <div className="game-reward-heading">
        <h2 id="reward-title">Portfolio cache</h2>
        <span>
          {rewardsUnlocked}/{portfolio.gameRewards.length} unlocked
        </span>
      </div>
      <div aria-live="polite" className="sr-only" role="status">
        {latestReward ? `Reward unlocked: ${latestReward.title}.` : "No rewards unlocked yet."}
      </div>
      <ol>
        {portfolio.gameRewards.map((reward, index) => {
          const unlocked = index < rewardsUnlocked;
          return (
            <li className={unlocked ? "game-reward is-unlocked" : "game-reward"} key={reward.title}>
              <span className="game-reward-number">0{index + 1}</span>
              <div>
                <h3>{unlocked ? reward.title : "CLASSIFIED"}</h3>
                <p>
                  {unlocked ? reward.detail : "Clear this round to reveal the next portfolio file."}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
