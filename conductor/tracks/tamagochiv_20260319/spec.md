# Tamagochiv — Audience Relationship Engine

## Overview

**тамагочів** (tamagochi + ів) — gamified audience interaction system where viewers interact with the streamer as a "live tamagotchi." Not a virtual pet — the streamer herself as a living entity the audience can observe, influence, and engage with.

## Functional Requirements

### FR-1: Status System
Users can check current streamer status (streaming, working, resting, unavailable, etc.)
- Acceptance: `/status` returns current status with timestamp

### FR-2: Event Feed
Users see daily event log (stream started, post published, highlight added, etc.)
- Acceptance: `/today` returns chronological list of today's events

### FR-3: Highlights
Curated notable content separate from raw events
- Acceptance: `/highlight` returns latest highlight

### FR-4: Polls
Audience votes on choices the streamer offers
- Acceptance: `/vote` shows active poll, user can vote once per poll

### FR-5: Questions
Audience submits questions for the streamer
- Acceptance: `/ask <text>` stores question with user attribution

### FR-6: Admin Controls
Streamer manages all entities via Telegram admin commands
- Acceptance: `/set_status`, `/add_event`, `/add_highlight`, `/new_poll`, `/close_poll` work for admin user

### FR-7: Access Control
Content filtered by user access level (public/member/supporter/nsfw_allowed) and content scope (sfw/nsfw/mixed/internal)
- Acceptance: Users only see content matching their access level + scope permissions

## Non-Functional Requirements

### NFR-1: Manual-First
System works entirely via manual admin commands — no external integrations required
- Verification: All features functional without Twitch/n8n/Tasker

### NFR-2: Single Source of Truth
PostgreSQL is the only data store. Bot and future web read from same DB.
- Verification: No data stored only in Telegram or files

### NFR-3: Extension-Ready Architecture
Structured so payments, web dashboard, Twitch integration can be added later without rewrite
- Verification: Clear service boundaries, scope/access fields on all entities

## Acceptance Criteria

- [ ] Telegram bot responds to all MVP commands (public + admin)
- [ ] Status, events, highlights, polls, questions stored in PostgreSQL
- [ ] Content filtering by access level and scope works
- [ ] Admin can manage all entities without external tools
- [ ] Docker Compose brings up full stack locally
- [ ] Core engagement loop works: check status → see events → vote → ask question

## Scope

### In Scope (MVP-1)
- Telegram bot with public + admin commands
- PostgreSQL schema for all core entities
- FastAPI backend (bot talks to API, not DB directly)
- Access levels: public, member, supporter, nsfw_allowed
- Content scope: sfw, nsfw, mixed, internal
- Docker Compose local dev

### Out of Scope
- Web dashboard / frontend
- Twitch/EventSub integration
- Tasker/phone automation
- Telegram payments / Stars
- Cosmetics / inventory / shop
- Achievement system
- Complex analytics
- Multi-surface infrastructure
- n8n/OpenClaw orchestration
- Broadcast / push notifications (can defer)

## Dependencies

### External
- Telegram Bot API (via aiogram)
- PostgreSQL 16+

### Internal
- None — standalone project, separate repo from p-cult.space

## Tech Stack (Decided)
- Python 3.12+
- FastAPI
- aiogram 3.x
- PostgreSQL
- SQLAlchemy 2.x + Alembic
- Docker Compose
