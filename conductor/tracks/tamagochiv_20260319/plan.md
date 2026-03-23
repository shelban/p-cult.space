# Implementation Plan: Tamagochiv MVP-1

Track ID: `tamagochiv_20260319`
Created: 2026-03-19
Status: in-progress

## Overview

Gamified audience interaction Telegram bot. FastAPI backend + aiogram bot + PostgreSQL.
Code lives in `~/git-repos/tamagochiv/`. This track manages progress from p-cult.space Conductor.

Architecture spec: `conductor/tracks/tamagochiv_20260319/architecture.md`

---

## Phase 1: Scaffold + DB + Status + Events

**Goal:** Working bot that can set/get status and log events.
**Status:** ✅ Complete — committed `e7ae4f2` (2026-03-19)

### Tasks

- [x] **Task 1.1**: Set up repo — pyproject.toml, Docker Compose (postgres + api + bot), .env.example, .gitignore, Dockerfile
- [x] **Task 1.2**: SQLAlchemy models for all 7 tables (full schema upfront): users, status_snapshots, events, highlights, polls, poll_options, poll_votes, questions
- [x] **Task 1.3**: Alembic initial migration (`alembic/versions/001_initial_schema.py`) — pure SQL, all enums + tables
- [x] **Task 1.4**: FastAPI app factory — `app/main.py`, `app/config.py`, `app/database.py`
- [x] **Task 1.5**: StatusService + EventService + UserService + AccessService (fully implemented)
- [x] **Task 1.6**: API routes — status, events, users; wired into `app/api/router.py`
- [x] **Task 1.7**: Bot scaffold — aiogram Dispatcher, api_client (httpx), AdminFilter, ensure_registered middleware
- [x] **Task 1.8**: Bot handlers — /start, /help, /status, /today (public); /set_status, /add_event (admin)
- [x] **Task 1.9**: Docker secrets support for production (`docker-compose.prod.yml`)
  - Fix: admin_ids parsing from comma-separated env string (`bbeb08a`)

### Verification

- [x] **Verify 1.1**: `docker-compose up --build -d` brings up all 3 containers ✅ 2026-03-23
  - DB healthy, alembic ran migration, uvicorn started, bot connected as @stream_going_live_bot

---

## Phase 2: Highlights + Polls + Questions

**Goal:** Full content feature set — all MVP commands functional.

### Tasks

- [x] **Task 2.1**: HighlightService implementation (`app/services/highlight.py`)
  - `get_latest(allowed_scopes)`, `get_recent(allowed_scopes, limit)`, `add_highlight(text, scope, media_url)`
- [x] **Task 2.2**: PollService implementation (`app/services/poll.py`)
  - `get_active(allowed_scopes)` with vote counts, `create_poll`, `vote` (AlreadyVotedError), `close_active`
- [x] **Task 2.3**: QuestionService implementation (`app/services/question.py`)
  - `submit`, `get_unanswered`, `mark_answered`
- [x] **Task 2.4**: API routes — highlights, polls, questions (`app/api/highlights.py`, `polls.py`, `questions.py`); wired into router
- [x] **Task 2.5**: Extend `bot/api_client.py` with Phase 2 endpoint methods
- [x] **Task 2.6**: Bot public handlers — /highlight, /vote (with inline keyboard), /ask, /follow
  - Poll inline keyboard (`bot/keyboards/polls.py`) + callback handler `vote:{poll_id}:{option_id}`
- [x] **Task 2.7**: Bot admin handlers — /add_highlight, /new_poll (pipe-delimited format), /close_poll
- [x] **Task 2.8**: Bot admin handlers — /grant_nsfw, /revoke_nsfw (access level management)

### Verification

- [ ] **Verify 2.1**: Complete engagement loop works: /status → /today → /vote → /ask

---

## Phase 3: Deployment Hardening

**Goal:** Ready to run stably on VPS.

### Tasks

- [x] **Task 3.1**: Docker secrets support (done in Phase 1 — `docker-compose.prod.yml`)
- [x] **Task 3.2**: Restart policies (`restart: unless-stopped` in prod compose)
- [x] **Task 3.3**: Alembic migration runs automatically — API command: `alembic upgrade head && uvicorn ...`
- [ ] **Task 3.4**: Bot error handling — graceful degradation when API is unreachable
- [ ] **Task 3.5**: /follow command with hardcoded social links
- [ ] **Task 3.6**: Structured JSON logging configuration

### Verification

- [ ] **Verify 3.1**: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d` runs stable with secrets

---

## Checkpoints

| Phase   | Checkpoint SHA | Date       | Status  |
|---------|----------------|------------|---------|
| Phase 1 | e7ae4f2        | 2026-03-19 | complete (Verify 1.1 pending live test) |
| Phase 2 | 6908e66        | 2026-03-23 | complete (imports verified; Verify 2.1 pending live test) |
| Phase 3 |                |            | pending |

---

## Infra Notes

- Code repo: `~/git-repos/tamagochiv/`
- Secrets: `secrets/bot_token.txt`, `secrets/db_password.txt`, `secrets/admin_ids.txt`
- Deploy target: AWS EC2 (decided 2026-03-19)
- Bot token: loaded from secrets file in prod, `BOT_TOKEN` env var in dev
