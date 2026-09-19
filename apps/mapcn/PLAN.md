# MapCN demo

## Tech
- **Name:** MapCN (MapLibre map components for React)
- **Source:** Notion Inbox — https://app.notion.com/p/30e89ff326a181c486bcd9aa7b30ba15
- **Upstream:** https://mapcn.dev · https://github.com/AnmolSaini16/mapcn (MIT)
- **Why:** Copy-paste MapLibre components (markers, routes, controls, theme-aware Carto tiles) that drop into a Tailwind / shadcn stack — a visual sticky demo, not a bare iframe embed.

## Goals
Prove MapCN’s real component API in a self-contained Bun + Vite playground: pins with popups, polylines with progress, map controls, and light/dark tile switching.

## MVP scope
- Bun + Vite + React + TypeScript under `apps/mapcn/`
- Vendored MIT MapCN registry source (`src/registry/map.tsx` → `src/components/ui/map.tsx`) — official install is `bunx --bun shadcn@latest add @mapcn/map`; this environment has no shadcn project, so we vendor the same file the registry ships
- Interactive gallery of **4** official MapCN pieces (plus a fifth world-arcs scene):
  1. Pins — `MapMarker` + `MarkerContent` / `MarkerLabel` / `MarkerTooltip` / `MarkerPopup`
  2. Route — `MapRoute` + `RouteProgress` + `RouteMarker`
  3. Controls — `MapControls` (zoom, compass, locate, fullscreen) + controlled `viewport`
  4. Tiles — theme-aware Carto Positron / Dark Matter, plus optional OpenFreeMap styles
  5. Arcs — `MapArc` + city markers (official API, not a fake wrapper)
- Dark stage named Meridian, scene switcher, credit footer linking mapcn.dev + Inbox
- Self-contained: `bun install && bun run dev` from `apps/mapcn/`
- Vite `base` compatible with path deploy `/mapcn/` (root build passes `--base`)

## Non-goals
- Full shadcn design-system setup for the monorepo
- Live OSRM routing (static official demo coordinates instead)
- Touching other apps / new Vercel project / API keys

## Stack
- Bun, Vite 8, React 19, TypeScript ~6
- Tailwind CSS 4
- `maplibre-gl` ^6 (MapCN peer)
- `lucide-react`, `clsx`, `tailwind-merge`, `motion`
- MapCN registry component (source owned in-app)
- Default tiles: CARTO Positron / Dark Matter (no key). Non-commercial demo; swap via `styles` if needed.

## App path
`apps/mapcn/`

## Run
```bash
cd apps/mapcn
bun install
bun run dev
```

## Acceptance
- [x] App runs with Bun
- [x] Markers, routes/polylines, controls, and theme-aware tiles are interactive
- [x] PR includes ≥1 screenshot of the running app
- [x] PR includes ≥1 video of the running app
- [x] Only files under `apps/mapcn/` (+ `tracking/seen-bookmarks.json` if marking built)

## Out of scope for this PR
Deploy config (already on Vercel); secrets.

## Vendor notes
Official docs: https://www.mapcn.dev/docs/installation · API: https://www.mapcn.dev/docs/api-reference

Install path we could not run here (`bunx shadcn add @mapcn/map`) copies https://mapcn.dev/r/map.json into `components/ui/map.tsx`. We vendor that MIT file and keep the public API (`Map`, `MapMarker`, `MapRoute`, `MapControls`, `MapArc`, `useMap`, …). Small adaptations: `cn` import is relative (`../../lib/utils`) instead of `@/lib/utils`, `React.ReactNode` → `ReactNode` for `verbatimModuleSyntax`, and MapLibre worker URL via `import.meta.env.BASE_URL` so `/mapcn/` serving works without unpkg.
