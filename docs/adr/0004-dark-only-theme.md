# ADR-0004: Dark-Only Theme, No Toggle

## Status

Accepted

## Context

Needed to decide whether to support light mode and/or a system preference toggle:

- Chaos aesthetic is built on dark backgrounds (#0a0a0a, #111)
- Chaos colors (neon green, pink, cyan) are effective specifically against dark backgrounds
- Implementing dual-theme would double CSS variables and testing surface
- Personal brand site — design is a deliberate identity choice, not a usability compromise

## Decision

**Dark-only**: fixed dark background, no `prefers-color-scheme` handling, no toggle.

## Alternatives

### System preference (auto dark/light)

- **Pro**: respects the user's OS setting; better UX for all
- **Con**: light mode requires a full second color set; neon palette looks poor on white; the chaos style doesn't translate to light mode

### Toggle button

- **Pro**: maximum user choice
- **Con**: state needs to be persisted (localStorage + JS); added complexity without justification for a personal brand site

### Light-only

- **Pro**: better daytime readability
- **Con**: contradicts the chaos aesthetic and the visual identity

## Consequences

### Positive

- Simpler CSS — single color set
- Chaos aesthetic fully preserved
- No JavaScript needed for theming
- Consistent appearance for all visitors

### Negative

- Less comfortable for users viewing in bright daylight conditions
- Potential accessibility concern for users who find dark interfaces harder to read
- `prefers-color-scheme: dark` is not declared, so intent is implicit rather than explicit

## Related ADRs

- ADR-0003: Plain CSS — simplified by having a single theme

## Date

2026-02-27
