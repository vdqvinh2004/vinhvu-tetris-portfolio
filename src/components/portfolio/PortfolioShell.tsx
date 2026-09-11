import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { ExperienceSection } from "./ExperienceSection";
import { PortfolioNav } from "./PortfolioNav";
import { PortfolioGameBackground } from "./PortfolioGameBackground";
import { PortfolioScene } from "./PortfolioScene";
import { ProjectsSection } from "./ProjectsSection";
import { ResumeSection } from "./ResumeSection";
import { SkillsSection } from "./SkillsSection";

export function PortfolioShell() {
  useEffect(() => {
    document.getElementById("portfolio")?.focus();
  }, []);

  return (
    <main className="portfolio portfolio-monochrome" id="portfolio" tabIndex={-1}>
      <PortfolioScene />
      <PortfolioGameBackground side="right" startFrame={0} />
      <PortfolioGameBackground side="left" startFrame={70} />
      <PortfolioNav />
      <div className="portfolio-stamp" aria-hidden="true">
        FIELD NOTES / 2026
      </div>
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ResumeSection />
      <ContactSection />
    </main>
  );
}
import { useEffect } from "react";
