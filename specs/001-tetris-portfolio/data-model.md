# Data Model: Tetris Portfolio

## Portfolio Content

All entities below are local typed values in `src/content/portfolio.ts`. They are bundled with the site and never stored or fetched at runtime.

### PortfolioProfile

| Field | Type | Rules |
|-------|------|-------|
| name | string | Explicit placeholder until owner provides final name. |
| headline | string | States full-stack developer and automation QA focus. |
| intro | string | Concise recruiter-facing summary. |
| location | string | Optional. |
| email | string | Visible valid email placeholder and `mailto:` destination. |
| githubUrl | URL string | HTTPS destination. |
| linkedInUrl | URL string | HTTPS destination. |
| resumeUrl | string | Local static file path. |

### SkillGroup

| Field | Type | Rules |
|-------|------|-------|
| title | string | Examples: Full-stack development, Test automation. |
| skills | string[] | Short, scannable technology or practice labels. |

### ExperienceEntry

| Field | Type | Rules |
|-------|------|-------|
| role | string | Explicit placeholder until verified. |
| organization | string | Explicit placeholder until verified. |
| period | string | Human-readable date range. |
| highlights | string[] | Only verified or explicitly placeholder claims. |

### ProjectEntry

| Field | Type | Rules |
|-------|------|-------|
| title | string | Project name. |
| summary | string | Concise problem or purpose. |
| contribution | string | Candidate's role or contribution. |
| technologies | string[] | Technology labels. |
| sourceUrl | URL string or undefined | Render only if supplied. |
| demoUrl | URL string or undefined | Render only if supplied. |

## Client-Only Game State

The reducer owns this state in browser memory. Reloading resets it; it is never persisted, transmitted, or used as a recruiter metric.

| Field | Type | Rules |
|-------|------|-------|
| board | Cell[][] | 10 columns by 20 visible rows. A cell is empty or a piece color/token. |
| activePiece | ActivePiece | Tetromino shape, rotation, x, and y. |
| nextPiece | PieceKind | Shown as a nonessential preview. |
| score | number | Nonnegative display score. |
| linesCleared | number | Cumulative, nonnegative; unlock threshold is 3. |
| phase | `idle \| playing \| game-over \| unlocked \| skipped` | Controls accepted actions and visual state. |
| reducedMotion | boolean | Disables automatic ticks and reveal animation. |

## State Transitions

| Event | Valid source | Result |
|-------|--------------|--------|
| Start | idle | playing, unless reduced motion keeps automatic ticks disabled. |
| Move/rotate/drop | playing | Board updates if collision rules allow it. |
| Lock piece | playing | Full rows clear, score and line count update, next piece spawns. |
| Reach three lines | playing | phase becomes unlocked and portfolio receives focus. |
| Top collision | playing | phase becomes game-over. |
| Restart | game-over, unlocked, skipped | New empty game session. |
| Skip | any landing state | phase becomes skipped and portfolio receives focus. |
