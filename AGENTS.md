# Agent instructions — tech-demos

Sticky monorepo for weekday X-bookmark tech demos. One repo forever; never create a new GitHub repository per demo.

## Layout

- `apps/<kebab-slug>/` — one self-contained demo app per approved pick
- `skills/project-planning/` — plan before building; write `apps/<slug>/PLAN.md`
- `tracking/seen-bookmarks.json` — proposed / built / skipped bookmark ids
- `scripts/build-apps.ts` — builds every app into `dist/<slug>/` for Vercel path-per-app hosting
- `vercel.json` — one Vercel project; URLs like `/motion-panels/`

## Rules for cloud agents

1. Only add or update files under `apps/<slug>/` for the demo you were launched for. You may also update `tracking/seen-bookmarks.json` when recording bookmark state.
2. Each app must be self-contained: `bun install && bun run dev` from `apps/<slug>/`.
3. Use **Bun** (not npm/yarn/pnpm) unless the owner overrides.
4. Before coding, follow `skills/project-planning/` and leave an up-to-date `PLAN.md` in the app folder.
5. Open **one** PR. Attach **both** at least one screenshot **and** at least one video of the running app in the PR (validation artifacts — not optional).
6. Do not create new GitHub repositories. Do not touch other apps' directories.
7. **Deploy:** one Vercel project for this monorepo (path per `apps/<slug>/`). Root `bun run build` must keep working. Prefer Vite `base` of `/<slug>/` (the root build script passes `--base`). Do not invent secrets or create a new Vercel project per demo.
