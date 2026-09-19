# Beyond Localhost — Launch Arcade

## Tech and purpose
Public homepage for the existing Beyond Localhost collection, based on the approved desktop pinball design and mobile table/archive mockups in this task. This is a homepage redesign, not a new bookmark pick.

## Goals
- Make discovering real demos playful through a working pinball table.
- Keep five replaceable featured slots while automatically discovering new app folders in the full archive.
- Preserve direct, accessible navigation without requiring gameplay.
- Support desktop keyboard, mobile touch, light/dark themes, tasteful animation, and reduced motion.

## MVP scope
One responsive homepage: playable ball and flippers; impact-driven preview selection; explicit demo launch; searchable, category-filtered, sorted archive; pause while browsing or hidden; persistent theme and optional sound. Only real demos ship; the 30-item study remains validation-only data.

## Stack and app path
Bun, React 19, TypeScript, Vite 8, Three.js with WebGPURenderer (explicit owner requirement; no WebGL fallback), a separate deterministic pinball simulation, and Motion for DOM transitions. App path: `apps/home/`. Generated artwork is bundled locally as textures. Real 3D ball/rails/mechanisms use depth, lighting, and reflections. Resolved dependency versions are recorded in bun.lock.

## Run
`bun install && bun run dev` inside `apps/home/`. Root `bun run build` builds the demos and homepage into the existing Vercel output. Homepage integration requires updating the shared build script; existing demo source directories stay unchanged.

## Acceptance
- [x] Runs locally with Bun; root build passes.
- [x] Existing demo routes remain available.
- [x] Desktop and mobile match the approved direction with light and dark modes.
- [x] Real ball physics, keyboard/touch flippers, launch, reset, pause, and preview interactions work.
- [x] Archive search/category/sort/empty state work, including a 30-entry fixture.
- [x] New app folders enter the catalogue automatically.
- [x] Keyboard focus, resizing and theme persistence verified; reduced-motion handling reviewed in code (OS/device test limitations in design-qa.md).
- [x] Screenshot and video of the running app saved for the implementation PR.
- [x] Visual QA report includes comparison evidence and any remaining limitations.

## Non-goals / out of scope
No sign-in, scores/leaderboard, backend, invented demo content, new GitHub/Vercel projects, secrets, or production deployment. Create a reviewable PR and running local preview.
