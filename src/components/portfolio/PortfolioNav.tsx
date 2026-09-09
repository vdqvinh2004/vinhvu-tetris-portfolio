const links = ["About", "Skills", "Experience", "Projects", "Resume", "Contact"];

export function PortfolioNav() {
  return (
    <nav aria-label="Portfolio sections" className="portfolio-nav">
      <a className="wordmark" href="#about">
        VV//01
      </a>
      <div>
        {links.map((link) => (
          <a href={`#${link.toLowerCase()}`} key={link}>
            {link}
          </a>
        ))}
      </div>
    </nav>
  );
}
