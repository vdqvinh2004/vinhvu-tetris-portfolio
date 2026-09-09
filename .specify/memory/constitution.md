# Vinh Vu Tetris Portfolio Constitution

## Core Principles

### I. Recruiter Value Before Novelty
The site MUST communicate the owner's role focus, strongest skills, selected work, resume, and contact paths quickly. The Tetris experience may attract attention but MUST never prevent access to portfolio content: a visible skip action and conventional navigation are required.

### II. Frontend-Only and Static by Default
The application MUST build to static assets and run without an application server, API, authentication, database, telemetry service, or secret. Portfolio content MUST live in version-controlled local data modules. Contact uses external links and `mailto:` only.

### III. Playful but Usable
The authentic-retro interface MUST remain responsive, keyboard-operable, readable, and understandable without prior Tetris knowledge. Decorative CRT and motion effects MUST not reduce contrast, obscure information, or be required for interaction. Visitors who prefer reduced motion MUST receive a calm equivalent experience.

### IV. Verified Gameplay and Navigation
The landing game state, score-target unlock, skip route, section navigation, and external recruiter actions are behavior that MUST be covered by automated tests. Tests MUST be deterministic; game timing and random piece selection MUST be controllable in unit tests.

### V. Content Is a First-Class Interface
All visible portfolio copy, projects, skills, experience entries, links, and resume metadata MUST be editable from a small, documented local content model. Placeholder data MUST be obvious and must not imply unverified employment, education, metrics, or endorsements.

## Technical and Experience Constraints

- Use React, Vite, and TypeScript for a single-page static web application.
- Use semantic HTML and native browser capabilities before adding dependencies.
- Support current evergreen desktop and mobile browsers at widths from 320px upward.
- Do not add backend, database, login, form submission service, analytics SDK, or third-party tracker in v1.
- Keep bundle additions justified. Gameplay and visual primitives belong in local source rather than a large game engine.
- Meet WCAG 2.2 AA contrast and keyboard-access expectations for all primary actions.
- Keep the first meaningful screen usable on a typical mobile connection without external runtime data dependencies.

## Development Workflow and Quality Gates

1. Update the feature specification when scope or acceptance criteria change.
2. Keep `src/content/portfolio.ts` as the sole source of editable portfolio information; do not scatter personal values through UI components.
3. Write or update tests before implementation for game rules and visitor-critical flows.
4. Before a feature is considered complete, run formatting, linting, type checking, unit tests, end-to-end tests, and a production build.
5. Manually verify keyboard-only use, reduced-motion behavior, desktop layout, and a 320px-wide mobile layout.
6. Review every new dependency for a specific need, client bundle cost, and static-hosting compatibility.

## Governance

This constitution supersedes feature preferences where they conflict. Plans and tasks MUST include a constitution check before implementation and after design. Amendments require a documented rationale, version increment, and review of affected specifications. Complexity or a departure from static frontend-only delivery requires written justification in the feature plan.

**Version**: 1.0.0 | **Ratified**: 2026-09-09 | **Last Amended**: 2026-09-09
