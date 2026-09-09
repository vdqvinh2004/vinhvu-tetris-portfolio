# Implementation Plan: Tetris Portfolio

**Branch**: `[001-tetris-portfolio]` | **Date**: 2026-09-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-tetris-portfolio/spec.md`

## Summary

Build a static React portfolio that uses a short, accessible Tetris game as a memorable landing interaction. The application unlocks after three cleared lines but always permits a direct skip into recruiter-focused About, Skills, Experience, Projects, Resume, and Contact content. Personal content is local and editable; no backend, database, authentication, API, or runtime data fetch is permitted.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 22 LTS

**Primary Dependencies**: React 19, Vite 7, Vitest, Testing Library, Playwright, ESLint, and Prettier

**Storage**: Local TypeScript content module and static public assets only; transient game state in browser memory

**Testing**: Vitest + Testing Library for game rules, UI state, and content rendering; Playwright for skip/unlock/navigation/action journeys; manual keyboard, reduced-motion, and responsive checks

**Target Platform**: Current evergreen desktop and mobile browsers; static hosting

**Project Type**: Single-page static web application

**Performance Goals**: Interactive landing at 60fps on modern hardware; initial JavaScript under 250KB gzip excluding locally supplied resume; no blocking runtime network requests

**Constraints**: Frontend-only; no backend/database/authentication/analytics; WCAG 2.2 AA primary contrast; keyboard operation; 320px+ responsive layouts; reduced-motion equivalent; native CSS/DOM game rendering rather than a game engine

**Scale/Scope**: One landing interaction; six portfolio sections; approximately 3-6 entries each for skills, experience, and projects; one local resume placeholder

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Design response | Status |
|------|-----------------|--------|
| Recruiter value is immediately accessible | Persistent Skip intro and conventional section navigation reveal the same content as gameplay. | Pass |
| Static frontend-only delivery | Vite emits static assets; all content is local; no service layer, persistence, or secrets. | Pass |
| Usable, accessible retro experience | Semantic sections, focus states, keyboard game controls, responsive CSS, and reduced-motion branch are required. | Pass |
| Critical behavior is automated | Unit coverage for deterministic game reducer and component coverage for unlock/skip; Playwright covers the visitor paths. | Pass |
| Central, honest content editing | `src/content/portfolio.ts` is the single data source and starts with explicit placeholders. | Pass |

**Post-design recheck**: Pass. The local reducer and small component decomposition are justified by deterministic gameplay testing and do not introduce service or state-management frameworks.

## Phase 0: Research Decisions

See [research.md](./research.md). Key decisions: use CSS Grid and DOM cells for the board, a pure reducer with injected pieces/timers for testability, hash-based section links without a routing dependency, CSS custom properties for the authentic-retro system, and static direct links for recruiter actions.

## Phase 1: Design Artifacts

- [data-model.md](./data-model.md) defines the local content shapes and client-only game state.
- [quickstart.md](./quickstart.md) documents development, validation, and placeholder-content replacement.
- [contracts/portfolio-ui.md](./contracts/portfolio-ui.md) defines the browser-facing behavior contract. There is no network API contract by design.

## Project Structure

### Documentation (this feature)

```text
specs/001-tetris-portfolio/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
```text
src/
├── app/
│   └── App.tsx
├── components/
│   ├── game/
│   ├── portfolio/
│   └── ui/
├── content/
│   ├── portfolio.ts
│   └── types.ts
├── game/
│   ├── engine.ts
│   ├── pieces.ts
│   └── reducer.ts
├── styles/
│   ├── tokens.css
│   ├── global.css
│   └── components.css
├── test/
│   └── setup.ts
└── main.tsx

public/
└── resume-placeholder.pdf

tests/
├── e2e/
│   ├── portfolio-access.spec.ts
│   └── accessibility.spec.ts
└── unit/
    ├── game-reducer.test.ts
    └── portfolio-content.test.ts
```

**Structure Decision**: Use a single Vite application. Isolate the deterministic game engine from React rendering; keep recruiter content in `src/content`; use feature-oriented component directories; retain end-to-end tests outside source. No `backend/`, API client, storage adapter, or database directories are allowed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations require tracking.
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
