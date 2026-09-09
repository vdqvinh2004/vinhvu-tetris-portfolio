# Browser UI Contract: Tetris Portfolio

The project has no HTTP or persistence API. This contract defines observable browser behavior.

## Landing Experience

| Element | Required behavior |
|---------|-------------------|
| Game board | Has an accessible name, displays score and cleared-line progress, and accepts documented keyboard controls while focused. |
| Instructions | State arrow keys or equivalent controls, rotate, soft drop, and restart. They explain that clearing three lines unlocks the portfolio. |
| Skip intro | Is present before, during, and after a game; is keyboard-operable; reveals the portfolio immediately; moves focus to the portfolio heading. |
| Unlock | When three lines clear, announces success once, reveals the portfolio, and moves focus to its heading. |
| Game over | Announces game over and exposes restart and skip actions. |

## Portfolio Navigation

| Link/section ID | Target |
|-----------------|--------|
| `#about` | About section |
| `#skills` | Skills section |
| `#experience` | Experience section |
| `#projects` | Projects section |
| `#resume` | Resume section |
| `#contact` | Contact section |

Navigation uses semantic links. Every destination has a visible heading and can receive programmatic focus after reveal.

## Recruiter Actions

| Action | Destination contract |
|--------|----------------------|
| Download resume | Direct local static PDF URL; labelled with the file purpose. |
| GitHub | Configured HTTPS profile URL in a new browsing context with an accessible label. |
| LinkedIn | Configured HTTPS profile URL in a new browsing context with an accessible label. |
| Email | Configured `mailto:` link and visible email address. |
| Project source/demo | Only render when the local project entry provides a valid destination. |

## Accessibility and Motion

- All interactive controls work with keyboard only and retain visible focus.
- Color is not the sole carrier of game state, progress, link type, or validation meaning.
- If `prefers-reduced-motion: reduce` matches, automatic board ticks and nonessential reveal animations do not run.
- The page remains usable from 320px width without horizontal scrolling.
