import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { LandingGame } from "../components/game/LandingGame";
import { PortfolioShell } from "../components/portfolio/PortfolioShell";

export function App() {
  return (
    <Routes>
      <Route index element={<GameRoute />} />
      <Route path="portfolio" element={<PortfolioRoute />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

function GameRoute() {
  const navigate = useNavigate();
  return <LandingGame onEnterPortfolio={() => navigate("/portfolio")} />;
}

function PortfolioRoute() {
  return <PortfolioShell />;
}
