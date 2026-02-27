# Workflow — p-cult.space

## TDD Policy

**Flexible.** No test suite for templates or content. Tests encouraged for complex JavaScript logic in `eleventy.config.js` (custom filters like `timestampToSeconds`). Not blocked without tests.

## Commit Strategy

**English, descriptive imperative.** Follow this format:

```
Add BTC donate card to support page
Remove legacy neon brutalism CSS (~600 lines)
Fix timestamp link generation for multi-hour VODs
```

- First line: imperative, English, under 72 chars
- Body (optional): bullet points explaining what/why
- No `feat:`, `fix:` prefixes — plain descriptive

## Git Workflow

1. Work on `main` directly (single developer, no PRs needed)
2. `git add <specific-files>` — never `git add .` (risk of committing secrets)
3. Verify `git status` before and after commits
4. Push to `origin/main` → GitHub Actions auto-deploys

## Verification

- Before push: `npm run build` must succeed
- After deploy: check live site at p-cult.space
- Visual changes: screenshot with Browser skill if available

## Code Review

Self-review only. Single developer. No PR required.

## Task Lifecycle

```
pending → in_progress → completed
```

One task at a time. Mark in_progress before starting, completed after verifying.
