import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { ExperienceSection } from "./ExperienceSection";
import { PortfolioNav } from "./PortfolioNav";
import { ProjectsSection } from "./ProjectsSection";
import { ResumeSection } from "./ResumeSection";
import { SkillsSection } from "./SkillsSection";

export function PortfolioShell() {
  return (
    <main className="portfolio" id="portfolio" tabIndex={-1}>
      <PortfolioNav />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ResumeSection />
      <ContactSection />
    </main>
  );
}
