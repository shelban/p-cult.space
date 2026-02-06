# CLAUDE.md

Guide for AI assistants working on this repository.

## Project Overview

**p-cult.space** is a static single-page website for "культ особ" (Personalities Cult) — a Ukrainian community space. The site is hosted on GitHub Pages at [p-cult.space](https://p-cult.space).

- **Stack:** Plain HTML5 + CSS3, no JavaScript frameworks
- **Language:** Ukrainian (`lang="uk"`)
- **Theme:** Dark mode only (#111 background, white text)

## Repository Structure

```
p-cult.space/
├── index.html          # Single-page entry point
├── css/
│   └── style.css       # All styles, CSS custom properties for theming
├── assets/             # SVG icons, favicon, OG image
│   ├── *.svg           # Social media icons
│   ├── favicon.ico
│   └── og-image.png    # Open Graph preview image
├── CNAME               # GitHub Pages custom domain (p-cult.space)
├── sitemap.xml         # SEO sitemap
└── README.md
```

## Build & Deployment

- **No build step.** Edit HTML, CSS, or assets directly and commit.
- **Deployment:** Push to the `main` branch; GitHub Pages serves the site automatically.
- **No CI/CD pipelines, no package manager, no dependencies.**

## Development Workflow

1. Create a feature branch from `main`
2. Make changes to HTML/CSS/assets
3. Commit with a descriptive message
4. Open a pull request against `main`
5. Merge triggers automatic GitHub Pages deployment

Branch naming convention: `<tool>/description` (e.g., `codex/fix-css-selector`).

## Code Conventions

### HTML
- Semantic HTML5 elements: `<header>`, `<main>`, `<section>`
- Class names use kebab-case (e.g., `social-links`, `contact-email`)
- All user-facing text is in Ukrainian

### CSS
- CSS custom properties defined in `:root` for theming (colors, spacing, sizing)
- Font: Inter (sans-serif)
- Responsive breakpoint at 600px using `@media`
- Comments in the CSS are in Russian (legacy)
- Kebab-case for class names and variable names (e.g., `--section-bg-color`)

### Assets
- Social media icons stored as SVG in `assets/`
- Favicon as ICO format
- Open Graph image as PNG

## Known Issues

- **Duplicated CSS rules:** `css/style.css` contains the full ruleset twice (lines 1-116 and 118-233). The second copy has a bug on line 209 where `.social-links img:hover` is missing the leading dot (reads `social-links img:hover`).
- **CSS variables in `@media` queries:** `var(--media-max-width)` inside `@media (max-width: ...)` is not supported by most browsers. The media query breakpoint should use a literal value (e.g., `600px`).

## External Services

- **Google Analytics 4:** Tracking ID `G-8KFJXN9GHY` is embedded in `index.html`
- **GitHub Pages:** Serves the site from the `main` branch via the `CNAME` file
