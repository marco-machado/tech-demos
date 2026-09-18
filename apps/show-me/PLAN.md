# /show-me demo

## Tech
- **Name:** humanlayer `/show-me` skill
- **Source:** https://x.com/rekram11/status/2095557317483782213
- **Upstream:** https://github.com/humanlayer/skills (plugin `show-me`)
- **Why:** Teams are hooked on the skill that explains a topic with the smallest clear visual — strong interactive gallery MVP for a sticky demo.

## Goals
Prove the /show-me format palette in the browser: pick a format, see a focused visual for one canned "session refactor" story, with brief prose beside it.

## MVP scope
- Bun + Vite + React + TypeScript under `apps/show-me/`
- One canned story: a small agent session refactor (e.g. expand skill mention before launch)
- Format switcher covering the skill's main views:
  1. Pseudocode
  2. Call tree
  3. Component tree
  4. File tree
  5. Mermaid (sequence or flow)
  6. Shape-matched diff (component / file / call-tree style)
  7. Focused HTML artifact panel (infographic or mini slide for the same story)
- Clicking a format updates the visual immediately; keep chrome minimal and readable
- Self-contained: `bun install && bun run dev` from `apps/show-me/`
- Vite `base` compatible with path deploy `/show-me/` (root build passes `--base`)
- Credit the upstream skill + bookmark in the UI footer

## Non-goals
- Installing or invoking the real Cursor/Claude skill runtime
- Live LLM / agent integration
- Editing arbitrary user topics (fixed canned story only)
- Touching other apps

## Stack
- Bun, Vite 8, React 19, TypeScript ~6
- Tailwind CSS 4 for chrome
- Mermaid (or lightweight equivalent) for the diagram format
- No upstream npm package required — implement the *formats* as a polished UI inspired by the skill doc

## App path
`apps/show-me/`

## Run
```bash
cd apps/show-me
bun install
bun run dev
```

## Acceptance
- [ ] App runs with Bun
- [ ] All seven formats render for the canned story
- [ ] Format switcher is interactive
- [ ] PR includes ≥1 screenshot of the running app
- [ ] PR includes ≥1 video of the running app
- [ ] Only files under `apps/show-me/` (+ `tracking/seen-bookmarks.json` if marking built)

## Out of scope for this PR
Deploy config (already on Vercel); secrets.
