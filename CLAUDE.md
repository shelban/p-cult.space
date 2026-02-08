# CLAUDE.md

Guide for AI assistants working on this repository.

## Project Overview

**p-cult.space** — сайт "культивація особів" (Ів, she/her/祂). Twitch Just Chatting стрімерка, єблоторгівлінг. Hosted on GitHub Pages at [p-cult.space](https://p-cult.space).

- **Stack:** Eleventy (11ty) 3.x, Nunjucks templates, CSS3
- **Language:** Ukrainian (`lang="uk"`), mixed with Russian/English in content
- **Theme:** Dark mode only (#111 background, white text)
- **Domain:** p-cult.space (Cloudflare DNS → GitHub Pages)

## Repository Structure

```
p-cult.space/
├── src/
│   ├── index.njk                    # Main page
│   ├── streams.njk                  # Streams listing page
│   ├── streams/
│   │   ├── streams.json             # Default frontmatter for stream posts
│   │   └── *.md                     # Individual stream posts
│   ├── css/
│   │   └── style.css                # All styles, CSS custom properties
│   ├── assets/                      # SVG icons, favicon, OG image
│   ├── CNAME                        # GitHub Pages custom domain
│   └── _includes/
│       └── layouts/
│           ├── base.njk             # Base HTML layout (head, header, GA)
│           └── stream.njk           # Individual stream page layout
├── eleventy.config.js               # 11ty configuration
├── package.json                     # Node dependencies (11ty only)
├── .github/workflows/deploy.yml     # GitHub Actions: build + deploy
├── index.html                       # Legacy static file (NOT used by 11ty)
├── css/style.css                    # Legacy CSS (NOT used by 11ty)
└── CLAUDE.md
```

**Important:** `src/` is the source of truth. Root-level `index.html` and `css/style.css` are legacy leftovers — 11ty builds from `src/` into `_site/`.

## Build & Deployment

- **Build:** `npm run build` (runs `eleventy`, outputs to `_site/`)
- **Dev server:** `npm run serve` (runs `eleventy --serve`)
- **Deployment:** Push to `main` → GitHub Actions builds with Node 20 → deploys to GitHub Pages
- **Requires:** Node.js 18+ (locally). CI uses Node 20.

## Adding a Stream Post

Create a new file `src/streams/YYYY-MM-DD-slug.md`:

```markdown
---
title: "назва стріму"
date: YYYY-MM-DD
tags:
  - just-chatting
vod_url: ""
---

Опис стріму.
```

The `streams.json` in the same directory provides defaults (`layout: layouts/stream.njk`, `tags: ["streams"]`, permalink pattern).

## Code Conventions

### Templates (Nunjucks)
- Layouts in `src/_includes/layouts/`
- `base.njk` — base HTML with GA, meta tags, header
- `stream.njk` — extends base, adds stream metadata and back-link
- Content inserted via `{{ content | safe }}`

### CSS
- CSS custom properties in `:root` for theming
- Font: Inter (sans-serif)
- Responsive breakpoint at 600px
- Kebab-case for class names and variables

### Content
- User-facing text is Ukrainian (mixed with Russian/English where natural)
- Tone: informal, personal, expressive

## Infrastructure

- **GitHub account:** shelban
- **Cloudflare:** DNS proxy to GitHub Pages (zone: p-cult.space)
- **Google Analytics 4:** `G-8KFJXN9GHY` in `base.njk`
- **Email:** eve@p-cult.space (privateemail via Cloudflare MX records)

## Social Links

All use handle `personalities_cult`:
- TikTok, Twitch, Instagram, Telegram, YouTube, Reddit
- Discord: `discord.gg/5n4TMSGxJn`
