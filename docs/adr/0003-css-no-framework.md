# ADR-0003: Plain CSS Without a Framework

## Status

Accepted

## Context

Needed to style a personal site with a distinctive "chaos aesthetic". CSS approach options:

- Unique design (not Bootstrap-generic)
- Chaos aesthetic requires precise control over transforms and animations
- Single developer, no team Tailwind conventions to enforce
- Site has no JS components → CSS-in-JS frameworks are irrelevant
- CSS custom properties are sufficient for theming

## Decision

**Plain CSS** with CSS custom properties (`:root` variables), no preprocessor or framework.

## Alternatives

### Tailwind CSS

- **Pro**: utility-first, consistent spacing/sizing, template-agnostic
- **Con**: utility classes conflict with the chaos approach; requires a PostCSS pipeline; harder to do custom glitch effects

### SCSS/SASS

- **Pro**: nesting, mixins, variables (predating CSS custom properties)
- **Con**: extra compiler step; CSS variables already solve the theming need

### Bootstrap

- **Pro**: ready-made components
- **Con**: generic look is incompatible with chaos aesthetic; large footprint; override hell

### Styled Components / CSS Modules

- **Pro**: scoped styles
- **Con**: requires a JS component framework; Eleventy + Nunjucks has no React layer

## Consequences

### Positive

- No CSS build dependency → faster build
- Full control over glitch effects, scatter rotations, animations
- CSS custom properties provide theming (`--green`, `--pink`, etc.) without a preprocessor
- Single file `src/css/style.css` — easy to locate and modify
- No purge/tree-shaking step needed

### Negative

- No automatic vendor prefixing
- Manual specificity management
- No tree-shaking (full CSS always loaded)

## Related ADRs

- ADR-0001: Eleventy + Nunjucks has no React layer, making CSS Modules irrelevant
- ADR-0004: Dark-only theme simplifies CSS (single color set)

## Date

2026-02-27
