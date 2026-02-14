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
│   ├── friends.njk                  # Friends listing page
│   ├── support.njk                  # Support/donation page
│   ├── streams/
│   │   ├── streams.json             # Default frontmatter for stream posts
│   │   └── *.md                     # Individual stream posts
│   ├── friends/
│   │   ├── friends.json             # Default frontmatter for friend entries
│   │   └── *.md                     # Individual friend profiles
│   ├── css/
│   │   └── style.css                # All styles, CSS custom properties
│   ├── assets/
│   │   ├── thumbnails/              # Stream preview images
│   │   ├── avatars/                 # Friend avatar images
│   │   └── ...                      # SVG icons, favicon, OG image
│   ├── CNAME                        # GitHub Pages custom domain
│   └── _includes/
│       ├── chaos-decorations.njk    # Reusable floating decoratives
│       └── layouts/
│           ├── base.njk             # Base HTML layout (head, header, GA)
│           └── stream.njk           # Individual stream page layout
├── eleventy.config.js               # 11ty configuration, filters
├── package.json                     # Node dependencies (11ty only)
├── .github/workflows/deploy.yml     # GitHub Actions: build + deploy
├── index.html                       # Legacy static file (NOT used by 11ty)
├── css/style.css                    # Legacy CSS (NOT used by 11ty)
└── CLAUDE.md
```

**Important:** `src/` is the source of truth. Root-level `index.html` and `css/style.css` are legacy leftovers — 11ty builds from `src/` into `_site/`.

## Design System

**Chaos Aesthetic** — "ADHD Energy Maximalism" with controlled entropy:
- **Typography:** Glitch effects on headings (`text-shadow` with cyan/pink)
- **Layout:** Scattered rotations (random `rotate()` transforms)
- **Decoratives:** Floating elements via `chaos-decorations.njk` component
- **Colors:** Bright chaos palette (green #00ff88, yellow #ffed4e, pink #ff0055, cyan #00f0ff)
- **Mobile:** Rotations disabled, single-column for readability

**Reusable component:**
- `{% include "chaos-decorations.njk" %}` — adds 5 floating decorative elements
- Used on: index, streams list, friends pages

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
  - день
vod_url: "https://www.youtube.com/watch?v=..."
duration: "01:23:45"                           # Optional: stream length (HH:MM:SS or MM:SS)
thumbnail: "/assets/thumbnails/stream.jpg"     # Optional: preview image
timestamps:                                     # Optional: clickable timestamps
  - time: "00:15:30"
    description: "опис моменту"
  - time: "01:00:00"
    description: "інший момент"
---

Опис стріму.
```

**Field reference:**
- `title`, `date` — **Required**
- `tags` — Optional (merged with `["streams"]` from `streams.json`)
- `vod_url` — Optional YouTube/Twitch VOD link
- `duration` — Optional display-only (format: `HH:MM:SS` or `MM:SS`)
- `thumbnail` — Optional path to image in `src/assets/thumbnails/`
- `timestamps` — Optional array of `{time, description}` objects
  - `time` format: `HH:MM:SS` (always with hours for consistency)
  - Generates clickable YouTube links with `&t=seconds`

**Display behavior:**
- First 10 timestamps visible by default
- Remaining timestamps collapsed in `<details>` element ("показати всі")
- Each timestamp generates clickable YouTube link with `&t=seconds` parameter

The `streams.json` in the same directory provides defaults (`layout: layouts/stream.njk`, `tags: ["streams"]`, permalink pattern).

## Adding a Friend

Create a new file `src/friends/username-slug.md`:

```markdown
---
name: "Ім'я Друга"
avatar: "/assets/avatars/username.jpg"         # Optional: path to avatar image
bio: "Короткий опис. Може бути декілька речень про те, чим людина займається."
order: 1                                        # Optional: manual priority (lower = first)
links:
  - url: "https://twitch.tv/username"
    platform: "twitch"
  - url: "https://youtube.com/@username"
    platform: "youtube"
---
```

**Field reference:**
- `name` — **Required**: Display name
- `avatar` — Optional path to image in `src/assets/avatars/` (falls back to broken image if missing)
- `bio` — Optional short description
- `order` — Optional manual sorting (lower numbers appear first, before randomized friends)
- `links` — Optional array of `{url, platform}` objects
  - `platform` values: `twitch`, `youtube`, `instagram`, `telegram`, `tiktok`, `discord`, `reddit`

**Avatar setup:**
1. Add image to `src/assets/avatars/username.jpg` (recommended: 240x240px or larger)
2. Reference in frontmatter: `avatar: "/assets/avatars/username.jpg"`

**Random order:**
- Friends are **shuffled on each build** using Fisher-Yates algorithm
- Use `order` field to manually pin important friends at top
- Friends with `order` field appear first (sorted by order value), then randomized friends

The `friends.json` in the same directory provides defaults (`layout: layouts/base.njk`, `tags: ["friends"]`, `permalink: false` — no individual pages).

## Adding a New Page

Create `src/pagename.njk`:

```nunjucks
---
layout: layouts/base.njk
title: "Назва Сторінки"
permalink: /pagename/
---

<h1>{{ title }}</h1>
<p>Content here...</p>

{# Optional: add chaos decorations #}
{% include "chaos-decorations.njk" %}
```

Page will build to `_site/pagename/index.html` → accessible at `/pagename/`

## Eleventy Filters

Custom filters defined in `eleventy.config.js`:

- **`dateDisplay`** — Formats dates in Ukrainian locale
  - Input: `2025-04-15` → Output: `15 квітня 2025 р.`
  - Usage: `{{ date | dateDisplay }}`

- **`timestampToSeconds`** — Converts time string to seconds for YouTube links
  - Input: `"01:23:45"` → Output: `5025`
  - Supports: `HH:MM:SS`, `MM:SS`, `SS` formats
  - Returns `0` for invalid input (NaN protection)
  - Usage: `{{ ts.time | timestampToSeconds }}`

- **`truncate`** — Truncates text with ellipsis
  - Input: `("long text", 10)` → Output: `"long te..."`
  - Usage: `{{ content | truncate(200) }}`

## Code Conventions

### Templates (Nunjucks)
- Layouts in `src/_includes/layouts/`
- `base.njk` — base HTML with GA, meta tags, header
- `stream.njk` — extends base, adds stream metadata, thumbnails, timestamps
- Content inserted via `{{ content | safe }}`
- Conditional rendering: `{% if field %}...{% endif %}` for optional fields

### CSS
- CSS custom properties in `:root` for theming
- Fonts: Manrope (body), Archivo Black (display), Bebas Neue (alt display), Azeret Mono (mono)
- Responsive breakpoint at 600px
- Kebab-case for class names and variables
- Dark theme: `#0a0a0a` background, `#1a1a1a` sections, `#bbb` secondary text
- Chaos colors: green, yellow, pink, cyan, orange, purple (defined as CSS variables)

### Content
- User-facing text is Ukrainian (mixed with Russian/English where natural)
- Tone: informal, personal, expressive

## Working with Claude Code

### Communication Style
- **Act first, explain only on errors** - Don't narrate what you're about to do
- **Concise responses** - No meta-commentary or unnecessary apologies
- **Bilingual context** - Ukrainian for users, English for technical terms
- **Command interpretation:**
  - "добавь X" / "add X" → git add + commit (NOT .gitignore)
  - "створи файл" → Write tool (NOT touch command)
  - "виправ" → Edit tool (NOT sed/awk)

### Data Integrity
- **NEVER hallucinate data** - timestamps, file contents, metadata
- **If data missing** - say "data not available", don't invent placeholders
- **Read existing files** - use as reference before creating similar files
- **Real examples only** - from codebase, not invented

### Security
- **Check for secrets** - before git operations (API keys, tokens, passwords)
- **Verify .gitignore** - covers .env, credentials, tokens
- **Use SSH keys** - no credential prompts
- **Never commit** - API keys, passwords, access tokens

### Testing
- **Always run tests** - when available (npm build, npm test)
- **Never suggest skipping** - to "save time"
- **Report failures explicitly** - task incomplete if tests fail
- **For this project** - verify `npm run build` succeeds before push

### Git Workflow
- **Verify identity** - git user matches eve/shelban@tutanota.de
- **Descriptive commits** - in Ukrainian, follow existing style
- **Check git status** - before and after operations
- **Stage specific files** - avoid blanket "git add ."

## Common Issues

**Build fails locally:**
- Requires Node.js 18+ (check: `node --version`)
- If Node 12 installed: use CI build or upgrade Node

**Missing images:**
- Thumbnails/avatars in frontmatter must exist in `src/assets/`
- Missing files → broken image displayed (no build error)

**Stream not appearing:**
- Check `date` field format: `YYYY-MM-DD`
- Streams sort by date descending (newest first)

**Friend order randomized:**
- Expected behavior (Fisher-Yates shuffle on each build)
- Pin friends to top with `order: 1` field

## Infrastructure

- **GitHub account:** shelban
- **Cloudflare:** DNS proxy to GitHub Pages (zone: p-cult.space)
- **Google Analytics 4:** `G-8KFJXN9GHY` in `base.njk`
- **Email:** eve@p-cult.space (privateemail via Cloudflare MX records)

## Social Links

All use handle `personalities_cult`:
- TikTok, Twitch, Instagram, Telegram, YouTube, Reddit
- Discord: `discord.gg/5n4TMSGxJn`
