# ADR-0001: Eleventy (11ty) as Static Site Generator

## Status

Accepted

## Context

Needed to choose a technology for a personal streaming site. Requirements:

- Minimal complexity — single developer, no DevOps background
- Fast setup and understandable build pipeline
- Template support (reusable components: header, layouts)
- Collections for streams and friends (data in Markdown + YAML frontmatter)
- Static output → compatible with GitHub Pages, no servers needed
- No JS bundler or complex Webpack/Vite configuration

## Decision

Use **Eleventy 3.x** with **Nunjucks** as the templating engine.

## Alternatives

### Hugo

- **Pro**: fastest build times, active community, Go binary with no runtime deps
- **Con**: Go template syntax is unfamiliar; less flexibility in custom filters/plugins

### Astro

- **Pro**: JS component support, Islands architecture, modern DX
- **Con**: overkill for this simple site; JS framework overhead without a need for it

### Jekyll

- **Pro**: native GitHub Pages support (no Actions needed)
- **Con**: Ruby ecosystem, slow builds, comparatively dated

### Next.js / Nuxt

- **Pro**: full-featured frameworks with SSR/SSG
- **Con**: excessive complexity for a static personal site

## Consequences

### Positive

- Zero JavaScript in the browser — pure HTML + CSS output
- Nunjucks templates are simple and readable
- Collections (streams, friends) from Markdown + frontmatter, no database needed
- Custom filters in JS — easy to extend
- Build time ~1–2 seconds

### Negative

- Node.js required as a local dev dependency
- Smaller plugin ecosystem compared to Hugo
- Nunjucks has no TypeScript support out of the box

## Related ADRs

- ADR-0002: GitHub Pages hosting — consumes Eleventy's static output
- ADR-0003: CSS without a framework — reinforces the zero-JS approach

## Date

2026-02-27
