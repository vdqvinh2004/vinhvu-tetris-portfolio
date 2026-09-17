import { portfolio } from "../../content/portfolio";

const focusAreas = portfolio.profile.headline
  .split("|")
  .map((part) => part.trim())
  .filter(Boolean);

export function AboutSection() {
  return (
    <section id="about" className="portfolio-section about-section" aria-labelledby="about-title">
      <p className="eyebrow">NOTE 01 / PROFILE</p>
      <h2 id="about-title">{portfolio.profile.name}</h2>
      <p className="section-lede">{portfolio.profile.headline}</p>
      <p>{portfolio.profile.intro}</p>
      {portfolio.profile.location && <p className="metadata">BASE: {portfolio.profile.location}</p>}

      <dl className="hero-facts">
        <div>
          <dt>Focus</dt>
          <dd>{focusAreas.join(" · ")}</dd>
        </div>
        <div>
          <dt>Core stack</dt>
          <dd>{portfolio.skillGroups[0].skills.slice(0, 4).join(" · ")}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>Open to full-stack and QA conversations</dd>
        </div>
      </dl>

      <div className="hero-actions">
        <a className="action-link" href={`mailto:${portfolio.profile.email}`}>
          Start a conversation
        </a>
        <a className="action-link" href={portfolio.profile.resumeUrl} download>
          View CV
        </a>
      </div>
    </section>
  );
}
