import { portfolio } from "../../content/portfolio";

export function ResumeSection() {
  return (
    <section
      id="resume"
      className="portfolio-section resume-section"
      aria-labelledby="resume-title"
    >
      <p className="eyebrow">SAVE POINT</p>
      <h2 id="resume-title">Resume</h2>
      <p>A concise record of the systems, releases, and quality work behind this player card.</p>
      <a className="action-link" href={portfolio.profile.resumeUrl} download>
        Download resume <span aria-hidden="true">-&gt;</span>
      </a>
    </section>
  );
}
