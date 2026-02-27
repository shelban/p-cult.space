# Tech Stack — p-cult.space

## Languages

- HTML (via Nunjucks templates)
- CSS3 (plain, no preprocessor)
- JavaScript (Node.js, build-time only — Eleventy config and filters)

## Static Site Generator

- **Eleventy (11ty) 3.x** — `@11ty/eleventy ^3.0.0`
- Templating: **Nunjucks** (`.njk`)
- Content: **Markdown** with YAML frontmatter

## Build

- `npm run build` → `eleventy` → outputs to `_site/`
- `npm run serve` → `eleventy --serve` (local dev, port 8080)
- Node.js 18+ required locally; CI uses Node 20

## Hosting & Infrastructure

- **GitHub Pages** — static hosting, deployed from `_site/`
- **GitHub Actions** — CI/CD pipeline (`.github/workflows/deploy.yml`)
- **Cloudflare** — DNS proxy, HTTPS termination, CDN, email routing

## Source Structure

```
src/              ← source of truth (NOT root-level index.html/css)
├── *.njk         ← page templates
├── streams/*.md  ← stream posts (Markdown + frontmatter)
├── friends/*.md  ← friend profiles
├── css/style.css ← all styles
└── assets/       ← images, icons
```

## Key Dependencies

```json
{
  "devDependencies": {
    "@11ty/eleventy": "^3.0.0"
  }
}
```

No runtime dependencies. No frontend JS bundles.

## Analytics

Google Analytics 4: `G-8KFJXN9GHY` (in `base.njk`)
