# PR Lens playground

Interactive canvas for [PR Lens](https://prlens.dev): schema-checked graph JSON in, animated architecture and data-flow SVGs out. No GitHub App.

Sample document is the published Postmark batch-send refactor (`@coldtea/pr-lens-schema/examples`), rendered with `@coldtea/pr-lens-renderer`.

## Run

```bash
cd apps/pr-lens
bun install
bun run dev
```

Open the printed local URL (Vite, usually `http://localhost:5174`).

## What to try

- Switch **Architecture** / **Data flow**, then drill into blast radius, the new batch path, or the retired path
- Press **Play** (or **W**) to walk the change; **Prev** / **Next** steps one card at a time
- Drag to pan, scroll to zoom, **Fit** to reset the camera
- Toggle **Dark** / **Light** — the renderer paints a separate SVG per theme
- Open **JSON** to see the lanes, nodes, edges and walkthrough ids the pictures are drawn from
- Switch the sample to **Health check** for the smallest valid graph

## Deploy path

Root `bun run build` passes `--base /pr-lens/`. Local `bun run dev` uses `/`.
