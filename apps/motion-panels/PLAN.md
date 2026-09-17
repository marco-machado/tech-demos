# Motion Panels demo

## Tech
- **Name:** Motion Panels (`motion-panels` / `letstri/motion-panels`)
- **Source:** https://x.com/letstri/status/2097596925189017695
- **Why:** Animated resizable panels (Motion + react-resizable-panels-like API); clear single-user visual MVP.

## Goals
Prove Motion Panels feels better than plain resizable panels: drag resize, collapse/expand with animation (incl. rubber banding if available).

## MVP scope
- Bun + Vite + React + TypeScript app under `apps/motion-panels/`
- IDE-style layout: left sidebar | center editor | right preview (or similar 3-panel)
- Drag handles between panels; collapse/expand toggles
- Light polish so screenshot/video look intentional (labels, subtle theme)
- Self-contained: `bun install && bun run dev` from `apps/motion-panels/`

## Non-goals
- Auth, persistence, multi-user
- Cloudflare deploy wiring / secrets
- Touching other apps or repo root beyond this folder

## Stack
- Bun 1.4, Vite 8, React 19, TypeScript 6
- `motion-panels` 0.5.2
- `motion` 13.4 (peer of motion-panels)
- Tailwind CSS 4 for chrome only; panels stay unstyled from the library

## App path
`apps/motion-panels/`

## Run
```bash
cd apps/motion-panels
bun install
bun run dev
```

## Acceptance
- [x] App runs with Bun
- [x] Panels resize and animate collapse/expand
- [x] PR includes ≥1 screenshot of the running app
- [x] PR includes ≥1 video of the running app
- [x] Only files under `apps/motion-panels/` changed (plus tracking if needed)

## Out of scope for this PR
Deploy/secrets unless asked.
