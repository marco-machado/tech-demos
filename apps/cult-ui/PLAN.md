# Cult UI demo

## Tech
- **Name:** Cult UI (animated shadcn-compatible components)
- **Source:** Notion Inbox — https://app.notion.com/37189ff326a1816db52fcacf29a21641
- **Upstream:** https://cult-ui.com · https://github.com/nolly-studio/cult-ui (registry / copy-paste MIT components)
- **Why:** Free open-source motion-rich components that drop into shadcn/ui projects — strong visual sticky demo distinct from Libraries.dev effects.

## Goals
Prove a handful of Cult UI–style animated components in a self-contained Bun + Vite gallery: switch cards, hover interactions, and at least one texture/motion piece.

## MVP scope
- Bun + Vite + React + TypeScript under `apps/cult-ui/`
- Install via Cult UI / shadcn registry CLI where practical (`pnpm dlx cult-ui@latest add …` adapted for Bun), or vendored component source under `apps/cult-ui/src/components/` if registry install is awkward in the monorepo app
- Gallery of **4–6** free open-source Cult UI components (not Cult Pro paid blocks), e.g. Shift Card, texture button/card, one hover/expand interaction, one decorative motion piece
- Dark stage, chip switcher or scroll sections, credit footer linking cult-ui.com + Inbox source
- Self-contained: `bun install && bun run dev` from `apps/cult-ui/`
- Vite `base` compatible with path deploy `/cult-ui/` (root build passes `--base`)

## Non-goals
- Cult Pro / paid marketing blocks
- Full shadcn design-system setup for the whole monorepo
- Touching other apps

## Stack
- Bun, Vite 8, React 19, TypeScript ~6
- Tailwind CSS 4
- `motion` (Framer Motion) as required by Cult components
- Cult UI registry components (source owned in-app)

## App path
`apps/cult-ui/`

## Run
```bash
cd apps/cult-ui
bun install
bun run dev
```

## Acceptance
- [ ] App runs with Bun
- [ ] ≥4 Cult UI components render and animate interactively
- [ ] PR includes ≥1 screenshot of the running app
- [ ] PR includes ≥1 video of the running app
- [ ] Only files under `apps/cult-ui/` (+ `tracking/seen-bookmarks.json` if marking built)

## Out of scope for this PR
Deploy config (already on Vercel); secrets.
