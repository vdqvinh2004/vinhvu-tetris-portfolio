import { useEffect, useState } from "react";
import { LandingGame } from "../components/game/LandingGame";
import { PortfolioShell } from "../components/portfolio/PortfolioShell";

export function App() {
  const [portfolioVisible, setPortfolioVisible] = useState(false);

  useEffect(() => {
    if (!portfolioVisible) return;
    document.getElementById("portfolio")?.focus();
  }, [portfolioVisible]);

  return (
    <>
      {!portfolioVisible && <LandingGame onEnterPortfolio={() => setPortfolioVisible(true)} />}
      {portfolioVisible && <PortfolioShell />}
    </>
  );
}
