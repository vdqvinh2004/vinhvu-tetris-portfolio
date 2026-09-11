import { portfolio } from "../../content/portfolio";

export function ResumeSection() {
  return (
    <section
      id="resume"
      className="portfolio-section resume-section"
      aria-labelledby="resume-title"
    >
      <p className="eyebrow">NOTE 05 / CURRICULUM VITAE</p>
      <h2 id="resume-title">The concise version.</h2>
      <p>A concise record of the systems, releases, and quality work behind the portfolio.</p>
      <a
        aria-label="Download resume"
        className="action-link"
        href={portfolio.profile.resumeUrl}
        download
      >
        Open resume <span aria-hidden="true">-&gt;</span>
      </a>
    </section>
  );
}
