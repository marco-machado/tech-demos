# tech-demos

Sticky monorepo for weekday X-bookmark tech demos.

## Flow

1. Scout one bookmarked technology (weekday routine)
2. Approve / tweak / skip in chat
3. Plan with `skills/project-planning/` → `apps/<slug>/PLAN.md`
4. Cursor cloud agent builds under `apps/<slug>/` (Bun; screenshot + video on the PR)

## Layout

```
AGENTS.md
README.md
apps/<slug>/
scripts/build-apps.ts
skills/project-planning/
tracking/seen-bookmarks.json
vercel.json
```

## Deploy (Vercel)

One Vercel project for the whole repo. Each demo is a path:

- `/` — index of apps
- `/motion-panels/` — Motion Panels demo
- `/<slug>/` — future demos

Production builds run `bun run build`, which installs and Vite-builds every `apps/<slug>/` into `dist/<slug>/`.

Never spin a new GitHub or Vercel project per demo — keep everything here.
