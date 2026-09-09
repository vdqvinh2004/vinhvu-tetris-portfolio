import type { PortfolioContent } from "./types";

// Replace only this module with verified personal information before publishing.
export const portfolio: PortfolioContent = {
  profile: {
    name: "Vinh Vu",
    headline: "Full-stack Developer | Automation QA Engineer",
    intro:
      "I turn product ideas into dependable software and build automated confidence around every release. This portfolio is a small game about the systems thinking behind that work.",
    location: "[Add your location]",
    email: "[replace-with-your-email@example.com]",
    githubUrl: "https://github.com/vdqvinh2004",
    linkedInUrl: "https://www.linkedin.com/in/[replace-with-your-profile]",
    resumeUrl: "/resume-placeholder.pdf",
  },
  skillGroups: [
    { title: "Full-stack", skills: ["TypeScript", "React", "C#", ".NET", "SQL", "REST APIs"] },
    {
      title: "Automation QA",
      skills: ["Playwright", "Selenium", "API testing", "CI/CD", "Test design"],
    },
    {
      title: "Engineering",
      skills: ["Git", "Docker", "Debugging", "Agile delivery", "Code review"],
    },
  ],
  experience: [
    {
      role: "[Add verified role title]",
      organization: "[Add verified organization]",
      period: "[Add verified dates]",
      highlights: [
        "[Add a verified engineering or quality outcome.]",
        "[Add a verified collaboration or delivery contribution.]",
      ],
    },
  ],
  projects: [
    {
      title: "Vinh's Tetris",
      summary: "A real-time Tetris web application with multiplayer-oriented product features.",
      contribution: "[Replace with your verified contribution and outcome.]",
      technologies: ["React", "TypeScript", "ASP.NET", "SignalR"],
      sourceUrl: "https://github.com/vdqvinh2004/Vinh-s-Tetris",
    },
    {
      title: "[Add project title]",
      summary: "[Add the problem this project solves.]",
      contribution: "[Add your verified contribution.]",
      technologies: ["[Add technology]"],
    },
  ],
  gameRewards: [
    {
      title: "PLAYER PROFILE UNLOCKED",
      detail: "Vinh Vu: Full-stack Developer and Automation QA Engineer.",
    },
    {
      title: "SKILL CACHE UNLOCKED",
      detail: "Builds with TypeScript, React, C#, .NET, SQL, REST APIs, Playwright, and CI/CD.",
    },
    {
      title: "PROJECT FILE UNLOCKED",
      detail: "Vinh's Tetris combines React, TypeScript, ASP.NET, and SignalR product work.",
    },
    {
      title: "MISSION COMPLETE",
      detail: "The full portfolio, resume, and contact details are ready to explore.",
    },
  ],
};
