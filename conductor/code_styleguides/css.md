# CSS Style Guide — p-cult.space

## File Structure

Single file: `src/css/style.css`. All styles in one place.

## Naming

- Class names: `kebab-case`
- CSS custom properties: `--kebab-case`
- No BEM, no utility classes

## Custom Properties

Defined in `:root`. Categories:

```css
/* Typography */
--font-body, --font-display, --font-alt-display, --font-mono

/* Colors — chaos palette */
--chaos-green: #00ff88
--chaos-yellow: #ffed4e
--chaos-pink: #ff0055
--chaos-cyan: #00f0ff
--chaos-orange: #ff6b35
--chaos-purple: #b83dff

/* Utility */
--hint-color: #666
--border-subtle: #333

/* Layout */
--timestamp-gap, etc.
```

Use variables instead of hardcoded hex values.

## Responsive

Single breakpoint at `600px`:

```css
@media (max-width: 600px) { ... }
```

Mobile: disable rotations, single column, larger tap targets.

## Chaos Aesthetic Rules

- Rotations: `transform: rotate(Xdeg)` — disabled at mobile
- Glitch: `text-shadow` with cyan/pink offsets on headings
- Floating decoratives: via `chaos-decorations.njk` component
- Animations: `@keyframes` for subtle movement, never distracting

## Dark Theme Values

```css
background: #0a0a0a (page) / #1a1a1a (sections)
text: #ffffff (primary) / #bbb (secondary)
```

No light mode variables. No `prefers-color-scheme`.

## Anti-patterns

- Don't use `!important`
- Don't hardcode hex values that have a variable equivalent
- Don't add vendor prefixes manually — check if actually needed
- Don't add `display: none` for decoratives; use transforms/opacity
