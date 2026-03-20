# Tamagochiv MVP-1 Architecture

## 1. Repository Structure

```
tamagochiv/
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── pyproject.toml
├── alembic.ini
├── alembic/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── 001_initial_schema.py
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app factory
│   ├── config.py                  # Settings via pydantic-settings
│   ├── database.py                # async engine + session factory
│   ├── models/
│   │   ├── __init__.py            # re-exports all models
│   │   ├── user.py
│   │   ├── status.py
│   │   ├── event.py
│   │   ├── highlight.py
│   │   ├── poll.py
│   │   └── question.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── status.py
│   │   ├── event.py
│   │   ├── highlight.py
│   │   ├── poll.py
│   │   └── question.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── access.py              # AccessService
│   │   ├── status.py              # StatusService
│   │   ├── event.py               # EventService
│   │   ├── highlight.py           # HighlightService
│   │   ├── poll.py                # PollService
│   │   └── question.py            # QuestionService
│   └── api/
│       ├── __init__.py
│       ├── deps.py                # get_db, get_current_user
│       ├── router.py              # includes all sub-routers
│       ├── status.py
│       ├── events.py
│       ├── highlights.py
│       ├── polls.py
│       ├── questions.py
│       └── users.py
├── bot/
│   ├── __init__.py
│   ├── main.py                    # aiogram Dispatcher + startup
│   ├── config.py                  # bot token, API base URL
│   ├── api_client.py              # httpx client wrapping FastAPI
│   ├── middlewares/
│   │   ├── __init__.py
│   │   └── auth.py                # ensure_registered middleware
│   ├── handlers/
│   │   ├── __init__.py
│   │   ├── public.py              # /start /help /status /today /highlight /vote /ask /follow
│   │   └── admin.py               # /set_status /add_event /add_highlight /new_poll /close_poll /grant_nsfw /revoke_nsfw
│   ├── keyboards/
│   │   ├── __init__.py
│   │   └── polls.py               # inline keyboards for voting
│   └── filters/
│       ├── __init__.py
│       └── admin.py               # AdminFilter (checks telegram_id list)
└── tests/
    ├── conftest.py
    ├── test_api/
    │   └── ...
    └── test_bot/
        └── ...
```

Key structural decisions:

- **`app/` and `bot/` are sibling packages, not nested.** The bot is a separate process that talks to the API over HTTP. They share nothing at import time. This enforces the "bot talks to API, not DB" constraint at the process boundary level.
- **`app/services/` contains all business logic.** API routes are thin wrappers that validate input, call a service, return output. This means a future web dashboard or Twitch integration calls the same services.
- **`app/schemas/` are Pydantic models for API request/response.** Separate from SQLAlchemy models to keep the API contract stable even if DB schema evolves.
- **Single `Dockerfile` with multi-target build.** One image, two entrypoints (`app.main:app` for uvicorn, `bot.main` for aiogram polling).

---

## 2. Database Schema

```sql
-- Enums
CREATE TYPE access_level AS ENUM ('public', 'member', 'supporter', 'nsfw_allowed');
CREATE TYPE content_scope AS ENUM ('sfw', 'nsfw', 'mixed', 'internal');

-- Users
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    telegram_id   BIGINT UNIQUE NOT NULL,
    username      VARCHAR(255),
    display_name  VARCHAR(255),
    access_level  access_level NOT NULL DEFAULT 'public',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_telegram_id ON users (telegram_id);

-- Status snapshots (append-only log; latest row = current status)
CREATE TABLE status_snapshots (
    id         SERIAL PRIMARY KEY,
    status     VARCHAR(255) NOT NULL,
    set_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    set_by     INTEGER REFERENCES users(id)
);
CREATE INDEX idx_status_set_at ON status_snapshots (set_at DESC);

-- Events
CREATE TABLE events (
    id         SERIAL PRIMARY KEY,
    type       VARCHAR(100) NOT NULL,     -- 'stream_start', 'post_published', 'manual', etc.
    text       TEXT NOT NULL,
    scope      content_scope NOT NULL DEFAULT 'sfw',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_events_created_at ON events (created_at DESC);
CREATE INDEX idx_events_scope ON events (scope);

-- Highlights
CREATE TABLE highlights (
    id         SERIAL PRIMARY KEY,
    text       TEXT NOT NULL,
    scope      content_scope NOT NULL DEFAULT 'sfw',
    media_url  TEXT,                       -- nullable, future: photo/clip link
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_highlights_created_at ON highlights (created_at DESC);

-- Polls
CREATE TABLE polls (
    id         SERIAL PRIMARY KEY,
    question   TEXT NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT true,
    scope      content_scope NOT NULL DEFAULT 'sfw',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at  TIMESTAMPTZ
);
CREATE INDEX idx_polls_active ON polls (is_active) WHERE is_active = true;

CREATE TABLE poll_options (
    id         SERIAL PRIMARY KEY,
    poll_id    INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    text       VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_poll_options_poll ON poll_options (poll_id);

CREATE TABLE poll_votes (
    id         SERIAL PRIMARY KEY,
    poll_id    INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id  INTEGER NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id    INTEGER NOT NULL REFERENCES users(id),
    voted_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (poll_id, user_id)              -- one vote per user per poll
);
CREATE INDEX idx_poll_votes_poll ON poll_votes (poll_id);

-- Questions
CREATE TABLE questions (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    text        TEXT NOT NULL,
    scope       content_scope NOT NULL DEFAULT 'sfw',
    is_answered BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_questions_answered ON questions (is_answered);
```

Design notes:

- **Status is append-only.** Current status = `SELECT * FROM status_snapshots ORDER BY set_at DESC LIMIT 1`. This gives full history for free. No updates, no lost data.
- **`scope` on every content table.** This is the hook for access control filtering. A single `WHERE scope` clause in the service layer handles visibility.
- **`access_level` is a single enum, not a bitmask.** Levels are ordered: public < member < supporter. `nsfw_allowed` is a separate axis but modeled as the highest level for MVP simplicity. If this needs to become orthogonal (supporter who is NOT nsfw_allowed), Phase 3 can add a boolean `nsfw_allowed` column without schema rewrite.
- **No soft deletes in MVP.** Hard delete is fine. Soft deletes are a future concern if needed for audit trails.

---

## 3. Domain Model / Service Boundaries

Each service owns one aggregate and exposes methods the API layer calls. Services receive a database session and return Pydantic schemas. No service imports another service directly -- if cross-cutting logic is needed, the API route orchestrates.

### AccessService (`app/services/access.py`)

The gatekeeper. Every content-returning endpoint calls this to filter results.

```
AccessService:
    can_view(user_access_level, content_scope) -> bool
    scope_filter(user_access_level) -> list[content_scope]  # allowed scopes for WHERE clause
```

Visibility matrix:

| User Level     | Sees scopes              |
|----------------|--------------------------|
| public         | sfw                      |
| member         | sfw, mixed               |
| supporter      | sfw, mixed               |
| nsfw_allowed   | sfw, mixed, nsfw         |

`internal` scope is never shown via bot -- reserved for future admin dashboard.

### StatusService (`app/services/status.py`)

```
StatusService:
    get_current() -> StatusSnapshot | None
    set_status(text, set_by_user_id) -> StatusSnapshot
    get_history(limit) -> list[StatusSnapshot]
```

### EventService (`app/services/event.py`)

```
EventService:
    get_today(allowed_scopes) -> list[Event]
    add_event(type, text, scope) -> Event
```

### HighlightService (`app/services/highlight.py`)

```
HighlightService:
    get_latest(allowed_scopes) -> Highlight | None
    get_recent(allowed_scopes, limit=5) -> list[Highlight]
    add_highlight(text, scope, media_url=None) -> Highlight
```

### PollService (`app/services/poll.py`)

```
PollService:
    get_active(allowed_scopes) -> Poll | None       # with options + vote counts
    create_poll(question, options, scope) -> Poll
    vote(poll_id, option_id, user_id) -> PollVote    # raises if already voted
    close_poll(poll_id) -> Poll
```

### QuestionService (`app/services/question.py`)

```
QuestionService:
    submit(user_id, text, scope) -> Question
    get_unanswered(limit) -> list[Question]          # admin use
    mark_answered(question_id) -> Question
```

### UserService (`app/services/user.py`)

```
UserService:
    get_or_create(telegram_id, username, display_name) -> User
    get_by_telegram_id(telegram_id) -> User | None
    set_access_level(telegram_id, level) -> User
```

---

## 4. Bot Handler Breakdown

### Process Architecture

The bot runs as a separate process using aiogram long-polling. It communicates with FastAPI exclusively via HTTP using an `ApiClient` wrapper (httpx async client). The bot never imports from `app/`.

```
Telegram API  <-->  aiogram (bot/main.py)  <-->  httpx  <-->  FastAPI (app/main.py)  <-->  PostgreSQL
```

### Middleware: Auto-Registration

Every incoming message passes through `ensure_registered` middleware. It calls `POST /api/users/ensure` with the sender's telegram_id, username, and display_name. The API upserts the user and returns their access_level. This is cached in handler context for the duration of the request.

### Public Handlers (`bot/handlers/public.py`)

| Command      | Behavior |
|-------------|----------|
| `/start`    | Welcome message. Calls ensure_registered. Returns brief intro + command list. |
| `/help`     | Lists available commands with short descriptions. |
| `/status`   | `GET /api/status/current` -- returns current status + timestamp. "she is: streaming since 14:30" |
| `/today`    | `GET /api/events/today?scopes=...` -- returns today's events filtered by user's allowed scopes. |
| `/highlight`| `GET /api/highlights/latest?scopes=...` -- returns latest highlight. If media_url present, sends as photo. |
| `/vote`     | `GET /api/polls/active?scopes=...` -- shows active poll with inline keyboard. Callback handler calls `POST /api/polls/{id}/vote`. |
| `/ask <text>` | `POST /api/questions` -- submits question. Confirms submission. Rejects empty text. |
| `/follow`   | Static message with links to all social platforms. No API call needed. |

### Admin Handlers (`bot/handlers/admin.py`)

Protected by `AdminFilter` -- checks telegram_id against a list in config (environment variable `ADMIN_TELEGRAM_IDS`). Not database-driven; hardcoded admin list is simpler and more secure for a single-streamer system.

| Command | Behavior |
|---------|----------|
| `/set_status <text>` | `POST /api/status` -- sets new status. |
| `/add_event <type> <text> [scope]` | `POST /api/events` -- adds event. Scope defaults to `sfw`. |
| `/add_highlight <text> [scope]` | `POST /api/highlights` -- adds highlight. |
| `/new_poll <question> \| <opt1> \| <opt2> [... \| scope]` | `POST /api/polls` -- creates poll. Pipe-delimited for easy mobile input. |
| `/close_poll` | `POST /api/polls/active/close` -- closes currently active poll, shows final results. |
| `/grant_nsfw <@username or telegram_id>` | `PATCH /api/users/{id}/access` -- sets access_level to nsfw_allowed. |
| `/revoke_nsfw <@username or telegram_id>` | `PATCH /api/users/{id}/access` -- resets access_level to public. |

### Callback Handlers

| Callback | Trigger |
|----------|---------|
| `vote:{poll_id}:{option_id}` | Inline button press from `/vote`. Calls `POST /api/polls/{id}/vote`, edits message to show updated counts. |

---

## 5. API Endpoints

All under `/api/v1/` prefix.

```
POST   /api/v1/users/ensure                   # upsert by telegram_id
GET    /api/v1/users/{telegram_id}             # get user
PATCH  /api/v1/users/{telegram_id}/access      # set access_level

GET    /api/v1/status/current                  # latest status snapshot
POST   /api/v1/status                          # set new status
GET    /api/v1/status/history?limit=10         # status history

GET    /api/v1/events/today?scopes=sfw,mixed   # today's events filtered
POST   /api/v1/events                          # add event

GET    /api/v1/highlights/latest?scopes=sfw    # latest highlight
GET    /api/v1/highlights?scopes=sfw&limit=5   # recent highlights
POST   /api/v1/highlights                      # add highlight

GET    /api/v1/polls/active?scopes=sfw,mixed   # active poll with options+counts
POST   /api/v1/polls                           # create poll
POST   /api/v1/polls/{id}/vote                 # cast vote
POST   /api/v1/polls/active/close              # close active poll

POST   /api/v1/questions                       # submit question
GET    /api/v1/questions/unanswered?limit=20   # admin: get unanswered
PATCH  /api/v1/questions/{id}/answer           # admin: mark answered
```

No authentication on the API in MVP. The API runs on an internal Docker network, not exposed to the internet. The bot is the only client. If a web dashboard is added later, API key or JWT auth gets added at the `deps.py` level without changing routes.

---

## 6. Implementation Phases

### Phase 1: Scaffold + DB + Status + Events

**Goal:** Working bot that can set/get status and log events.

Tasks:
- [P] Set up repo with pyproject.toml, Docker Compose (postgres + app), .env.example
- [P] Create SQLAlchemy models for all tables (do the full schema upfront)
- [P] Create Alembic initial migration
- FastAPI app factory with config, database session
- StatusService + EventService
- API routes: status + events
- Bot scaffold: aiogram dispatcher, api_client, AdminFilter
- Bot handlers: /start, /help, /status, /today, /set_status, /add_event
- Verify: `docker compose up` brings up working bot + API + postgres

Estimated effort: 2-3 sessions.

### Phase 2: Highlights + Polls + Questions

**Goal:** Full content feature set.

Tasks:
- HighlightService + PollService + QuestionService
- API routes: highlights, polls, questions
- Bot handlers: /highlight, /vote, /ask, /add_highlight, /new_poll, /close_poll
- Inline keyboard for poll voting + callback handler
- Verify: complete engagement loop works (status -> events -> vote -> ask)

Estimated effort: 2-3 sessions.

### Phase 3: Access Control + Scope Filtering

**Goal:** Content visibility rules enforced everywhere.

Tasks:
- AccessService with visibility matrix
- ensure_registered middleware caches user access_level
- All GET endpoints accept `scopes` parameter, filtered by AccessService
- Bot handlers pass user's allowed scopes to every content request
- /grant_nsfw and /revoke_nsfw admin commands
- Verify: public user cannot see nsfw content, nsfw_allowed user can

Estimated effort: 1-2 sessions.

### Phase 4: Deployment Prep + Hardening

**Goal:** Ready to run on a VPS.

Tasks:
- Docker Compose production profile (restart policies, healthchecks, resource limits)
- Environment variable documentation
- Alembic migration runner in entrypoint
- Basic error handling: bot gracefully handles API downtime
- /follow command with social links
- Logging configuration (structured JSON logs)
- Verify: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d` runs stable

Estimated effort: 1 session.

---

## 7. Extension Points (FUTURE -- not MVP-1)

These are explicitly out of scope. The architecture accommodates them through specific hooks.

### Web Dashboard
- **Hook:** FastAPI already serves JSON. Add a `/web/` route group with Jinja2 templates or serve a separate SPA.
- **Hook:** All business logic lives in services, not bot handlers. Dashboard calls same services.

### Twitch EventSub
- **Hook:** `events.type` field accepts any string. A Twitch integration writes events with types like `twitch_stream_start`, `twitch_raid`. No schema change needed.
- **Hook:** `status_snapshots` can be written by an automated process. Add a `source` column (`manual`, `twitch`, `tasker`) when needed.

### Payments / Monetization (Telegram Stars, etc.)
- **Hook:** `users.access_level` is the gate. A payment handler upgrades access_level on successful payment.
- **Schema addition (future):** `transactions` table (user_id, amount, type, created_at). Not in MVP.

### Cosmetics / Shop / Achievements
- **Hook:** `users.id` is the foreign key anchor. Future tables: `inventory`, `shop_items`, `achievements`, `user_achievements`.
- **Hook:** Services pattern means a `ShopService` and `AchievementService` slot in naturally.
- **Design note:** Achievements should be event-driven. The `events` table already logs actions. A future achievement engine can scan events to grant achievements retroactively.

### Push Notifications / Broadcasts
- **Hook:** `users` table has all registered users. A `BroadcastService` iterates users filtered by access_level.
- **Schema addition (future):** `user_preferences` (user_id, notifications_enabled, quiet_hours).

### Analytics
- **Hook:** All content tables have `created_at` timestamps. `poll_votes` has `voted_at`. `questions` has `is_answered`. Basic analytics are just SQL queries over existing data.
- **Schema addition (future):** `user_activity` log table for richer tracking.

### n8n / Tasker / External Automation
- **Hook:** The API is HTTP. Any automation tool can call it. Add API key auth when exposing beyond localhost.

---

## 8. Key Architectural Decisions

### ADR-1: Bot as separate process, not FastAPI sub-application
**Decision:** Bot and API run as separate processes in separate containers.
**Rationale:** aiogram's polling loop and FastAPI's ASGI server have different lifecycle needs. Coupling them creates complexity around startup order, error isolation, and scaling. Separate processes mean the bot can restart without affecting the API, and vice versa.

### ADR-2: No API authentication in MVP
**Decision:** API endpoints have no auth. Docker network isolation is the security boundary.
**Rationale:** The only client is the bot running on the same Docker network. Adding JWT/API-key auth now is YAGNI. When a web dashboard is added, auth gets added at the dependency injection layer (`deps.py`) without changing any route or service code.

### ADR-3: Append-only status with latest-wins semantics
**Decision:** Status is an append-only log, not a single mutable row.
**Rationale:** History is valuable (when did she start streaming? how long was she resting?). Append-only is simpler than update + audit log. Current status is always `ORDER BY set_at DESC LIMIT 1`. The performance cost of this query with an index is negligible even at millions of rows.

### ADR-4: Admin list in environment, not database
**Decision:** Admin telegram IDs are in an environment variable, not a database table.
**Rationale:** Single-streamer system. Admin set changes approximately never. Environment variable means no admin bootstrapping problem (who creates the first admin?), no SQL injection risk on admin check, and configuration is version-controlled in .env.

### ADR-5: Scopes parameter on GET endpoints, not implicit from session
**Decision:** Content endpoints accept explicit `scopes` query parameter rather than inferring from a session/token.
**Rationale:** The bot is the trust boundary. It determines what scopes a user can see (via AccessService) and passes them explicitly. This keeps the API stateless and testable -- you can test scope filtering with curl without simulating a user session.

---

## 9. Docker Compose Layout

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: tamagochiv
      POSTGRES_USER: tamagochiv
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: pg_isready -U tamagochiv
      interval: 5s
      retries: 5

  api:
    build: .
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000
    environment:
      DATABASE_URL: postgresql+asyncpg://tamagochiv:${DB_PASSWORD}@db:5432/tamagochiv
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8000:8000"  # exposed for local dev; remove in prod

  bot:
    build: .
    command: python -m bot.main
    environment:
      BOT_TOKEN: ${BOT_TOKEN}
      API_BASE_URL: http://api:8000
      ADMIN_TELEGRAM_IDS: ${ADMIN_TELEGRAM_IDS}
    depends_on:
      - api

volumes:
  pgdata:
```

Three containers. One network. Bot talks to API by service name. Database is only reachable from API.
