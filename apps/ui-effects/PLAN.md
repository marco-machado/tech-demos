# Libraries.dev UI effects gallery

## Tech
- **Name:** Libraries.dev UI effects (Jakub Antalik)
- **Source post:** https://x.com/Jakubantalik/status/2095551141367173608
- **Hub:** https://libraries.dev
- **Why:** Five free MIT React effect libs for agent-built UIs; strong visual Product Demos / Design pick.

## Goals
Ship a polished Bun + Vite gallery that demos **all five** packages in one page at `/ui-effects/`.

## MVP scope
Include all five npm packages:
1. `border-beam` — Border Beam
2. `thinking-orbs` — Thinking Orbs
3. `liquid-gooey` — Gooey
4. `metal-fx` — Liquid Metal
5. `img-fx` — Image generation (peer: `three`)

- Dark, intentional layout with a section (or card) per library
- Interactive playground controls where props are simple (size/color/state toggles)
- Self-contained: `bun install && bun run dev` from `apps/ui-effects/`
- Vite base compatible with `/ui-effects/` (root build passes `--base`)

## Non-goals
- Pro/Studio features
- SwiftUI / React Native ports
- Touching other apps

## Stack
- Bun 1.4, Vite 8, React 19, TypeScript 6
- `border-beam` 1.3, `thinking-orbs` 0.3, `liquid-gooey` 0.2, `metal-fx` 2.0, `img-fx` 0.5
- `three` (peer of img-fx)
- Tailwind CSS 4 for chrome only

## App path
`apps/ui-effects/`

## Run
```bash
cd apps/ui-effects
bun install
bun run dev
```

## Acceptance
- [ ] All five libraries render visibly
- [ ] App runs with Bun
- [ ] Looks good enough for screenshot/video
- [ ] PR includes ≥1 screenshot AND ≥1 video
- [ ] Only `apps/ui-effects/` (+ tracking if marking built)

## Out of scope for this PR
Deploy config (Vercel already wired).
