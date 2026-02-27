# Add Persona/Character Art to Homepage

## Overview

Add persona art for Iv — a purple 3D graffiti "ІВ" piece — to the homepage.
The art is a raster image (WebP) integrated as a sticker element within the `#about-me` section,
styled with neon drop-shadows in site chaos colors.

## Functional Requirements

### FR-1: Asset Sourced and Committed
Persona art exists in `src/assets/iv-graffiti.webp` and IB pattern in `src/assets/iv-pattern.webp`.
- Acceptance: Files present in `src/assets/`, each under 100KB

### FR-2: Image Integrated into Homepage
The graffiti art is visible in the `#about-me` section on the homepage.
- Acceptance: `<img class="persona-sticker">` present in `src/index.njk`, renders on site

### FR-3: Styled to Match Chaos Aesthetic
Sticker has neon drop-shadow (chaos-pink + chaos-cyan), rotation, hover transition.
IB pattern appears as subtle background texture in the about-me section.
- Acceptance: Visual confirms neon edge treatment, subtle IB texture at ~5% opacity

### FR-4: Mobile Responsive
At ≤600px: sticker goes in-flow, no rotation, reduced drop-shadow.
- Acceptance: No overflow at mobile breakpoint, layout intact

## Acceptance Criteria

- [x] iv-graffiti.webp and iv-pattern.webp committed to src/assets/
- [x] Image renders in about-me section on homepage
- [x] Neon drop-shadow using --chaos-pink and --chaos-cyan CSS vars
- [x] Mobile layout correct
- [x] `npm run build` passes

## Scope

### In Scope
- Two art assets (graffiti + pattern)
- CSS grid layout for about-me section
- Sticker treatment with drop-shadows
- IB pattern as ::before pseudo-element texture

### Out of Scope
- Transparent background (white bg is intentional sticker aesthetic)
- Other pages

## Dependencies

- `src/css/style.css` — chaos CSS custom properties (--chaos-pink, --chaos-cyan)
- `src/index.njk` — about-me section template
