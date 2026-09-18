# Show Me

Interactive gallery of the [humanlayer `/show-me`](https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md) visual formats. One canned story — expand a skill mention before launching an agent — viewed seven ways.

Inspired by [the announcement bookmark](https://x.com/rekram11/status/2095557317483782213). No live LLM; the formats are the demo.

## Run

```bash
cd apps/show-me
bun install
bun run dev
```

Open the printed local URL (Vite, usually `http://localhost:5176`).

## What to try

- Click a format in the left rail (or press **1–7**) — the visual updates immediately
- Read the short prose beside each view
- On **Shape-matched diff**, switch Call tree / Component / File — same refactor, different surrounding shape
- Open **HTML artifact** for the infographic slide of the pipeline

## Deploy path

Root `bun run build` passes `--base /show-me/`. Local `bun run dev` uses `/`.
