# Repository Guidelines

This is the **rorater** frontend: a React + TypeScript + Vite single-page app. Its current purpose is a thin UI to exercise and verify the `rorater-api` backend (Roblox user search). Keep it minimal until product features are defined.

## Project Structure & Module Organization

- `src/main.tsx` mounts the React root into `index.html`.
- `src/App.tsx` is the page component (search bar + results).
- `src/api.ts` owns `fetch` calls to the backend and the response types. All network access lives here, not in components.
- `src/App.css` styles the app; `src/index.css` holds global styles and CSS variables (colors, fonts, `--accent`, etc.). Reuse those variables instead of hardcoding values.
- `src/assets/` holds images. `public/` is served as-is at the site root.

## Build, Test, and Development Commands

- `npm run dev` starts the Vite dev server (default `http://localhost:5173`) with HMR.
- `npm run build` runs `tsc -b && vite build`; this is the type-check + production build gate.
- `npm run preview` serves the built `dist/` locally.
- `npm run lint` runs ESLint.

There is no test framework configured yet.

## Backend Connection

`vite.config.ts` proxies `/api` to `http://localhost:3000` (the `rorater-api` Express server). Always call the backend with relative `/api/...` paths so the browser stays on one origin and avoids CORS. Do not hardcode `http://localhost:3000` in app code.

To run the full stack, start `rorater-api` (`npm run dev` in that repo) **and** this app's dev server.

The search endpoint is `GET /api/roblox/users/search?keyword=<string>`, returning `{ users: [...] }`. Keep the types in `src/api.ts` in sync with that response shape.

## Coding Style & Naming Conventions

Match the existing files:

- 2-space indentation, single quotes, **no semicolons**.
- TypeScript ES modules. Keep type-only imports type-only: `import type { RobloxUser } from './api'`.
- Components are `PascalCase`, functions and variables `camelCase`.
- The **React Compiler is enabled** (see `vite.config.ts`). Do not add manual `useMemo`/`useCallback`/`React.memo` for performance; write straightforward code and let the compiler optimize. Follow the Rules of React so the compiler can do its job.

## Validation Before Committing

Run before committing:

```sh
npm run build
npm run lint
```

Both must pass. `npm run build` is the source of truth for type errors.

## Pull Request Guidelines

Use short imperative commit messages, e.g. `Add user search results list`. PRs should summarize the change, note any new/changed components or API calls, and confirm `npm run build` passes.
