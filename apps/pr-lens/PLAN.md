# PR Lens demo

## Tech
- **Name:** PR Lens (`coldteadotai/pr-lens` / `@coldtea/pr-lens-renderer`)
- **Source:** https://x.com/OhansEmmanuel/status/2096996689680978148
- **Why:** Animated architecture + data-flow diagrams for PRs (not Mermaid); strong visual single-user MVP.

## Goals
Prove PR Lens can render an interactive walkthrough in the browser from a schema-checked graph JSON — pan/zoom/play without installing a GitHub App.

## MVP scope
- Bun + Vite + React + TypeScript under `apps/pr-lens/`
- Use the published renderer/schema packages from the pr-lens monorepo (prefer npm `@coldtea/pr-lens-renderer` + schema; vendor a minimal sample graph if needed)
- Sample PR graph(s) with architecture + data-flow views
- UI: canvas/SVG area, play/step walkthrough controls, optional theme toggle
- Self-contained: `bun install && bun run dev` from `apps/pr-lens/`
- Vite `base` compatible with path deploy `/pr-lens/` (root build passes `--base /pr-lens/`)

## Non-goals
- GitHub App / Action / real PR webhook
- Owner's model API keys
- Touching other apps

## Stack
- Bun 1.4, Vite 8, React 19, TypeScript 6
- `@coldtea/pr-lens-renderer` 0.2.5
- `@coldtea/pr-lens-schema` 0.3.0
- Tailwind CSS 4 for chrome only; diagrams come from the renderer SVG

## App path
`apps/pr-lens/`

## Run
```bash
cd apps/pr-lens
bun install
bun run dev
```

## Acceptance
- [x] App runs with Bun
- [x] Architecture and/or data-flow diagram renders and animates from sample JSON
- [x] Basic play/step or pan/zoom interaction
- [x] PR includes ≥1 screenshot of the running app
- [x] PR includes ≥1 video of the running app
- [x] Only files under `apps/pr-lens/` (+ tracking if marking built)

## Out of scope for this PR
Deploy config (already on Vercel); secrets.
