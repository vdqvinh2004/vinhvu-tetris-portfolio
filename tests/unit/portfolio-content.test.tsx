import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PortfolioShell } from "../../src/components/portfolio/PortfolioShell";
import { portfolio } from "../../src/content/portfolio";

describe("portfolio content", () => {
  const renderPortfolio = () => render(<PortfolioShell />, { wrapper: MemoryRouter });

  it("renders content from the central portfolio module", () => {
    renderPortfolio();
    expect(screen.getByRole("heading", { name: portfolio.profile.name })).toBeInTheDocument();
    expect(screen.getByText(portfolio.projects[0].title)).toBeInTheDocument();
  });

  it("uses static resume and recruiter action destinations", () => {
    renderPortfolio();
    expect(screen.getByRole("link", { name: /download resume/i })).toHaveAttribute(
      "href",
      portfolio.profile.resumeUrl,
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      portfolio.profile.githubUrl,
    );
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute(
      "href",
      `mailto:${portfolio.profile.email}`,
    );
  });
});
