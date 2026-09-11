import { portfolio } from "../../content/portfolio";

export function ExperienceSection() {
  return (
    <section id="experience" className="portfolio-section" aria-labelledby="experience-title">
      <p className="eyebrow">NOTE 03 / EXPERIENCE</p>
      <h2 id="experience-title">Work in practice</h2>
      <div className="timeline">
        {portfolio.experience.map((entry) => (
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
        ))}
      </div>
    </section>
  );
}
