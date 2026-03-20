# recost — web

Frontend for the recost dashboard. Built with Vite, React 19, React Router v7, and Tailwind v4.

## Stack

- **Framework:** React 19 + React Router v7
- **Build:** Vite
- **Styling:** Tailwind v4 + shadcn/ui (Radix primitives)
- **Data fetching:** TanStack Query v5
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Toasts:** Sonner

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

## Mock mode

Run the dashboard locally without a backend. Create `web/.env.local`:

```
VITE_DEV_AUTH=true
```

All API requests are intercepted and served from `app/lib/mock-data.ts`. This file is never committed and the env var is absent in production, so the real API is used when deployed.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `https://api.recost.dev` | Backend base URL |
| `VITE_DEV_AUTH` | — | Set to `true` to enable mock mode |

## Project structure

```
src/
├── pages/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx   — shared layout: sidebar, navbar, breadcrumb
│   │   ├── GettingStarted.tsx    — /dashboard
│   │   ├── Projects.tsx          — /dashboard/projects
│   │   ├── ProjectDetail.tsx     — /dashboard/projects/:id
│   │   └── Account.tsx           — /dashboard/account
│   └── ...                       — landing, login
├── lib/
│   ├── api-client.ts             — typed fetch wrapper + mock intercept layer
│   ├── auth-context.tsx          — JWT auth, stores token in localStorage
│   ├── theme-context.tsx         — theme provider
│   └── themes.ts                 — theme definitions
└── components/                   — shared UI components
```

## Auth

The app uses Google OAuth via the ReCost API. After login, a JWT is stored in `localStorage` as `ecoapi_token` and sent as `Authorization: Bearer <token>` on every request. On 401, the token is cleared and the user is redirected to `/login`.
