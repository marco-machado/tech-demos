---
name: project-planning
description: >-
  Use when turning an approved tech pick into apps/<slug>/PLAN.md before
  building a demo in this monorepo.
---

# Project planning

After the owner approves a tech pick (and before coding), write `apps/<kebab-slug>/PLAN.md`.

## PLAN.md must include

1. **Tech** — name, source bookmark URL, one-line why
2. **Goals** — what the demo proves
3. **MVP scope** — concrete UI/flows for a single-user demo
4. **Non-goals** — what to skip
5. **Stack** — Bun + chosen library/framework versions
6. **App path** — `apps/<kebab-slug>/`
7. **Run** — `bun install && bun run dev`
8. **Acceptance** — checklist including:
   - Demo runs locally with Bun
   - PR includes ≥1 screenshot of the running app
   - PR includes ≥1 video of the running app
9. **Out of scope for this PR** — deploy/secrets unless asked

Keep the plan short. Prefer a vertical slice over a kitchen sink.
