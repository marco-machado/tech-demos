# Meridian — MapCN playground

Dark-stage demo of MIT [MapCN](https://mapcn.dev) map components, vendored from [AnmolSaini16/mapcn](https://github.com/AnmolSaini16/mapcn). Source pick: [Notion Inbox](https://app.notion.com/p/30e89ff326a181c486bcd9aa7b30ba15).

1. Pins — `MapMarker` + labels / tooltips / popups
2. Route — `MapRoute` + `RouteProgress` + `RouteMarker`
3. Controls — `MapControls` + controlled viewport
4. Tiles — theme-aware Carto, optional OpenFreeMap styles
5. Arcs — `MapArc` city hops

## Run

```bash
cd apps/mapcn
bun install
bun run dev
```

Open the printed local URL (Vite, usually `http://localhost:5178`). Production path is `/mapcn/`.

## What to try

- **Pins** — click a Manhattan pin or a row; popup + fly-to
- **Route** — scrub or play the Embarcadero run
- **Controls** — zoom / compass / locate / fullscreen; jump to Paris lookats
- **Tiles** — flip Dark / Light (Carto Dark Matter ↔ Positron) or switch OpenFreeMap
- **Arcs** — hover or click a world hop

Switch scenes with the segmented nav, the ← / → keys, or a `#scene` hash (e.g. `/mapcn/#route`).
