---
name: warn-tests-not-run
enabled: true
event: bash
action: warn
pattern: git\s+push
---

🧪 **Tests reminder**

Before pushing to production, verify:
- `npm run build` - Check Eleventy build succeeds
- `npm run serve` - Test site locally if making layout/CSS changes
- Check for broken frontmatter or invalid markdown

If you've already tested, you can ignore this warning.

**Why this matters:** This is a static site with GitHub Actions deployment. Build errors only show up after push.
