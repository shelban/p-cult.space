# Stream Automation Pipeline

## Overview

Full end-to-end pipeline: Twitch stream ends → VOD downloaded → uploaded to YouTube → site entry
created → clips produced. Goal is zero manual steps between stream ending and everything published.

Current state: manual export from Twitch Video Producer → manual YouTube upload → manual .md file.
Target state: stream ends → robots handle everything.

## Functional Requirements

### FR-1: VOD Trigger Detection

Detect when a Twitch stream ends and a VOD becomes available.

- Acceptance: System receives notification within 30 minutes of stream end without manual action

### FR-2: VOD Download

Download the Twitch VOD to local storage before it expires (7-day window).

- Acceptance: VOD file downloaded successfully, format suitable for YouTube upload

### FR-3: YouTube Upload

Upload the VOD to YouTube with proper title, description, and metadata.

- Acceptance: Video appears on YouTube channel, unlisted or public, with correct metadata

### FR-4: Site Entry Generation

Create a `src/streams/YYYY-MM-DD-slug.md` file with frontmatter from YouTube video metadata.

- Acceptance: File created in repo with correct date, title, vod_url, duration fields.
  Push triggers CI, stream appears on site at /streams/

### FR-5: Clip Creation

Automatically cut clips from VOD for short-form content distribution.

- Acceptance: At minimum, a directory of candidate clip segments generated from each VOD.
  Quality bar: segments are meaningful (not silence/dead air).

## Non-Functional Requirements

### NFR-1: Reliability

Pipeline must handle Twitch VOD processing delays (VOD not immediately available after stream).

- Target: No missed VODs due to timing issues
- Verification: Process waits with retry logic, not a fixed delay

### NFR-2: YouTube API Sustainability

YouTube Data API quota: 10,000 units/day, upload = 1,600 units.

- Target: Stay within quota for up to 3 streams/day
- Verification: Quota monitoring, fallback if exceeded

### NFR-3: No Credential Exposure

OAuth tokens, API keys stored securely, never in git history.

- Target: Zero credentials in repository
- Verification: .gitignore covers all secret files, secrets in env or separate store

## Acceptance Criteria

- [ ] Stream ends on Twitch → VOD detected without manual action
- [ ] VOD downloaded locally before 7-day Twitch expiry
- [ ] YouTube upload completes with correct title and metadata
- [ ] Site entry created and deployed automatically after YouTube upload
- [ ] Clip candidates generated from each VOD (quality triage can be manual initially)
- [ ] No credentials committed to git
- [ ] Pipeline recoverable after failure (retryable, not one-shot)

## Scope

### In Scope

- Twitch stream end detection
- Twitch VOD download (yt-dlp)
- YouTube upload (API or CLI tool)
- Site .md file generation (this repo: p-cult.space)
- Basic clip segmentation (FFmpeg scene/silence detection)

### Out of Scope

- AI-powered clip selection or highlights (future phase)
- Auto-posting clips to TikTok/Instagram (future phase)
- Auto-generated stream descriptions with AI (future phase, but infrastructure for it)
- Twitch clip creation via Twitch API (separate from VOD clips)

### Phase Boundaries

- **Phase 1 (MVP)**: Site entry generation only. Trigger: manual YouTube URL input.
  This gives immediate value — no more manual .md writing.
- **Phase 2**: Twitch detection + VOD download + YouTube upload automation
- **Phase 3**: Clip creation pipeline
- **Phase 4**: Full hands-free (trigger to clips, zero intervention)

## Dependencies

### Internal

- p-cult.space repo with GitHub Actions CI already working
- GitHub token with repo write permissions (for file creation via API)

### External

- Twitch API credentials (Client-ID + Secret) for EventSub or VOD polling
- YouTube Data API v3 credentials (OAuth2 with upload scope)
- yt-dlp installed locally
- n8n instance (local or hosted) for orchestration — OR bash scripts + systemd

### Open Questions

- [ ] Where does the pipeline run? Local machine only, or VPS?
- [ ] n8n (existing) or bash + systemd for orchestration?
- [ ] YouTube upload: official API or `youtubeuploader` CLI (simpler OAuth flow)?
- [x] VOD source: Twitch Video Producer manual export → YouTube (current). Target: automated.
- [x] Clip creation: in scope but Phase 3, not MVP
