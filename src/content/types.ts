export interface PortfolioProfile {
  name: string;
  headline: string;
  intro: string;
  location?: string;
  email: string;
  githubUrl: string;
  linkedInUrl: string;
  resumeUrl: string;
}

export interface SkillGroup {
  title: string;
  skills: string[];
}

export interface ExperienceEntry {
  role: string;
  organization: string;
  period: string;
  highlights: string[];
}

export interface ProjectEntry {
  title: string;
  summary: string;
  contribution: string;
  technologies: string[];
  sourceUrl?: string;
  demoUrl?: string;
}

export interface PortfolioContent {
  profile: PortfolioProfile;
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
}
