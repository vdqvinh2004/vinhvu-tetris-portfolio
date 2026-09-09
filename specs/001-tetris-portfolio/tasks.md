---
description: "Implementation tasks for the frontend-only Tetris portfolio"
---

# Tasks: Tetris Portfolio

**Input**: Design documents from `/specs/001-tetris-portfolio/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/portfolio-ui.md`

**Tests**: Automated tests are required by the constitution for gameplay, visitor-critical navigation, content rendering, accessibility behavior, and recruiter actions.

## Phase 1: Setup

**Purpose**: Establish the static React project and quality tooling.

- [x] T001 Initialize React + Vite + TypeScript in the repository root and configure npm scripts in `package.json`.
- [x] T002 [P] Configure ESLint, Prettier, TypeScript strict mode, and `format:check`, `lint`, and `typecheck` scripts in configuration files and `package.json`.
- [x] T003 [P] Configure Vitest, Testing Library, and test setup in `vite.config.ts`, `src/test/setup.ts`, and `package.json`.
- [x] T004 [P] Configure Playwright and browser test scripts in `playwright.config.ts`, `tests/e2e/`, and `package.json`.
- [x] T005 [P] Add static hosting-safe `.gitignore`, `README.md`, and `public/resume-placeholder.pdf` placeholder guidance.

## Phase 2: Foundational

**Purpose**: Create the reusable content, design, and deterministic game foundations that block all visitor stories.

- [x] T006 Create strict portfolio content types in `src/content/types.ts` according to `data-model.md`.
- [x] T007 Create complete, explicit placeholder portfolio data in `src/content/portfolio.ts` according to `data-model.md`.
- [x] T008 [P] Create retro design tokens, global accessibility styles, responsive primitives, focus styles, and reduced-motion rules in `src/styles/tokens.css` and `src/styles/global.css`.
- [x] T009 [P] Implement tetromino shape definitions, rotation data, board constants, collision checks, row clear logic, and scoring in `src/game/pieces.ts` and `src/game/engine.ts`.
- [x] T010 Implement the pure deterministic game reducer, including start, movement, rotation, drop, line clear, game-over, restart, skip, and three-line unlock transitions in `src/game/reducer.ts`.
- [x] T011 [P] Write reducer tests for collision, row clearing, scoring, game-over, restart, and three-line unlock in `tests/unit/game-reducer.test.ts`.
- [x] T012 [P] Write tests that validate all sections render from central placeholder content and optional project links behave correctly in `tests/unit/portfolio-content.test.ts`.
- [x] T013 Create the root application shell, screen-reader announcement region, and app-level focus-management utility in `src/app/App.tsx` and `src/main.tsx`.

**Checkpoint**: Static app foundation, typed content, visual system, and tested game rules are ready.

## Phase 3: User Story 1 - Discover the Portfolio (Priority: P1) MVP

**Goal**: Visitors can play a short game or skip directly to a navigable portfolio.

**Independent Test**: Load the landing experience, skip to the portfolio, then simulate the three-line unlock and verify the same content becomes visible with correct focus.

- [x] T014 [P] [US1] Write component tests for visible landing instructions, keyboard controls, persistent skip, and focus transfer in `src/components/game/LandingGame.test.tsx`.
- [x] T015 [P] [US1] Write Playwright journey for skipping from the landing screen and seeing six navigable sections in `tests/e2e/portfolio-access.spec.ts`.
- [x] T016 [US1] Implement accessible board rendering, game HUD, keyboard controls, restart, and game-over actions in `src/components/game/GameBoard.tsx` and `src/components/game/GameControls.tsx`.
- [x] T017 [US1] Implement landing-state orchestration, manual/automatic ticks, reduced-motion behavior, three-line unlock, skip behavior, live announcements, and focus transfer in `src/components/game/LandingGame.tsx`.
- [x] T018 [US1] Implement semantic portfolio navigation and placeholder section anchors in `src/components/portfolio/PortfolioNav.tsx` and `src/components/portfolio/PortfolioShell.tsx`.
- [x] T019 [US1] Integrate the landing experience and portfolio shell in `src/app/App.tsx`.
- [x] T020 [US1] Extend `tests/e2e/portfolio-access.spec.ts` to verify an unlock path and game-over restart/skip recovery.

**Checkpoint**: The site delivers a memorable but optional opening and immediately usable portfolio navigation.

## Phase 4: User Story 2 - Evaluate Relevant Work (Priority: P2)

**Goal**: Recruiters can scan centrally managed full-stack and automation QA evidence.

**Independent Test**: Update representative placeholder values in `src/content/portfolio.ts`, load the site, and verify each altered value appears only through the intended section components.

- [x] T021 [P] [US2] Implement About and Skills sections using the profile and skill-group data in `src/components/portfolio/AboutSection.tsx` and `src/components/portfolio/SkillsSection.tsx`.
- [x] T022 [P] [US2] Implement Experience section using typed experience data in `src/components/portfolio/ExperienceSection.tsx`.
- [x] T023 [P] [US2] Implement project card and Projects section, conditionally rendering demo/source links, in `src/components/portfolio/ProjectCard.tsx` and `src/components/portfolio/ProjectsSection.tsx`.
- [x] T024 [US2] Compose the recruiter content sections into `src/components/portfolio/PortfolioShell.tsx` and verify section headings and anchor targets.
- [x] T025 [US2] Extend component tests in `tests/unit/portfolio-content.test.ts` for profile, skill, experience, project metadata, and absent optional links.

**Checkpoint**: Recruiter content is scannable, evidence-focused, and fully driven by one local module.

## Phase 5: User Story 3 - Take Recruiter Action (Priority: P3)

**Goal**: Recruiters can obtain the resume and initiate external contact from an accessible static site.

**Independent Test**: From the visible portfolio, verify resume, GitHub, LinkedIn, and email actions have correct static destinations, then repeat with keyboard-only input and reduced motion enabled.

- [x] T026 [P] [US3] Implement Resume section with a direct static PDF action in `src/components/portfolio/ResumeSection.tsx`.
- [x] T027 [P] [US3] Implement Contact section with visible email plus labelled GitHub, LinkedIn, and `mailto:` actions in `src/components/portfolio/ContactSection.tsx`.
- [x] T028 [US3] Add destination and accessibility assertions for recruiter actions in `tests/unit/portfolio-content.test.ts`.
- [x] T029 [US3] Add keyboard navigation, reduced-motion, 320px viewport, and recruiter-action checks in `tests/e2e/accessibility.spec.ts`.

**Checkpoint**: Every recruiter conversion action works without a form service or backend.

## Phase 6: Polish and Release Validation

**Purpose**: Ensure the authentic-retro presentation remains fast, accessible, and deployable as static assets.

- [x] T030 [P] Refine CRT/pixel visual effects and component-specific responsive styles without reducing readability in `src/styles/components.css`.
- [x] T031 [P] Add developer-facing content replacement and static deployment instructions to `README.md` using `specs/001-tetris-portfolio/quickstart.md`.
- [x] T032 Validate all placeholders are explicit and no unverified claims, production URLs, secrets, API clients, analytics, backend, or database artifacts exist across `src/` and `public/`.
- [x] T033 Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build`; resolve every failure.
- [ ] T034 Manually validate the preview build at 320px and desktop widths, keyboard-only controls, focus after skip/unlock, game-over recovery, reduced motion, contrast, and outbound link destinations using `specs/001-tetris-portfolio/quickstart.md`.

## Phase 7: Progressive Portfolio Game (Next Phase)

**Purpose**: Replace the short three-line intro with a replayable, keyboard-first Tetris journey where every completed round reveals a meaningful piece of the portfolio.

- [x] T035 Define the progressive game journey in `specs/001-tetris-portfolio/spec.md`: a longer completion target, what constitutes a round, round difficulty progression, and the completion/restart/skip paths. Keep the full portfolio reachable immediately through Skip intro.
- [x] T036 Define a centrally managed reward sequence in `src/content/portfolio.ts` and `src/content/types.ts`. Map each round to one concise, useful portfolio reveal, such as an identity detail, skill group, experience highlight, project preview, contact prompt, or final portfolio access.
- [x] T037 Extend the game-session model and reducer in `src/game/reducer.ts` to track the current round, reward history, unlock state, progression target, and reset behavior without persisting visitor data.
- [x] T038 Add deterministic game rules in `src/game/engine.ts` and `src/game/reducer.ts` that make later rounds more engaging without becoming unfair: measured speed increases, score milestones, and a clearly communicated difficulty cap.
- [x] T039 Add unit tests in `tests/unit/game-reducer.test.ts` for every round transition, exactly-once reward grants, progression after multi-line clears, completion, restart, game-over recovery, and Skip intro from every game state.
- [x] T040 Redesign `src/components/game/LandingGame.tsx` and `src/components/game/GameBoard.tsx` around the progressive reveal loop: before play begins, show a clear how-to-play legend with every keyboard mapping and the round objective; keep the keyboard legend visible during desktop play, show the mobile touch-control equivalent on small screens, and show the current objective, next reward, completed rewards, round feedback, and a final completion state that directs visitors to the full portfolio.
- [x] T041 Create an accessible in-game portfolio-reward display in `src/components/game/` that reveals one information card per completed round, announces newly unlocked information without repeating it, and lets keyboard users inspect prior rewards.
- [x] T042 Update `src/components/game/GameControls.tsx` and keyboard handling so desktop and large-screen gameplay is keyboard-only: `A`/Left Arrow moves left, `D`/Right Arrow moves right, `Space` rotates, `W`/Up Arrow hard-drops, and `S`/Down Arrow soft-drops. Prevent these keys from scrolling the page while the game has focus.
- [x] T043 Restrict visible button/touch controls to small and touch-oriented layouts in `src/styles/components.css`, while retaining on-screen keyboard instructions and accessible control descriptions on desktop and large screens.
- [x] T044 Update component and end-to-end tests in `src/components/game/LandingGame.test.tsx`, `tests/e2e/portfolio-access.spec.ts`, and `tests/e2e/accessibility.spec.ts` for the longer progressive journey, reward rendering, desktop control removal, mobile touch controls, custom keyboard mappings, focus management, and reduced-motion behavior.
- [x] T045 Review every reward for recruiter value and brevity: no reward may expose unverified claims, repeat the same portfolio detail, hide essential contact information behind gameplay, or prevent visitors from accessing the complete portfolio through Skip intro.
- [ ] T046 Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build`; manually validate the full game journey on desktop keyboard input, mobile touch input, reduced motion, and a game-over/restart path.

**Checkpoint**: A visitor can play a longer, escalating game that reveals useful portfolio details round by round, while recruiters can still skip directly to every portfolio section.

## Dependencies and Execution Order

- T001-T005 establish tooling and can begin first.
- T006-T013 are foundational and must complete before story integration; T009 must precede T010, and T010 must precede T017.
- User Story 1 is the MVP and should complete before visual/content work is integrated.
- User Story 2 components can proceed in parallel after T006-T008, then integrate after T018.
- User Story 3 components can proceed in parallel after T006-T008, then integrate after T018.
- T030-T034 follow the intended completed stories.
- T035 defines the phase rules before T036-T038. T037-T039 must complete before the progressive UI in T040-T041.
- T042-T043 can proceed in parallel after the final interaction model from T035 is agreed. T044 follows T039-T043; T045-T046 complete the phase.

## Parallel Opportunities

- T002-T005 can be assigned independently after T001.
- T008, T009, T011, and T012 modify separate files and can run in parallel once their immediate dependencies are met.
- T021-T023 are separate User Story 2 section components.
- T026-T027 are separate User Story 3 section components.
- T030 and T031 can run in parallel after the final component structure stabilizes.
- T036 and T038 modify separate concerns and can begin in parallel after T035.
- T042 and T043 can be assigned independently once the keyboard and responsive-control decisions are fixed.

## Implementation Strategy

1. Deliver the MVP through T001-T020: a tested game, skip route, unlock, and semantic empty portfolio shell.
2. Deliver recruiter evidence through T021-T025.
3. Deliver resume and contact conversion through T026-T029.
4. Complete T030-T034 before treating the site as publishable.
5. Deliver the longer progressive game through T035-T046 after the existing release validation is complete.

Each phase retains a fully static frontend and must pass the constitution gates before the next phase begins.
