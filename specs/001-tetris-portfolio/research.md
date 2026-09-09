# Research: Tetris Portfolio

## Decision: Use React, Vite, and TypeScript

**Rationale**: This produces a fast static build, supports component-level accessibility patterns, and provides strict content and game-state types. It aligns with the requested frontend stack.

**Alternatives considered**:

- Next.js static export: capable but adds framework conventions and deployment surface without server-rendered requirements.
- Vanilla TypeScript: possible, but React better supports reusable portfolio and game views at this scope.

## Decision: Render the game board with DOM and CSS Grid

**Rationale**: A CSS Grid board makes cells available to normal layout, responsive sizing, testing, and accessibility hooks. It avoids a canvas-specific accessibility layer and a game engine dependency.

**Alternatives considered**:

- Canvas: efficient but requires separate keyboard, screen-reader, scaling, and testing affordances.
- Phaser or another engine: disproportionate client weight and abstraction for one small game.

## Decision: Use a pure game reducer with deterministic dependencies

**Rationale**: Board transitions, collision detection, line clearing, scoring, game over, and unlock state can be tested independently of React. A piece provider and tick action can be injected in tests to remove randomness and wall-clock timing.

**Alternatives considered**:

- Component-local mutable state: quick to start but difficult to test line clearing and unlock behavior deterministically.
- Third-party Tetris component: reduces design control and risks inaccessible or unmaintained behavior.

## Decision: Use in-page anchor navigation, not client routing

**Rationale**: The portfolio is one static document. Semantic section IDs and hash links are deep-linkable, require no routing dependency, and work after the game reveals the content.

**Alternatives considered**:

- React Router: useful for independent pages but unnecessary for the v1 content flow.
- Modal-only content: obscures the recruiter scan path and weakens shareable URLs.

## Decision: Keep portfolio data in a single TypeScript module

**Rationale**: A typed `src/content/portfolio.ts` offers a single, reviewable replacement point for all placeholder data while avoiding CMS, database, or runtime requests.

**Alternatives considered**:

- JSON files: useful for non-code editing but weaker type support and no advantage for the owner-developer workflow.
- Headless CMS: violates static-only/no-backend scope and introduces credentials plus operational work.

## Decision: Make reduced motion an equivalent alternate path

**Rationale**: Detect `prefers-reduced-motion`; render the landing board in a paused, instructional state and make skip prominent. Do not auto-drop pieces or run reveal animations. Manual controls remain available for visitors who opt in.

**Alternatives considered**:

- Disable the entire game: removes the theme unnecessarily.
- Ignore the preference: violates the constitution and harms usability.

## Decision: Use direct static recruiter actions

**Rationale**: Use HTTPS links for GitHub and LinkedIn, `mailto:` for email, and `/resume-placeholder.pdf` for resume download. This has no operational dependency and remains transparent to visitors.

**Alternatives considered**:

- Contact form service: adds external data handling and configuration outside v1.
- Backend contact endpoint: expressly out of scope.
