# Implementation Plan: Stream Automation Pipeline

Track ID: `stream-auto-pipeline_20260227`
Created: 2026-02-27
Status: in-progress

## Overview

Phased rollout from manual to fully autonomous. Each phase delivers standalone value.
Phase 1 is buildable immediately in this repo. Phases 2+ require infra decisions.

> **Decision (2026-03-12):** Phase 1 output is **direct .md push to GitHub** (not Notion).
> Reason: no Notion credentials configured; GitHub approach is consistent with existing
> .md file format and template. `gen-stream-entry` writes to `src/streams/` via GitHub API.

---

## Phase 1: Transcript → Notion Draft (n8n-content-processing repo)

**Source of truth:** transcript (SRT), not YouTube title/metadata
**Input:** Downloaded VOD file (manual trigger for now)
**Output:** Notion page created with Status: Draft — ready for editorial review

### Architecture

```
VOD file
  → v2a (existing)         → audio.m4a
  → gen-subs (existing)    → stream.srt
  → analyze-transcript     → {title, description, tags, timestamps} JSON
  → get-youtube-meta       → {video_id, vod_url, thumbnail_url, duration, published_at} JSON
  → n8n Notion node        → Streams Database page (Status: Draft)
```

Scripts live in `n8n-content-processing/scripts/`.

### Tasks

- [x] **Task 1.1**: `scripts/analyze-transcript` — reads SRT, calls Gemini, outputs editorial
  metadata JSON: {suggested_title, description, tags[], timestamps[{time, description}]}
- [x] **Task 1.2**: `scripts/analyze-transcript.prompt.md` — Gemini prompt for Ukrainian/Russian
  stream content, semantic timestamps, tags from Notion tag list
- [x] **Task 1.3**: `scripts/get-youtube-meta` — fetches YouTube metadata as JSON:
  {video_id, vod_url, thumbnail_url, duration, published_at}
- [x] **Task 1.4**: `scripts/gen-stream-entry` — orchestrates get-youtube-meta + analyze-transcript,
  builds .md frontmatter, pushes to GitHub via Contents API. Plus n8n workflow template.
  Updated approach: GitHub push (not Notion — see decision note above) `48eb37a`
- [x] **Task 1.5**: Test full chain: real YouTube URL → .md pushed to GitHub ✅
  Tested (GitHub push): youtu.be/325RrR-sqKU → 2026-02-12-325rrr-sqku.md → shelban/p-cult.space
  Tested (--output local): youtu.be/KYb0EkDIuFY → /tmp/test-stream-entry.md (2026-03-12)
  (full pipeline with SRT pending real new stream)

### Verification

- [ ] **Verify 1.1**: `analyze-transcript --srt test.srt` outputs valid JSON with all 4 fields
- [x] **Verify 1.2**: End-to-end GitHub push verified: YouTube URL → .md in shelban/p-cult.space `src/streams/` ✅
- [ ] **Verify 1.3**: n8n workflow template runs end-to-end without error on real stream data

---

## Phase 2: Twitch → YouTube Automation (Infra)

**Input:** Stream ends on Twitch
**Output:** VOD on YouTube, site updated

> Note: This phase likely lives outside this repo (n8n workflows or separate scripts repo).
> This plan tracks decisions and interfaces.

### Tasks

- [ ] **Task 2.1**: Decide orchestration: n8n vs bash+systemd. Document decision.
- [ ] **Task 2.2**: Set up Twitch EventSub subscription for `stream.offline` event.
  Alternative: polling Twitch API every 5min for VOD availability if EventSub infra is complex.
- [ ] **Task 2.3**: Implement VOD download step using yt-dlp.
  `yt-dlp -o "%(title)s.%(ext)s" https://www.twitch.tv/videos/{vod_id}`
- [ ] **Task 2.4**: Implement YouTube upload. Evaluate:
  - `youtubeuploader` CLI (go binary, simpler OAuth) vs YouTube Data API v3 direct
  - Handle OAuth2 refresh token storage securely
- [ ] **Task 2.5**: After YouTube upload, trigger Phase 1 workflow (GitHub Action dispatch)
  with the YouTube URL. This bridges Phase 2 → Phase 1.
- [ ] **Task 2.6**: Add retry logic for VOD availability (poll until available, max 2hr wait)

### Verification

- [ ] **Verify 2.1**: End a test stream → VOD appears on YouTube within 2 hours without intervention
- [ ] **Verify 2.2**: Site entry created automatically after YouTube upload

---

## Phase 3: Clip Creation Pipeline

**Input:** Downloaded VOD file
**Output:** Directory of clip candidates (timestamped segments)

### Tasks

- [ ] **Task 3.1**: FFmpeg silence/scene detection pass to identify natural break points
  `ffmpeg -i input.mp4 -af silencedetect=noise=-50dB:d=5 -f null -`
- [ ] **Task 3.2**: Split VOD into segments at detected boundaries (target: 1-15min segments)
- [ ] **Task 3.3**: Generate preview thumbnails per segment for manual review
- [ ] **Task 3.4**: Output manifest JSON: [{start, end, duration, thumbnail_path}]
- [ ] **Task 3.5**: Simple review UI or CLI to mark segments as "clip" / "skip" / "highlight"

### Verification

- [ ] **Verify 3.1**: Given a test VOD, segments are generated with no dead-air segments included
- [ ] **Verify 3.2**: Manifest JSON is valid and thumbnails are generated

---

## Phase 4: Full Automation

**Input:** Stream ends
**Output:** YouTube VOD live, site updated, clip candidates ready — zero manual steps

### Tasks

- [ ] **Task 4.1**: Wire Phase 1 + 2 + 3 into single orchestrated flow
- [ ] **Task 4.2**: Notifications: Telegram message when each stage completes or fails
- [ ] **Task 4.3**: Failure recovery: if any stage fails, retry or notify with context
- [ ] **Task 4.4**: Monitoring: log pipeline runs, success/failure per stage

### Verification

- [ ] **Verify 4.1**: Full pipeline smoke test with real stream
- [ ] **Verify 4.2**: Failure in any stage sends Telegram notification with actionable info

---

## Checkpoints

| Phase   | Checkpoint SHA | Date | Status  |
| ------- | -------------- | ---- | ------- |
| Phase 1 | 5193e65        | 2026-03-12 | partial (Verify 1.1+1.3 pending SRT/n8n test) |
| Phase 2 |                |      | pending |
| Phase 3 |                |      | pending |
| Phase 4 |                |      | pending |

---

## Infra Decisions

1. **Orchestration runtime**: ✅ **VPS (AWS EC2)** — decided 2026-03-19
   Eve already started EC2 setup, interrupted by power outages (wartime).
   Resume EC2 provisioning when ready.

2. **Workflow engine**: ✅ **OpenClaw** (self-hosted AI agent, open-source) — decided 2026-03-19
   Replaces n8n consideration. OpenClaw runs on VPS, 50+ integrations.
   ⚠️ Security: vet ClawHub packages carefully (Bitdefender found ~20% malicious in registry Feb 2026).

3. **YouTube OAuth**: still needed — one-time setup on EC2 instance

## Open Infra Decisions (remaining)

1. **EC2 instance type**: t3.small? t3.medium? Depends on VOD processing needs.
2. **Storage**: EBS volume size for VOD temp storage during processing.
3. **OpenClaw version/config**: which AgentSkills to enable, security hardening.
