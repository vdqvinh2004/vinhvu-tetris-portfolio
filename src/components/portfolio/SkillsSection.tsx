import { portfolio } from "../../content/portfolio";

export function SkillsSection() {
  return (
    <section id="skills" className="portfolio-section" aria-labelledby="skills-title">
      <p className="eyebrow">NOTE 02 / CAPABILITIES</p>
      <h2 id="skills-title">Technical inventory</h2>
      <div className="skill-grid">
        {portfolio.skillGroups.map((group) => (
          <article className="skill-group" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.skills.map((skill) => (
                <li key={skill}>
                  <span aria-hidden="true">+</span>
                  {skill}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
