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
- Vendored MIT Cult UI registry source under `apps/cult-ui/src/components/ui/` (cult-ui.com registry is bot-challenged from this environment; source matches nolly-studio/cult-ui)
- Gallery of **6** free open-source Cult UI components (not Cult Pro paid blocks):
  1. Shift Card — hover reveals share detail
  2. Texture Button — beveled variants
  3. Texture Card — nested stone borders
  4. Expandable — click-to-grow meeting card
  5. Family Button — plus expands a glaze picker
  6. Dock — magnification + bounce
- Dark stage named Kiln, chip switcher, credit footer linking cult-ui.com + Inbox source
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
- `class-variance-authority`, `@radix-ui/react-slot`, `lucide-react`, `react-use-measure`

## App path
`apps/cult-ui/`

## Run
```bash
cd apps/cult-ui
bun install
bun run dev
```

## Acceptance
- [x] App runs with Bun
- [x] ≥4 Cult UI components render and animate interactively
- [x] PR includes ≥1 screenshot of the running app
- [x] PR includes ≥1 video of the running app
- [x] Only files under `apps/cult-ui/` (+ `tracking/seen-bookmarks.json` if marking built)

## Out of scope for this PR
Deploy config (already on Vercel); secrets.
