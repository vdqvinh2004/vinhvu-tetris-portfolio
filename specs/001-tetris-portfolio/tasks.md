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
- [x] T042 Update `src/components/game/GameControls.tsx` and keyboard handling so desktop and large-screen gameplay is keyboard-only: `A`/Left Arrow moves left, `D`/Right Arrow moves right, `W`/Up Arrow rotates, `Space` hard-drops, and `S`/Down Arrow soft-drops. Prevent these keys from scrolling the page while the game has focus.
- [x] T043 Restrict visible button/touch controls to small and touch-oriented layouts in `src/styles/components.css`, while retaining on-screen keyboard instructions and accessible control descriptions on desktop and large screens.
- [x] T044 Update component and end-to-end tests in `src/components/game/LandingGame.test.tsx`, `tests/e2e/portfolio-access.spec.ts`, and `tests/e2e/accessibility.spec.ts` for the longer progressive journey, reward rendering, desktop control removal, mobile touch controls, custom keyboard mappings, focus management, and reduced-motion behavior.
- [x] T045 Review every reward for recruiter value and brevity: no reward may expose unverified claims, repeat the same portfolio detail, hide essential contact information behind gameplay, or prevent visitors from accessing the complete portfolio through Skip intro.
- [ ] T046 Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build`; manually validate the full game journey on desktop keyboard input, mobile touch input, reduced motion, and a game-over/restart path.

**Checkpoint**: A visitor can play a longer, escalating game that reveals useful portfolio details round by round, while recruiters can still skip directly to every portfolio section.

## Phase 8: Editorial Game Dossier Design Refactor

**Purpose**: Replace the retro CRT arcade treatment with a professional, editorial portfolio that retains the playable challenge as a distinctive entry point.

- [x] T047 Define an editorial game-dossier direction: warm paper surfaces, ink typography, cobalt interaction accents, coral game feedback, strong chapter numbering, and restrained motion.
- [x] T048 Replace global design tokens and typography in `src/styles/tokens.css` and `src/styles/global.css`; preserve WCAG-compliant contrast, reduced-motion support, and visible keyboard focus.
- [x] T049 Rebuild component styling in `src/styles/components.css` around an asymmetric editorial landing layout, dossier-style game panel, chapter-based portfolio sections, structured cards, and a responsive sticky navigation.
- [x] T050 Update game and portfolio copy to remove arcade-only terminology in favor of a portfolio challenge, dossier rewards, and numbered professional chapters.
- [x] T051 Update regression tests affected by revised visible copy and wordmark treatment; preserve game, keyboard, mobile-control, portfolio-navigation, and recruiter-action coverage.
- [x] T052 Run `npm run format`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build`; resolve automated failures.
- [ ] T053 Manually review the redesigned site at 375px, 768px, 1024px, and 1440px with keyboard navigation and reduced motion enabled; confirm the presentation matches the approved editorial direction.

**Checkpoint**: The experience reads as a polished editorial developer portfolio, with the game serving as an optional challenge rather than dictating the site’s complete visual language.

## Phase 9: Engineering Field Journal Redesign

**Purpose**: Replace the editorial dossier interface with a bolder, custom field-journal portfolio that uses a modular challenge entry, strong visual hierarchy, and recruiter-first technical storytelling.

- [x] T054 Generate and apply a UI/UX Pro Max design system for a bold, asymmetric developer portfolio: high contrast, one cobalt interaction accent, structured reading order, visible focus, and restrained motion.
- [x] T055 Replace the landing experience in `src/components/game/LandingGame.tsx` with an issue-style masthead, technical focus facts, a compact optional challenge briefing, and an explicit Skip intro accessible name.
- [x] T056 Rebuild `src/styles/tokens.css`, `src/styles/global.css`, and `src/styles/components.css` as a complete field-journal system: responsive story layout, technical inventory, work-note timeline, emphasized lead project, and high-contrast resume dispatch panel.
- [x] T057 Reframe all portfolio content and navigation in `src/components/portfolio/` as field notes while preserving central content rendering, semantic headings, in-page anchors, direct resume access, and recruiter contact actions.
- [x] T058 Preserve and test stable accessibility contracts for how-to-play, Skip intro, download resume, visible focus, keyboard game controls, desktop/mobile control behavior, and skip focus transfer.
- [x] T059 Run `npm run format`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build`; resolve all automated failures.
- [ ] T060 Manually inspect the field-journal redesign at 375px, 768px, 1024px, and 1440px, including reduced motion and keyboard-only navigation, and refine based on visual feedback.

**Checkpoint**: The portfolio has a memorable, non-template visual identity that communicates engineering judgment clearly before and after the optional game challenge.

## Phase 10: Animated Game-First Entry

**Purpose**: Make the first screen a dedicated animated game stage. The portfolio remains hidden until visitors complete a round, earn an information notification, or choose Skip intro.

- [x] T061 Install Three.js and build a self-contained decorative WebGL block-field scene with safe cleanup and a non-WebGL fallback.
- [x] T062 Rework the landing structure so it presents game status, instructions, the game board, and Skip intro without pre-game personal portfolio information.
- [x] T063 Change every round to a four-line objective and the complete run to four rounds/sixteen lines.
- [x] T064 Replace the always-visible reward history with exactly one five-second animated overlay notification for the latest unlocked portfolio detail; preserve screen-reader announcements.
- [x] T065 Add reduced-motion behavior: render a static Three.js frame, retain all controls and notifications, and avoid nonessential CSS animation.
- [ ] T066 Add end-to-end coverage that completes or simulates a four-line round and verifies exactly one portfolio notification appears, then manually inspect WebGL performance on desktop and mobile.

**Checkpoint**: Visitors first encounter an animated, playable game stage, then discover one piece of portfolio information per four-line round without being forced to play.

## Phase 11: Route-Based Game and Portfolio Navigation

**Purpose**: Give the game and portfolio stable, shareable browser paths so visitors can enter either experience directly and return to a fresh game after skipping.

- [x] T067 Install `react-router-dom` and wrap the application in `BrowserRouter`.
- [x] T068 Create `/` for the animated game and `/portfolio` for the monochrome portfolio, with unknown paths redirecting to the game.
- [x] T069 Navigate Skip intro and successful game completion to `/portfolio`; focus the portfolio main region on route entry.
- [x] T070 Add a visible `Play game` portfolio navigation link that returns to `/` and creates a fresh game session.
- [x] T071 Add end-to-end coverage for skip-to-portfolio, direct `/portfolio` loading, and return-to-game routing.

**Checkpoint**: The game and portfolio are independently addressable, and Skip intro no longer traps visitors away from the game.

## Phase 12: Realistic Portfolio Autoplay Demo

**Purpose**: Replace the naive auto-drop background with a physically honest scripted game — pieces spawn, drift, fall, rotate mid-air, then hard-drop; lines clear the moment they complete; the loop restarts from a perfectly empty board.

- [x] T072 Verify two chained games (single, single, double each) with the real drop/clear logic, ending empty and covering all seven tetrominoes with no adjacent repeats.
- [x] T073 Build the pure frame script in `src/game/demo.ts` with spawn, drift, fall, mid-air rotation, hard-drop slam, lock beat, and clear flash frames.
- [x] T074 Rewrite `PortfolioGameBackground` on the frame script with a reduced-motion path that shows settled states only.
- [x] T075 Keep the ghost board strictly monochrome: black falling pieces, slam flash, and blinking clear rows.
- [x] T076 Lock the behavior in `tests/unit/demo-sequence.test.ts`: clear order [1,1,2,1,1,2], perfect restarts, all seven shapes, rotation before every landing, no sitting completed rows.

**Checkpoint**: The `/portfolio` background plays believable Tetris — every shape falls, rotates, hard-drops, and clears — and loops seamlessly from an empty board.

## Phase 13: Vivid Play Screen and Achievement Overlay

**Purpose**: Make the `/` play screen pop with classic high-contrast piece colors and replace the corner toast with a full-screen achievement moment that shrinks away.

- [x] T077 Restore the vivid cyan/yellow/purple/green/red/blue/orange palette for landing pieces and the Three.js scene.
- [x] T078 Rewrite `GameRewards` as a centered `ACHIEVEMENT UNLOCKED` overlay with giant title, pop-in, hold, and shrink-to-disappear animation plus auto-dismiss and screen-reader announcement.
- [x] T079 Remove the retired reward-list and toast CSS selectors.

**Checkpoint**: Blocks are instantly readable on the dark stage, and each round-end feels like unlocking an achievement.

## Phase 14: Three.js Scene Depth Pass

**Purpose**: Make both routes feel alive in 3D — ablobby floating tetromino fleet with parallax on `/`, and a scroll-steered monochrome wireframe drift on `/portfolio`.

- [x] T080 Export `baseCells` from `src/game/pieces.ts` and share cluster building via `src/game/tetrominoes3d.ts`.
- [x] T081 Upgrade `GameScene`: seven-piece tumbling fleet, starfield, pointer parallax, reward shockwave ring, and camera punch.
- [x] T082 Add ambient `PortfolioScene` (grayscale wireframes + dust, scroll-linked drift, reduced-motion static, test-guarded).
- [x] T083 Lock layouts in `tests/unit/tetromino-shapes.test.ts` and mount presence in the routing journey.

**Checkpoint**: Both routes carry unmistakable 3D motion identity without touching gameplay or readability.

## Phase 15: Full-Page Portfolio Background and Nav Consistency

**Purpose**: Fill the empty lower page with ambient motion, settle the note-5 band treatment, and make the header Play link match its siblings.

- [x] T084 Render a second desynced ghost board lower-left (`side`/`startFrame` props) with dedicated desktop and mobile placement.
- [x] T085 Widen `PortfolioScene` to twelve edge-to-edge wireframe tetrominoes across the full page height.
- [x] T086 Keep the note-5 black band: single inverted landmark for rhythm and resume-conversion focus; white-on-black contrast verified.
- [x] T087 Drop the boxed `play-game-link` style so Play game inherits the standard nav link treatment.

**Checkpoint**: Notes 02 through the end all carry motion, the resume band keeps its climax role, and every nav item looks related.

## Phase 16: Simplified Play-Screen Header

**Purpose**: Remove the oversized cryptic heading and compress the play-screen chrome into calm horizontal rows.

- [x] T088 Replace `Clear. Reveal. Repeat.` with a single-line `Portfolio run` title beside Skip intro.
- [x] T089 Remove the console scanline animation and dead keyframes.
- [x] T090 Compress the how-to-play legend from a stacked grid into one wrapping inline row.

**Checkpoint**: The play screen opens directly onto the game with a quiet single-line header.

## Dependencies and Execution Order

- T001-T005 establish tooling and can begin first.
- T006-T013 are foundational and must complete before story integration; T009 must precede T010, and T010 must precede T017.
- User Story 1 is the MVP and should complete before visual/content work is integrated.
- User Story 2 components can proceed in parallel after T006-T008, then integrate after T018.
- User Story 3 components can proceed in parallel after T006-T008, then integrate after T018.
- T030-T034 follow the intended completed stories.
- T035 defines the phase rules before T036-T038. T037-T039 must complete before the progressive UI in T040-T041.
- T042-T043 can proceed in parallel after the final interaction model from T035 is agreed. T044 follows T039-T043; T045-T046 complete the phase.
- T047 defines the visual direction before T048-T051. T052 follows implementation; T053 is the final manual review.
- T054 informs T055-T057. T058 verifies their stable user contracts; T059 validates the integrated implementation; T060 is the final visual acceptance review.
- T061 enables the progressive 3D scene. T062-T064 define the game-first visitor experience, then T065-T066 validate its accessible and responsive behavior.
- T067 establishes routing before T068-T071; route tests verify direct and return navigation.
- T072 verifies the demo games before T073-T076; the unit test locks the script.
- T077-T079 are independent visual changes verified by the existing game and route tests.
- T080 grounds T081-T083; the shape test guards both scenes.
- T084-T087 are independent polish items verified by the routing journey.
- T088-T090 are header-only simplifications covered by existing game tests.

## Parallel Opportunities

- T002-T005 can be assigned independently after T001.
- T008, T009, T011, and T012 modify separate files and can run in parallel once their immediate dependencies are met.
- T021-T023 are separate User Story 2 section components.
- T026-T027 are separate User Story 3 section components.
- T030 and T031 can run in parallel after the final component structure stabilizes.
- T036 and T038 modify separate concerns and can begin in parallel after T035.
- T042 and T043 can be assigned independently once the keyboard and responsive-control decisions are fixed.
- T048 and T050 can proceed in parallel after T047; T049 integrates the final visual system.
- T055 and T057 can proceed in parallel after T054; T056 integrates the shared visual system.
- T062 and T063 can proceed in parallel after T061; T064 follows the finalized reward contract.
- T068 and T070 can proceed in parallel after T067.

## Implementation Strategy

1. Deliver the MVP through T001-T020: a tested game, skip route, unlock, and semantic empty portfolio shell.
2. Deliver recruiter evidence through T021-T025.
3. Deliver resume and contact conversion through T026-T029.
4. Complete T030-T034 before treating the site as publishable.
5. Deliver the longer progressive game through T035-T046 after the existing release validation is complete.
6. Deliver the editorial design refactor through T047-T053 after the progressive game is stable.
7. Deliver the field-journal redesign through T054-T060 after the interaction model remains stable.
8. Deliver the animated game-first entry through T061-T066 after the progressive game rules are stable.
9. Deliver route-based game and portfolio navigation through T067-T071 after the entry and portfolio experiences are stable.
10. Deliver the realistic autoplay demo through T072-T076 after routing is stable.
11. Deliver the vivid play screen and achievement overlay through T077-T079.
12. Deliver the Three.js scene depth pass through T080-T083.
13. Deliver full-page background coverage and nav consistency through T084-T087.
14. Deliver the simplified play-screen header through T088-T090.

Each phase retains a fully static frontend and must pass the constitution gates before the next phase begins.
