# ADR-0002: GitHub Pages + Cloudflare as Hosting Stack

## Status

Accepted

## Context

Needed reliable hosting for a static site with a custom domain:

- Free or near-free hosting
- Automatic deploy on push to `main`
- Custom domain `p-cult.space` with HTTPS
- Minimal administration
- CDN for fast load times

## Decision

- **Hosting**: GitHub Pages (free for public repositories)
- **CI/CD**: GitHub Actions — build Eleventy → deploy to Pages
- **DNS + Proxy**: Cloudflare — DNS records, HTTPS termination, CDN caching

## Alternatives

### Netlify

- **Pro**: built-in CI/CD, preview deployments, form handling
- **Con**: free tier limited on build minutes; unnecessary for a simple site

### Vercel

- **Pro**: excellent DX, preview deployments, Edge Functions
- **Con**: optimized for Next.js; overkill for static output

### Cloudflare Pages

- **Pro**: tight Cloudflare integration, edge hosting, generous free tier
- **Con**: one more platform to manage alongside GitHub; GitHub Pages is simpler when the repo is already there

### VPS (Hetzner/DigitalOcean)

- **Pro**: full control
- **Con**: requires managing Nginx/Caddy, SSL certificates, monitoring

## Consequences

### Positive

- Zero-friction deploys: push → Actions build → Pages publish
- Cloudflare provides HTTPS, CDN, DDoS protection for free
- Atomic deploys (no partial state visible)
- Email routing via Cloudflare (`eve@p-cult.space`)

### Negative

- Limited server configuration (redirects only via `_redirects` or Actions workarounds)
- GitHub Pages is static-only; no server-side rendering possible
- Actions build is slower than local (~1–2 min due to setup overhead)

## Related ADRs

- ADR-0001: Eleventy SSG — generates the static output deployed to Pages

## Date

2026-02-27
