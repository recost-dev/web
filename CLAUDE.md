# EcoAPI — Documentation Site

React + Vite documentation and landing page for EcoAPI, deployed at https://ecoapi.dev.

## Tech Stack

- **React 18** + **React Router v7**
- **Vite** — build tool
- **Tailwind CSS v4**, **Radix UI**, **MUI**
- **Cloudflare Pages** — hosting

## Setup

```bash
npm install && npm run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server (Vite) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
  App.tsx                   # Root component
  main.tsx                  # Entry point
  app/
    App.tsx
    routes.ts               # Route definitions
    layout.tsx
    layout/
      LandingLayout.tsx
    components/
      landing-page.tsx
      navbar.tsx
      particles.tsx
      animated-tree.tsx
      ui/                   # Radix-based UI primitives (shadcn)
    pages/
      About.tsx
      Docs.tsx
      Extension.tsx
    theme-context.tsx
    themes.ts
public/
  landingpage.png
  favicon.svg
  dashboardcaptures/        # Dashboard screenshot assets
  _redirects                # Cloudflare Pages SPA redirect rule
index.html
vite.config.ts
package.json
tsconfig.json
```
