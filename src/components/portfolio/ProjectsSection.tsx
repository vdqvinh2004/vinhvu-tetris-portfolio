import { portfolio } from "../../content/portfolio";
import type { ProjectEntry } from "../../content/types";

function ProjectCard({ project }: { project: ProjectEntry }) {
  return (
    <article className="project-card">
      <p className="project-index">CASE FILE</p>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <p className="contribution">{project.contribution}</p>
      <ul className="tech-list">
        {project.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <div className="project-links">
        {project.sourceUrl && (
          <a href={project.sourceUrl} target="_blank" rel="noreferrer">
            Source <span aria-hidden="true">↗</span>
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noreferrer">
            Demo <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="portfolio-section" aria-labelledby="projects-title">
      <p className="eyebrow">NOTE 04 / SELECTED WORK</p>
      <h2 id="projects-title">Projects with a point of view</h2>
      <div className="project-grid">
        {portfolio.projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
