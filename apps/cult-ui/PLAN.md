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

## Polish pass (v2) — visual craft only

Owner feedback on the live gallery: "looks really shitty." Feature set is frozen at the six pieces above; this pass fixes presentation.

### Diagnosis of v1
- Chips lived in the sticky header and wrapped to two rows on mobile, covering the hero
- Stage was a 520px empty box with the piece floating in it; title and hint were misaligned; no transition between pieces
- Stage surface barely separated from the page; warm browns fought the vendored `neutral-*` greys (muddy)
- Shift Card mixed a brown header, dark body, cream sheet and heavy black-bordered white buttons; the hover thumbnail overlapped the sheet and its dashed frame was offset
- Family Button kept upstream's yellow outline + cyan plus; Texture Card's indigo CTA was the only cool accent on the page
- Dock floated in the void with no context

### What changes
- **Tokens:** stone-based palette so vendored greys sit naturally; lighter, less saturated `--quiet`; hairline `--line` at 8% / 14%; ember + glaze kept as the two accents; `--paper`/`--ink` for the Shift sheet
- **Type:** Inter for UI, Newsreader for display, IBM Plex Mono for labels; tighter hero scale; mono eyebrows at 11px / 0.18em
- **Chrome:** minimal header (mark + links); compact hero with fact pills; stage frame with concentric radii (24 → 16 → 12), segmented piece nav with a spring `layoutId` indicator, stage header (index / title / interaction hint pill), spotlight + dot-grid + grain canvas, footer with source file + prev/next (Cult icon buttons)
- **Motion:** ease-out entrances (`[0.16, 1, 0.3, 1]`, ~300ms), quick ease-in exits (~140ms), staggered hero, `MotionConfig reducedMotion="user"`
- **Navigation:** ← / → keys and `#piece` hash sync (presentation plumbing, not a new feature)
- **Pieces:** Shift Card sheet re-cut as paper + ink with aligned thumbnail/frame; Texture Button staged as a spec sheet (variant / size / icon rows + live readout); Texture Card inputs with inset shadow + ember focus ring, primary CTA; Expandable on tokens with ember pill and chevron affordance; Family Button glaze picker (6 swatches, preview) with ember plus; Dock inside a mini desktop frame
- **Vendored tweaks (theme only):** `family-button.tsx` outline/plus/close colors; Dock container radius/blur via `className`

### Acceptance (v2)
- [ ] All six pieces still render and animate; no feature removed
- [ ] No two-row chip wrap at 390px; header is a single row
- [ ] Every stage transition and hover uses ease-out in / ease-in out
- [ ] `bun run build` in the app and root `bun run build` both pass; `dist/cult-ui/` emitted
- [ ] PR includes ≥1 screenshot and ≥1 video of the polished app
