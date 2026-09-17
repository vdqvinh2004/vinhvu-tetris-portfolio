import { portfolio } from "../../content/portfolio";
import type { ProjectEntry } from "../../content/types";

const UNFILLED = /^\[Add/;

function ProjectCard({ project }: { project: ProjectEntry }) {
  const isPlaceholder =
    UNFILLED.test(project.title) ||
    UNFILLED.test(project.summary) ||
    UNFILLED.test(project.contribution);

  if (isPlaceholder) {
    return (
      <article className="project-card is-placeholder">
        <p className="project-index">CASE FILE / PENDING</p>
        <h3>Next case study</h3>
        <p>A second project is being written up with verified numbers and outcomes.</p>
        <p className="contribution">Meanwhile, the source links and game tell the story.</p>
        <ul className="tech-list">
          {project.technologies.map((technology) =>
            UNFILLED.test(technology) ? null : <li key={technology}>{technology}</li>,
          )}
        </ul>
      </article>
    );
  }

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
