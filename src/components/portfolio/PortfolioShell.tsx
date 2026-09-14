import { useLayoutEffect } from "react";
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
  useLayoutEffect(() => {
    if (import.meta.env.MODE !== "test") {
      const html = document.documentElement;
      const previousScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      html.scrollTop = 0;
      document.body.scrollTop = 0;
      html.style.scrollBehavior = previousScrollBehavior;
    }
    document.getElementById("portfolio")?.focus({ preventScroll: true });
  }, []);

  return (
    <main className="portfolio portfolio-monochrome" id="portfolio" tabIndex={-1}>
      <a className="skip-to-content" href="#about">
        Skip to content
      </a>
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
