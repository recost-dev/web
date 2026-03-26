# recost — CLAUDE.md

## Monorepo structure

```
recost/
├── web/               # Frontend — Vite + React 19 + React Router v7
├── api/               # Backend  — Hono on Cloudflare Workers + D1
├── extension/         # VS Code extension
├── middleware-node/   # Node.js SDK
├── middleware-python/ # Python SDK
└── docs/
```

---

## Web (`/web`)

**Stack:** Vite, React 19, React Router v7, TanStack Query v5, Tailwind v4, shadcn/ui (Radix primitives), Framer Motion (`motion` package), Recharts, Zod, React Hook Form, Sonner (toasts)

**Dev server:** `npm run dev` → `http://localhost:5173`

**Note:** There is also an `app/` directory (Next.js App Router) which is not the active running app. All active work is in `src/`.

### Key directories

```
src/
├── pages/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx   — shared layout: sidebar, top navbar, breadcrumb
│   │   ├── GettingStarted.tsx    — /dashboard (home)
│   │   ├── Projects.tsx          — /dashboard/projects (list)
│   │   ├── ProjectDetail.tsx     — /dashboard/projects/:id (tabbed: Live, Endpoints, Suggestions, etc.)
│   │   └── Account.tsx           — /dashboard/account (API keys, settings)
│   └── ...                       — landing, login, etc.
├── lib/
│   ├── api-client.ts             — typed fetch wrapper; mock intercept layer (per-project ID routing)
│   ├── auth-context.tsx          — JWT auth context; mock bypass
│   ├── theme-context.tsx         — theme provider
│   └── themes.ts                 — theme definitions
└── components/                   — shared UI components
```

**ProjectDetail tabs & components:**
- `LiveTab` — real-time telemetry view: pulse indicator, summary stats (monthly cost / calls/day / endpoint count), cost-by-provider progress bars, weekly call volume chart, top endpoints table (sortable by cost or calls)
- `ProjectIdChip` — inline copy-to-clipboard for project ID
- `SortDropdown<T>` — generic sort selector used in LiveTab and other tabs
- `PROVIDER_COLORS` — map of provider name → accent color for charts/bars

**Landing page components (`components/landing/`):**
- `FeaturesSection` (horizontal scroll) — scroll-driven stacking card animation for 5 feature highlights; replaces the old static grid
- `StatsStrip` — animated stats bar: 30s telemetry windows, 10+ SDK frameworks, 8 AI providers, 1 line to set up
- `RoleDropdown` — role selector (Student / Developer / Founder / Other) used in mailing list and waitlist modals
- `DashboardPreview` — updated to show an endpoints table (method badge, provider, URL, calls/day, cost) instead of API keys

### Local mock mode

Set `VITE_DEV_AUTH=true` in `web/.env.local`. The api-client intercepts all requests and returns data from `app/lib/mock-data.ts` (a shared mock file used by both the Vite app and Next.js). `.env.local` is never committed or deployed — when hosted, the env var is absent and the real API is used.

Mock data is per-project — each resource has a `MOCK_*_MAP` keyed by project ID (`proj_mock_001/002/003`), with flat aliases for backwards compatibility:
- Maps: `MOCK_ENDPOINTS_MAP`, `MOCK_SUGGESTIONS_MAP`, `MOCK_COST_BY_PROVIDER_MAP`, `MOCK_COST_BY_FILE_MAP`, `MOCK_SCANS_MAP`, `MOCK_LATEST_SCAN_MAP`, `MOCK_COST_SUMMARY_MAP`
- Flat aliases: `MOCK_PROJECTS`, `MOCK_KEYS`, `MOCK_USER`, `MOCK_ENDPOINTS`, `MOCK_SUGGESTIONS`, etc.

The api-client resolves mock data by matching the project ID from the request path (`/projects/:id/...`) against the maps, falling back to the first project's data.

The api-client also uses `VITE_API_URL` (default: `https://api.recost.dev`) to set the base URL.

### Design language & styling conventions

**Colors:**
- Page background: `#111111`
- Card / panel background: `#1a1a1a` or `#1c1c1c`
- Input / border: `#262626`
- Text primary: `#fafafa`
- Text secondary: `#a3a3a3`
- Text muted: `#737373`
- Accent (cost / value / highlight): `#d4900a` (amber) — primary accent; amber = cost intelligence
- Status only (live/beta pulse dots, copied state): `#22c55e` (green), used sparingly
- Destructive: `#ef4444` (red)

**Typography:** Plus Jakarta Sans (sans-serif), Geist Mono (monospace)

**Layout:**
- Dashboard pages: no `max-w-*` width constraints — go wide
- Top padding: minimal, `pt-6` or `pt-8` max; the navbar is `h-14` fixed
- Sidebar is fixed-width; content area fills the rest

**Animations:**
- Library: Framer Motion (`motion` from `"motion/react"`)
- Helper: `FADE(delay)` → `{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: "easeOut", delay } }`
- Do not apply per-item stagger when data is synchronously available on mount (causes flash at natural position before framer-motion applies `initial`). Animate the container as a single block instead.

**Component conventions:**
- No emojis
- No `rounded-full` pill buttons
- Keep it minimal and sharp
- Use `onMouseEnter`/`onMouseLeave` for hover state when Tailwind hover specificity is overridden by inline styles
- Never mix inline `style` color with Tailwind `hover:` color classes — Tailwind hover won't override inline styles; use Tailwind classes only

**Breadcrumb (top navbar):**
- Format: `recost — Section — Subsection` with ` — ` dash separators (not `>` chevrons)
- Implemented in `DashboardLayout.tsx` via `usePageLabel()`
- On project detail pages, the project name is pulled from the projects list query cache (`['dashboard-projects']`) so there is no loading flash. Falls back to the individual project cache (`['dashboard-project', id]`), then `'…'`
- Section labels (e.g. "Projects") are clickable `<Link>` components with `hover:text-[#fafafa]` transition

---

## API (`/api`)

**Stack:** Hono v4, Cloudflare Workers, D1 (SQLite), KV (rate limiting & OAuth state), Wrangler

**Scripts:**
- `npm run dev` — local dev via wrangler
- `npm run deploy` — deploy to Cloudflare
- `npm run db:migrate:local` / `npm run db:migrate:remote` — run D1 migrations

**Cloudflare bindings (env):**
| Binding | Type | Purpose |
|---|---|---|
| `DB` | D1Database | Main SQLite database |
| `AI` | Ai | Cloudflare AI (used in chat route) |
| `KV` | KVNamespace | Rate limiting, OAuth state |
| `GOOGLE_CLIENT_ID` | secret | OAuth |
| `GOOGLE_CLIENT_SECRET` | secret | OAuth |
| `JWT_SECRET` | secret | JWT signing |
| `ADMIN_API_KEY` | secret | Admin access |
| `FRONTEND_URL` | var | Redirect base (e.g. `https://recost.dev`) |

### Middleware stack (applied globally)

`cors` → `request-id` → `request-logging` → `require-json-content-type` → `require-auth` (on `/projects/*`) → `scan-rate-limit` (on `POST /projects/:id/scans`)

### Auth flow

1. `GET /auth/google` — redirects to Google OAuth with PKCE state stored in KV (5 min TTL)
2. `GET /auth/google/callback` — validates state, exchanges code for Google user, upserts user in D1, signs JWT, redirects to `{FRONTEND_URL}/dashboard?token=...`
3. Frontend stores JWT in `localStorage` as `ecoapi_token`; sends as `Authorization: Bearer <token>`
4. `requireAuth` middleware validates JWT and sets `userId` on context
5. `POST /auth/refresh` — issues a new JWT for the current user

**API keys:**
- Created via `POST /auth/keys` (JWT-gated), name max 64 chars
- Stored as SHA-256 hash in D1 — the full key is returned once at creation and never again
- Listed via `GET /auth/keys` (returns key prefix + metadata, not the hash)
- Revoked via `DELETE /auth/keys/:id`
- Used as `Bearer <key>` on project routes (validated by `api-key-auth` middleware)
- The "Google approach" (encrypted at rest, retrievable) is NOT implemented — keys are hashed only

### Project routes

All project routes require auth (JWT or API key). `assertProjectOwnership` enforces that the requesting user owns the project.

| Method | Path | Description |
|---|---|---|
| `POST` | `/projects` | Create project (hard cap: 20/user, rate cap: 5/hour via KV) |
| `GET` | `/projects` | List projects (admins see all; supports `name`, `sort`, `order`) |
| `GET` | `/projects/:id` | Get project with summary (scan count, endpoint count, cost) |
| `PATCH` | `/projects/:id` | Update project name/description |
| `DELETE` | `/projects/:id` | Delete project |
| `POST` | `/projects/:id/scans` | Submit a scan (rate-limited) |
| `GET` | `/projects/:id/scans` | List scans (sortable, paginated) |
| `GET` | `/projects/:id/scans/latest` | Get most recent scan |
| `GET` | `/projects/:id/scans/:scanId` | Get specific scan |
| `GET` | `/projects/:id/endpoints` | List endpoints (filterable by provider/status/method, sortable) |
| `GET` | `/projects/:id/endpoints/:endpointId` | Get specific endpoint |
| `GET` | `/projects/:id/suggestions` | List suggestions (filterable by type/severity, sortable) |
| `GET` | `/projects/:id/suggestions/:suggestionId` | Get specific suggestion |
| `GET` | `/projects/:id/graph` | API call graph (optional `cluster_by` param) |
| `GET` | `/projects/:id/sustainability` | Sustainability stats |
| `GET` | `/projects/:id/cost` | Cost summary |
| `GET` | `/projects/:id/cost/by-provider` | Cost breakdown by provider (paginated) |
| `GET` | `/projects/:id/cost/by-file` | Cost breakdown by file (paginated) |

### Pagination

All list endpoints accept `?page=1&limit=50` and return:
```json
{ "data": [...], "pagination": { "page", "limit", "total", "totalPages", "hasNext", "hasPrev" } }
```

### Scheduled job (cron)

`handleScheduled` runs a rollup via `rollup-service` — aggregates daily metric rows, prunes old windows.

---

## General conventions

- Always read a file before editing it
- Prefer editing existing files over creating new ones
- Use TanStack Query for all data fetching; query keys follow `['dashboard-{resource}', id?]` pattern
- Use `useQueryClient().getQueryData(key)` to read cached data in layout/breadcrumb without triggering a fetch
- Rate-limit sensitive endpoints in KV; never expose raw secrets or key hashes in API responses
- Keep pages wide and padding tight — the dashboard is a dense data UI, not a marketing page
