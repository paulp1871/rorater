# RoRater

RoRater is a single-page web app where people sign in with their Roblox
account, search for other Roblox players, view their avatars (including a
rotatable 3D model), and rate them. Ratings feed two leaderboards: top-rated
players over the last seven days and the most recently rated.

This repository is the **frontend**. It talks to a companion Express backend
([`rorater-api`](https://github.com/paulp1871/rorater-api)) that owns Roblox OAuth, proxies Roblox's public APIs, and
stores ratings. The split keeps all secrets and third-party calls server-side;
the browser only ever talks to one origin.

> **Backend repo:** _<https://github.com/paulp1871/rorater-api>_

> **Note:** RoRater is an independent learning project and is not affiliated
> with Roblox Corporation.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19 with the React Compiler |
| Language | TypeScript (strict, `tsc` as the build gate) |
| Build/dev | Vite 8 (HMR, dev proxy) |
| Routing | React Router 7 |
| 3D | Three.js (avatar model viewer) |
| Auth | Roblox OAuth 2.0 (handled by the backend; session cookie on the client) |
| Tooling | ESLint, type-only imports, co-located CSS |

## Features

- **Roblox OAuth login** — sign-in is delegated to the backend; the client
  checks session state on load and gates protected routes behind it.
- **User search** — look up Roblox players by username against the backend's
  search endpoint.
- **Profile + 3D avatar** — view a player's avatar, the items they're currently
  wearing, and a rotatable 3D model rendered with Three.js.
- **Rating** — submit, update, or remove a 1–N score for a player (idempotent
  upsert on the backend).
- **Leaderboards** — "Top Rated" (7-day window) and "Recently Rated" tabs.
- **Legal pages** — Terms of Service and Privacy Policy written against
  Roblox's third-party app policies.

## Architecture & engineering notes

- **Single networking layer.** Every `fetch` lives in `src/api/` (`auth`,
  `users`, `ratings`, `leaderboard`) alongside the response types in `types.ts`,
  which mirror the backend contract. Components never call the network
  directly — they import typed functions. This keeps error handling and the API
  surface in one place.
- **Same-origin by design.** The app only ever calls relative `/api/...` paths.
  In development, `vite.config.ts` proxies `/api` to the Express server, so the
  browser stays on one origin and CORS never enters the picture. No backend URL
  is hardcoded in app code.
- **Code-splitting the heavy stuff.** Three.js (~140 KB gzipped) is pulled in
  only by the avatar viewer, so the routes that use it are `React.lazy`-loaded
  and kept out of the main bundle. Most of the app loads without paying for the
  3D dependency.
- **Auth-gated routing.** `App.tsx` resolves the session once on mount and
  renders a loading state until it knows. Protected routes sit behind a
  `RequireAuth` wrapper; unauthenticated nav redirects home with a prompt.
- **React Compiler over manual memoization.** The compiler is enabled, so the
  code is written straightforwardly (no hand-rolled `useMemo`/`useCallback`) and
  leans on the compiler for memoization. Components follow the Rules of React so
  it can do its job.
- **Typed to the backend.** `src/api/types.ts` documents and mirrors each
  endpoint's response shape, including deliberate omissions (e.g. the backend
  strips `raterId` from public profiles so viewers can't see who rated whom).
- **Consistent styling without a framework.** Design tokens (colors, fonts,
  accent) live as CSS variables in `src/styles/`; each component and page keeps
  its own co-located `.css`. No CSS-in-JS or UI library.
- **Accessibility touches.** Tab lists use `role="tab"`/`aria-selected`,
  decorative SVGs are `aria-hidden`, and avatar images degrade gracefully when a
  source is missing.

## Project structure

```
src/
  api/         Typed fetch calls + response types (the only place network code lives)
  components/  Shared UI (AppLayout shell, UserCard, RatingControl, Avatar3DViewer, …)
  context/     Auth context + provider
  pages/       Route-level screens (Home, Search, User, Profile, Leaderboard, Terms, Privacy)
  styles/      Global CSS variables (index.css) and shared app-shell layout (base.css)
  App.tsx      Root component: session gating + route table
  main.tsx     React entry point
```

## Running locally

The frontend needs the `rorater-api` backend running for anything beyond static
rendering.

```sh
npm install
npm run dev      # Vite dev server at http://localhost:5173, proxying /api → :3000
```

Start `rorater-api` (its own `npm run dev`, listening on port 3000) alongside it
for the full stack.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | `tsc -b && vite build` — type-check + production build (the CI gate) |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | Run ESLint |

`npm run build` is the source of truth for type errors and must pass before any
change is committed.
