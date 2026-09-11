import { portfolio } from "../../content/portfolio";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="portfolio-section contact-section"
      aria-labelledby="contact-title"
    >
      <p className="eyebrow">NOTE 06 / CONTACT</p>
      <h2 id="contact-title">Have a useful problem to solve?</h2>
      <p>
        Open to conversations about full-stack development, test automation, and quality-minded
        teams.
      </p>
      <div className="contact-actions">
        <a href={portfolio.profile.githubUrl} target="_blank" rel="noreferrer">
          GitHub <span aria-hidden="true">-&gt;</span>
        </a>
        <a href={portfolio.profile.linkedInUrl} target="_blank" rel="noreferrer">
          LinkedIn <span aria-hidden="true">-&gt;</span>
        </a>
        <a href={`mailto:${portfolio.profile.email}`}>
          Email <span aria-hidden="true">-&gt;</span>
        </a>
      </div>
      <p className="email-address">{portfolio.profile.email}</p>
    </section>
  );
}
