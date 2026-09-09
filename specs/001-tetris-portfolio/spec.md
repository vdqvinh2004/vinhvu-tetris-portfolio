# Feature Specification: Tetris Portfolio

**Feature Branch**: `[001-tetris-portfolio]`

**Created**: 2026-09-09

**Status**: Ready for planning

**Input**: User description: "Create a frontend-only, authentic-retro Tetris portfolio for full-stack developer and automation QA recruiters. Use a playable landing game, score-target unlock, editable placeholder content, and no backend or database."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Discover the Portfolio (Priority: P1)

A recruiter arriving at the site sees a distinct Tetris-inspired opening and can either play a short game to unlock the portfolio or immediately skip to it. After unlocking or skipping, they can identify the owner as a full-stack developer and automation QA candidate and navigate the core portfolio sections.

**Why this priority**: This is the primary first impression and must deliver portfolio access even when the visitor does not want to play.

**Independent Test**: Load the site, activate Skip intro, and verify that the portfolio overview and all section navigation are available without playing the game.

**Acceptance Scenarios**:

1. **Given** a first-time visitor on the landing screen, **When** they choose Skip intro, **Then** the portfolio is immediately displayed without requiring gameplay.
2. **Given** a visitor playing the landing game, **When** they clear a cumulative three lines, **Then** the game announces the achievement and reveals the portfolio.
3. **Given** the portfolio is displayed, **When** a visitor chooses About, Skills, Experience, Projects, Resume, or Contact, **Then** the matching section is brought into view and clearly identified.

---

### User Story 2 - Evaluate Relevant Work (Priority: P2)

A recruiter can scan a concise profile, technical skill groups, experience highlights, and selected projects that make the candidate's full-stack and test automation capability credible. Each project gives enough context to understand the contribution and offers a clearly labelled external destination when available.

**Why this priority**: Recruiters need fast, structured evidence beyond the visual concept to evaluate the candidate.

**Independent Test**: Skip the game, navigate through the content sections, and verify that each contains clearly labelled placeholder entries that can be replaced centrally without changing a component.

**Acceptance Scenarios**:

1. **Given** a recruiter viewing the Projects section, **When** they inspect a project card, **Then** they can see its purpose, technology labels, contribution summary, and available demo or source link.
2. **Given** a recruiter viewing Skills or Experience, **When** they scan the entries, **Then** they can distinguish full-stack and automation QA-relevant capabilities.

---

### User Story 3 - Take Recruiter Action (Priority: P3)

A recruiter can download the resume and use clearly labelled links for GitHub, LinkedIn, and email without a backend or form service. The experience remains usable on mobile, with keyboard-only navigation, and when reduced motion is enabled.

**Why this priority**: Clear next steps turn interest into contact while accessibility ensures the concept does not exclude visitors.

**Independent Test**: Verify each action has the correct destination type, operate all controls using only a keyboard, enable reduced motion, and verify the layout at 320px width.

**Acceptance Scenarios**:

1. **Given** a recruiter viewing Resume, **When** they activate Download resume, **Then** a local PDF placeholder is downloaded or opened without an application request.
2. **Given** a recruiter viewing Contact, **When** they choose GitHub, LinkedIn, or Email, **Then** the external location or default mail application opens through the supplied link.
3. **Given** a visitor who prefers reduced motion, **When** they open or skip the landing experience, **Then** unnecessary animation and automatic gameplay motion are disabled while all information remains available.

### Edge Cases

- A visitor skips the game before it begins, while it is running, or after the target has been reached: each path shows the same portfolio without duplicate announcements.
- The game ends before three lines are cleared: the visitor can restart or skip, and cannot become trapped on the landing screen.
- Keyboard focus remains visible and moves to the portfolio heading after skip or unlock; game keystrokes do not scroll the page while the board is focused.
- On narrow screens or small viewports, controls remain reachable and the game board scales without horizontal page overflow.
- A project has no live demo or source destination: it renders no broken link and states that the destination is not yet available.
- A browser blocks PDF preview or lacks a default mail client: the resume is still a direct static file link and the email address remains visible and copyable.
- Reduced-motion preference is enabled: the reveal uses a non-animated state change and gameplay does not auto-advance.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST present a playable, keyboard-operable falling-block game on the initial landing screen with visible controls and instructions.
- **FR-002**: The landing game MUST reveal the portfolio after the player cumulatively clears three lines.
- **FR-003**: The landing screen MUST provide a persistent, keyboard-accessible Skip intro action that reveals the same portfolio without gameplay.
- **FR-004**: The game MUST provide restart behavior after game over and must not block access to the skip action.
- **FR-005**: The unlocked portfolio MUST include About, Skills, Experience, Projects, Resume, and Contact sections with conventional navigation.
- **FR-006**: Every visible personal detail, section entry, external URL, and resume metadata MUST be supplied from a single local content module containing explicit placeholders initially.
- **FR-007**: Project entries MUST support title, summary, technology labels, contribution detail, and optional source and demo links.
- **FR-008**: The site MUST provide clearly labelled GitHub, LinkedIn, email, and resume-download actions using static URLs, `mailto:`, and a local resume asset only.
- **FR-009**: The site MUST require no backend, database, authentication, API endpoint, runtime environment variable, or external data request to function.
- **FR-010**: Primary navigation, gameplay controls, skip, restart, resume download, and contact links MUST be usable with a keyboard and show visible focus.
- **FR-011**: The layout MUST work from 320px-wide mobile screens through desktop widths without horizontal overflow.
- **FR-012**: The site MUST honor reduced-motion preferences by avoiding automatic gameplay movement and nonessential reveal animations.
- **FR-013**: Retro visual effects MUST preserve readable text, discernible controls, and WCAG 2.2 AA color contrast for primary content.

### Key Entities

- **Portfolio Profile**: Editable identity, role focus, short introduction, social links, email, and resume metadata.
- **Skill Group**: A labelled group of skills that may identify full-stack or automation QA relevance.
- **Experience Entry**: A date range, role placeholder, organization placeholder, and achievement bullets.
- **Project Entry**: A selected project with its purpose, technology labels, contribution description, and optional external destinations.
- **Game Session**: Client-only transient board, active and next pieces, score, cleared line count, state, and unlock status. It is never persisted or sent to a service.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can reach the portfolio overview through Skip intro in one activation from the initial screen.
- **SC-002**: A visitor who clears three lines receives the unlocked portfolio without a page reload or manual navigation.
- **SC-003**: At 320px and 1440px viewport widths, all six portfolio sections and all recruiter actions are visible, operable, and free of horizontal page overflow.
- **SC-004**: 100% of portfolio entries render from the central local content module, verified by changing a representative placeholder value without editing a UI component.
- **SC-005**: Automated tests cover game line-clear/unlock behavior, skip navigation, central content rendering, and outbound recruiter actions.
- **SC-006**: Production build, static preview, linting, type checking, unit tests, and end-to-end tests complete successfully with no runtime backend dependency.

## Assumptions

- V1 targets full-stack developer and automation QA recruiters who generally have a few minutes to inspect a candidate portfolio on desktop or mobile.
- The owner will replace all placeholder personal information, links, project evidence, and the resume PDF before publishing.
- Three cumulative cleared lines creates a short, meaningful Tetris interaction; the portfolio remains available immediately through Skip intro.
- V1 is a one-page static site with in-page section navigation, not a multi-user application or a clone of the indexed project's backend.
- GitHub Pages, Netlify, Vercel static hosting, or an equivalent static host will serve the build output; deployment configuration is deferred until implementation unless a host is selected.
