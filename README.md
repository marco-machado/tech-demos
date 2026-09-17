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
skills/project-planning/
tracking/seen-bookmarks.json
```

Never spin a new GitHub repo per demo — keep everything here.
