# Beyond Localhost — Launch Arcade

The public front door for this monorepo: a playable pinball table with five featured experiments and a searchable archive. Built with Three.js **WebGPU**, React, TypeScript, Motion, and Bun. There is no WebGL renderer fallback. Browsers without WebGPU retain the full accessible catalogue and direct demo links.

## Run

```sh
bun install
bun run dev
```

Local preview is normally on port 5180. The five existing demo paths proxy to their public versions during development. The root `bun run build` produces the homepage at `/` and all demos at their existing `/<slug>/` paths in `dist/`.

## Controls

- **Space** launches a ball. **Left/Right** or **A/D** operate the flippers. **R** resets.
- Touch controls allow simultaneous flipper presses.
- Click a numbered plate, use the sidebar, or hit a target to select an experiment. **Open demo** explicitly navigates to it.
- **All demos** pauses gameplay and opens the archive. Search, category, and name/date sorting are available; Escape closes the drawer.
- Light/dark preference is saved locally. Sound is off until enabled. Decorative motion respects reduced-motion preferences.

## Adding demos

The homepage discovers sibling app directories containing `package.json`, excluding `home`. Tracking dates determine the five newest featured entries. Existing demos have curated metadata in `catalogue.ts`. New apps require no homepage source change: names, links, and a fallback thumbnail are derived automatically.

For richer content, optionally add a `demo` object to the new app's package.json:

```json
{
  "demo": {
    "title": "Your Demo",
    "description": "A short invitation to explore.",
    "category": "Motion",
    "date": "2026-09-19",
    "image": "/your-demo/preview.webp",
    "source": "https://github.com/your-project"
  }
}
```

No sample archive entries ship to production. The thirty-entry scale case is exercised with temporary test fixtures.

## Structure and validation

`src/game/simulation.ts` owns fixed-step planar physics; `renderer.ts` owns the WebGPU scene and GPU resource lifetime. React owns navigation, input, accessibility, and theme state. Generated artwork is bundled locally as textures, alongside real 3D geometry for the ball, rails, hinges, and supports.

Run `bun test` and `bun run build`. Visual verification and the recording are in `validation/`; design review is in `design-qa.md`.
