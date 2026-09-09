# Quickstart: Tetris Portfolio

## Prerequisites

- Node.js 22 LTS
- npm 10 or later

## Initial Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Use Skip intro to inspect portfolio content immediately, or play until three lines are cleared.

## Replace Placeholder Content

1. Update only `src/content/portfolio.ts` for the owner profile, skills, experience, projects, and external destinations.
2. Replace `public/resume-placeholder.pdf` with the actual resume, retaining the final configured file name or updating `resumeUrl` centrally.
3. Remove placeholder markers only after the statement, link, and document are accurate.

## Validate Before Publishing

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run preview
```

Manually confirm the following against the preview build:

- Skip intro works before and during game play and transfers focus to the portfolio heading.
- Clearing three lines unlocks the portfolio; game over exposes restart and skip.
- All navigation links, social links, email action, project links, and resume link have correct destinations.
- The site is usable via keyboard only.
- `prefers-reduced-motion` prevents automatic board motion and reveal effects.
- The layout has no horizontal overflow at 320px and remains legible on desktop.

## Deployment

Deploy only the Vite build output (`dist/`) to a static host. Do not configure server functions, environment secrets, databases, tracking scripts, or APIs for v1.
