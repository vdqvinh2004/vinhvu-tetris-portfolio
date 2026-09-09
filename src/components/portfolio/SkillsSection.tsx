import { portfolio } from "../../content/portfolio";

export function SkillsSection() {
  return (
    <section id="skills" className="portfolio-section" aria-labelledby="skills-title">
      <p className="eyebrow">LOADOUT</p>
      <h2 id="skills-title">Skills</h2>
      <div className="skill-grid">
        {portfolio.skillGroups.map((group) => (
          <article className="skill-group" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
