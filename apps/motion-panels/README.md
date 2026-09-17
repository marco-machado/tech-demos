# Motion Panels demo

IDE-style workspace that proves [motion-panels](https://github.com/letstri/motion-panels): drag-resize, animated collapse/expand, and rubber-band overshoot.

## Run

```bash
cd apps/motion-panels
bun install
bun run dev
```

Open the printed local URL (Vite, usually `http://localhost:5173`).

## What to try

- Drag the seams between Files, Editor, Preview, and Console
- Click **Files**, **Preview**, or **Console** in the title bar to fold a pane
- Drag a sized pane below half of its min size to collapse it
- Drag past min/max and release to see rubber-band overshoot
- Double-click a separator to reset that pane
- Press Enter on a focused separator to toggle collapse
