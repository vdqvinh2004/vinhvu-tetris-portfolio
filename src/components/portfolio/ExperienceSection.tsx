import { portfolio } from "../../content/portfolio";
import type { ExperienceEntry } from "../../content/types";

const UNFILLED = /^\[Add verified/;

function isPlaceholder(entry: ExperienceEntry): boolean {
  return (
    UNFILLED.test(entry.role) ||
    UNFILLED.test(entry.organization) ||
    entry.highlights.every((highlight) => UNFILLED.test(highlight))
  );
}

function PlaceholderEntry() {
  return (
    <article className="timeline-entry is-placeholder">
      <p className="metadata">IN PREPARATION</p>
      <h3>Professional experience</h3>
      <p className="organization">Verified roles are being added.</p>
      <p>Full history available on request or in the CV.</p>
      <ul>
        <li>Full-stack delivery and release quality focus</li>
        <li>Automation-first QA with CI/CD integration</li>
      </ul>
    </article>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className="portfolio-section" aria-labelledby="experience-title">
      <p className="eyebrow">NOTE 03 / EXPERIENCE</p>
      <h2 id="experience-title">Work in practice</h2>
      <div className="timeline">
        {portfolio.experience.map((entry) =>
          isPlaceholder(entry) ? (
            <PlaceholderEntry key="placeholder" />
          ) : (
            <article className="timeline-entry" key={`${entry.organization}-${entry.role}`}>
              <p className="metadata">{entry.period}</p>
              <h3>{entry.role}</h3>
              <p className="organization">{entry.organization}</p>
              <ul>
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ),
        )}
      </div>
    </section>
  );
}
