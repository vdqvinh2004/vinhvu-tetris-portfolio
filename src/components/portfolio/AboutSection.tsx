import { portfolio } from "../../content/portfolio";

export function AboutSection() {
  return (
    <section id="about" className="portfolio-section about-section" aria-labelledby="about-title">
      <p className="eyebrow">NOTE 01 / PROFILE</p>
      <h2 id="about-title">{portfolio.profile.name}</h2>
      <p className="section-lede">{portfolio.profile.headline}</p>
      <p>{portfolio.profile.intro}</p>
      {portfolio.profile.location && <p className="metadata">BASE: {portfolio.profile.location}</p>}
    </section>
  );
}
