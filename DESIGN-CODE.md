# DESIGN CODE — p-cult.space

Visual identity reference for **культивація особів**. Use this when creating any visual content (thumbnails, headers, graphics, merch, social media) to maintain a recognizable, cohesive aesthetic.

---

## TL;DR

**ADHD Energy Maximalism** on a near-black void. Neon chaos colors on dark surfaces. Slight rotations. Glitch text-shadows. Grain texture. Monospace metadata. Gothic calligraphy logo. Everything floats a little.

---

## 1. Color System

### Background Layer

| Token | Hex | Usage |
|-------|-----|-------|
| `--background-color` | `#0a0a0a` | Page background (near-black) |
| `--section-bg-color` | `#1a1a1a` | Cards, sections, content blocks |
| Surface tint | `rgba(255,255,255,0.03)` | Subtle hover/active states |
| Surface border | `rgba(255,255,255,0.1)` | Card borders, dividers |

### Text Layer

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-color` | `#ffffff` | Primary text, headings, links |
| `--secondary-text-color` | `#bbbbbb` | Body copy, metadata, subtitles |
| Muted | `#666666` | Hints, fine print, inactive |

### Chaos Palette (Primary Brand Colors)

The 6 chaos colors are the visual signature. They rotate through elements via `nth-child` cycling.

| Token | Hex | Character |
|-------|-----|-----------|
| `--chaos-green` | `#00ff88` | Primary accent. Links, CTA borders, success. The "default" chaos color. |
| `--chaos-yellow` | `#ffed4e` | Name highlight ("ів"). Warm glow. Premium/featured feel. |
| `--chaos-pink` | `#ff0055` | Glitch shadow layer. Danger/emphasis. Bold energy. |
| `--chaos-cyan` | `#00f0ff` | Glitch shadow layer. Tech/cool. Information. |
| `--chaos-orange` | `#ff6b35` | Warm accent. Tertiary decoration. |
| `--chaos-purple` | `#b83dff` | Cool accent. Tertiary decoration. |

**Cycling order** (cards, tags, borders): green → pink → yellow → cyan → orange → purple → repeat

### Neon Palette (Extended, Support Page)

| Token | Hex |
|-------|-----|
| `--neon-pink` | `#ff006e` |
| `--neon-green` | `#06ffa5` |
| `--neon-blue` | `#00d9ff` |
| `--neon-purple` | `#b83dff` |
| `--neon-yellow` | `#ffea00` |
| `--neon-red` | `#ff3131` |

### Color Rules

- **Background is ALWAYS near-black** (#0a0a0a). Never light mode.
- **Chaos colors appear as accents** — borders, glows, shadows, text highlights. Never as fills/backgrounds.
- **Glow effects** use rgba versions of chaos colors at 0.2-0.6 opacity via `text-shadow` or `box-shadow`.
- **Tags/labels** get chaos-colored borders + text on transparent background, cycling through the palette.

---

## 2. Typography

### Font Stack

| Role | Family | Weight(s) | Usage |
|------|--------|-----------|-------|
| **Body** | Manrope | 400, 500, 700, 800 | All body text, paragraphs, lists |
| **Display** | Archivo Black | 900 (inherent) | h1, main titles, hero text. Always uppercase feel even when lowercase. |
| **Display Alt** | Bebas Neue | 400 (inherent) | h2, section headers. Tall, condensed. `text-transform: lowercase` |
| **Mono** | Azeret Mono | 400, 500, 700 | Navigation, metadata, timestamps, tags, buttons, code-like elements |

### Typography Rules

- **h1:** Archivo Black, `clamp(2.5rem, 8vw, 5rem)`, tight tracking (`-0.03em`), slight rotation (`-1.5deg`), glitch text-shadow
- **h2:** Bebas Neue, `clamp(2rem, 5vw, 3.5rem)`, lowercase, slight tracking (`0.02em`)
- **Body:** Manrope, `1em`, `#bbb` color, clean and readable
- **Technical/meta:** Azeret Mono, `0.85-0.9rem`, `#bbb`, lowercase, `letter-spacing: 0.03-0.05em`
- **Navigation links:** Mono, lowercase, transparent border → solid on hover

---

## 3. Logo System

### Hero Logo ("ів")

- **Shape:** Stylized Cyrillic "ів" in gothic/calligraphic script
- **Fill:** Marbled swirl texture — teal (#00f0ff-ish) + deep red/crimson (#8b0000-ish)
- **Outline:** Black stroke with subtle white edge highlight
- **Treatment on site:** Floating animation (gentle bob), cyan + pink drop-shadow glow, pulsing glow keyframes
- **Hover:** Scale 1.1, rotate 5deg, intensified glow, glitch-shake micro-animation
- **Size:** 80px on desktop, 100px on mobile

### OG/Brand Mark ("P")

- **Shape:** Geometric isometric "P" letterform (3D block letter)
- **Fill:** Fluid/marble texture — electric cyan/blue + red/crimson swirls
- **Outline:** Metallic gray edges (isometric facets)
- **Usage:** OpenGraph image, social previews, brand mark contexts

### Watermark

- **Shape:** Same "ів" as hero logo
- **Treatment:** Grayscale version, 2.5% opacity, 60vw size, -15deg rotation, very slow drift animation (80s cycle)
- **Purpose:** Subtle background texture, reinforces brand presence without competing with content

### Logo DNA (for generating new visual assets)

- **Calligraphic/gothic script** — not clean geometric, not handwritten casual
- **Marble/fluid texture fills** — never flat color, always swirling organic patterns
- **Teal + crimson** as the signature texture palette (distinct from the UI chaos palette)
- **Strong black outlines** with luminous edge treatment
- **3D/isometric treatment** for the "P" mark specifically

---

## 4. Visual Effects

### Grain Overlay

- SVG fractalNoise texture, `baseFrequency: 0.9`, `numOctaves: 4`
- Fixed position covering entire viewport
- `opacity: 0.03` — barely perceptible, adds analog film quality
- Steps animation (10 frames over 8s) — shifting grain, not smooth

### Glitch Effects

- **Primary glitch** (h1): Cyan (`--chaos-cyan`) and pink (`--chaos-pink`) text-shadow layers offset ±2px
- **Glitch timing:** Brief burst every 5s (90% still, 91-93% glitching, then still again)
- **Clip-rect animation** on pseudo-elements creates scan-line disruption
- **Name glitch** ("ів"): Additional micro-glitch on the highlighted name with faster cycle (1.5-1.8s)

### Floating Decorations

- 5 fixed-position elements (circles + squares) with chaos-color borders
- 60% opacity, z-index behind content
- Slow float animations (20-25s cycles), rotating squares
- Sizes: 80-150px
- **Hidden on mobile** for performance

### Animation Patterns

| Pattern | Timing | Usage |
|---------|--------|-------|
| `fade-in-up` | 0.5-0.8s ease-out | Content entrance, staggered delays |
| `float` / `float-reverse` | 20-25s ease-in-out infinite | Background decorations |
| `rotate` | 30s linear infinite | Square decorations |
| `logo-float` | 6s ease-in-out infinite | Logo gentle bob |
| `logo-glow` | 3s ease-in-out infinite | Logo shadow pulse |
| `glitch` | 5s infinite | Title displacement burst |
| `cult-glow` | 3s ease-in-out infinite | Yellow name glow pulse |

### Hover Behaviors

- **Cards:** Remove rotation → `rotate(0deg)`, lift (`translateY(-8px)`), scale up slightly (`1.02-1.03`), deepen shadow
- **Tags/badges:** Scale 1.1, add `box-shadow` glow in `currentColor`
- **Icons:** Remove rotation, scale 1.2-1.3, add cyan drop-shadow
- **Links/buttons:** Border appears, color brightens

---

## 5. Layout Principles

### Scattered Layout ("Controlled Entropy")

- **Sections have slight rotations** via `transform: rotate()` — range: -2deg to +2deg
- **Sections offset** from center with `margin-left: 5-8%` or `margin-right: 3-5%`
- **Accent borders:** Each section gets a 3-4px solid left OR right border in a chaos color
  - Pattern: green-left, pink-right, yellow-left, cyan-right, orange-left, purple-right
- **On hover:** Sections straighten (`rotate(0deg)`) and lift
- **On mobile:** All rotations disabled, centered single-column

### Card System

- Background: `--section-bg-color` (#1a1a1a)
- Border: 2px `rgba(255,255,255,0.1)` + one chaos-color accent side
- Border-radius: 10px
- Rotations cycle via `nth-child(6n+X)` using CSS custom property `--card-rotation`
- Staggered entrance animations with incrementing delays

### Grid Systems

| Context | Pattern | Gap |
|---------|---------|-----|
| Stream cards | `repeat(auto-fill, minmax(320px, 1fr))` | 40px × 30px |
| Friend cards | `repeat(auto-fill, minmax(280px, 1fr))` | 40px × 30px |
| About-me tags | `repeat(auto-fit, minmax(150px, 1fr))` | 15px |
| Social icons | `repeat(auto-fit, minmax(60px, 1fr))` | 25px |

### Content Widths

| Element | Width | Max-Width |
|---------|-------|-----------|
| Body sections | 80% / auto | 800px |
| Grid containers | 100% | 1200-1400px |
| Stream detail | 100% | 900px |
| Support page | auto | 900px |

### Responsive (600px breakpoint)

- **Rotations:** Disabled entirely
- **Grids:** Collapse to single column
- **Decorations:** Hidden
- **Cards:** Uniform borders, no accent sides
- **Typography:** Scaled down via `clamp()`

---

## 6. Component Patterns

### Tag/Badge

```
font: Azeret Mono, 0.75-0.85rem
padding: 4-6px 10-14px
border-radius: 4-6px
background: rgba(255,255,255,0.05)
border: 1-2px solid [chaos-color cycling]
text: [same chaos-color as border]
text-transform: lowercase
hover: scale(1.1) + box-shadow glow
```

### CTA Button

```
font: Azeret Mono, 0.9-1.1rem
padding: 0.8-1.2em 1.5-2.5em
background: transparent
border: 2-3px solid [chaos-green or cycling]
text: white
text-transform: lowercase
hover: translateY(-3px) scale(1.05), border-color shift, radial glow
```

### Avatar (Friends)

```
size: 120px (desktop), 100px (mobile)
border-radius: 50%
border: 3px solid --chaos-yellow
box-shadow: 0 0 20px rgba(255,237,78,0.4)
```

---

## 7. Mood & Personality

### The Vibe

- **Dark void** — the near-black canvas is non-negotiable, everything floats on it
- **Neon accents on black** — like LED strips in a dark room
- **Controlled chaos** — elements are scattered, rotated, glitchy, but never unreadable
- **Analog warmth via grain** — the noise overlay prevents it from feeling sterile/digital
- **Playful irreverence** — glitch effects, rotated cards, hover surprises
- **Tech-but-personal** — monospace fonts for structure, expressive content

### Keywords for Image Generation Prompts

When creating visuals for this brand, use these descriptors:
- "dark background, near-black (#0a0a0a)"
- "neon accents" / "bright chaos colors on dark"
- "glitch aesthetic" / "scan-line artifacts"
- "slight rotation, scattered layout"
- "grain texture overlay"
- "gothic calligraphy meets digital"
- "marble/fluid textures in teal and crimson"
- "ADHD energy maximalism"
- "analog warmth, film grain"
- "cyberpunk meets personal zine"

### What It Is NOT

- Clean minimalist (has grain, rotations, glitches)
- Corporate (too personal, too chaotic)
- Pastel/light mode (always dark, always neon)
- Retro/synthwave (not nostalgic, it's present-tense)
- Pixel art/8-bit (calligraphic, not blocky)

---

## 8. Production Quick Reference

### For Thumbnails / Stream Graphics

- Background: #0a0a0a or very dark with grain
- Title: Archivo Black or Bebas Neue, white, with cyan+pink glitch offset
- Accent: One chaos color as border/highlight
- Logo: "ів" calligraphic mark with marble texture fill
- Aspect: 16:9 for thumbnails

### For Social Media / OG Images

- Background: #0a0a0a
- Text: White + one chaos accent color
- Logo: Isometric "P" mark or calligraphic "ів"
- Grain overlay at ~3%
- Minimal text, bold typography

### For New Page Elements

- Follow the scattered card pattern with rotation cycling
- Use chaos color accent borders
- Stagger entrance animations
- Monospace for functional text, display fonts for headers

---

*Extracted from p-cult.space codebase on 2026-02-15. Source of truth: `src/css/style.css`*
