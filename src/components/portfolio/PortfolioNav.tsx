import { Link } from "react-router-dom";

const links = ["About", "Skills", "Experience", "Projects", "Resume", "Contact"];

export function PortfolioNav() {
  return (
    <nav aria-label="Portfolio sections" className="portfolio-nav">
      <Link className="wordmark" to="/portfolio#about">
        VV <span>/ FIELD NOTES</span>
      </Link>
      <div>
        {links.map((link) => (
          <a href={`#${link.toLowerCase()}`} key={link}>
            {link}
          </a>
        ))}
        <Link to="/">Play game</Link>
      </div>
    </nav>
  );
}
