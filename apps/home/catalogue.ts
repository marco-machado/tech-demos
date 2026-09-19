import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Demo } from "./src/types.ts";

const known: Record<string, Partial<Demo>> = {
  "cult-ui": {
    title: "Cult UI",
    description: "Six components. A little more character.",
    category: "Components",
    image: "cult-ui.webp",
  },
  "motion-panels": {
    title: "Motion Panels",
    description: "Drag a seam. Fold a pane. Feel the spring.",
    category: "Layout",
    image: "motion-panels.webp",
  },
  "pr-lens": {
    title: "PR Lens",
    description: "Follow the shape of a change.",
    category: "Visualization",
    image: "pr-lens.webp",
  },
  "show-me": {
    title: "Show Me",
    description: "One idea. Seven ways to see it.",
    category: "Visualization",
    image: "show-me.webp",
  },
  "ui-effects": {
    title: "UI Effects",
    description: "Metal, motion, and softer edges.",
    category: "Effects",
    image: "ui-effects.webp",
  },
};

/** Folders are the source of truth. New apps need no homepage source changes. */
export async function discoverDemos(repoRoot: string): Promise<Demo[]> {
  let built: { slug: string; date?: string; repo?: string }[] = [];
  try {
    built =
      JSON.parse(
        await readFile(join(repoRoot, "tracking/seen-bookmarks.json"), "utf8"),
      ).built ?? [];
  } catch {
    /* A standalone app can still discover siblings. */
  }
  const entries = await readdir(join(repoRoot, "apps"), {
    withFileTypes: true,
  });
  const demos = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && entry.name !== "home")
      .map(async (entry): Promise<Demo | null> => {
        const slug = entry.name;
        try {
          const pkg = JSON.parse(
            await readFile(
              join(repoRoot, "apps", slug, "package.json"),
              "utf8",
            ),
          );
          const record = built.find((item) => item.slug === slug);
          const meta = pkg.demo ?? {};
          const details = known[slug] ?? {};
          return {
            slug,
            title:
              meta.title ??
              details.title ??
              slug
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
            description:
              meta.description ??
              details.description ??
              pkg.description ??
              "A new experiment. Open it and take a look.",
            category: meta.category ?? details.category ?? "Experiment",
            image:
              meta.image ??
              (details.image
                ? `/assets/previews/${details.image}`
                : "/assets/bumper-red.webp"),
            date: meta.date ?? record?.date ?? "",
            href: `/${slug}/`,
            source: meta.source ?? record?.repo,
          } satisfies Demo;
        } catch {
          return null;
        }
      }),
  );
  return demos
    .filter((demo): demo is Demo => demo !== null)
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
    );
}
