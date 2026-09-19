import { describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PinballSimulation } from "../src/game/simulation";
import { discoverDemos } from "../catalogue";

describe("pinball simulation", () => {
  test("a launch leaves the lane and reaches all five targets at mobile and desktop widths", () => {
    for (const scale of [1, 2]) {
      const sim = new PinballSimulation();
      sim.resize(scale);
      const touched = new Set<number>();
      sim.onHit = (index) => touched.add(index);
      expect(sim.launch()).toBe(true);
      expect(sim.launch()).toBe(false);
      for (let frame = 0; frame < 1200; frame++) {
        sim.left = sim.right = frame % 24 < 12;
        sim.update(1 / 60);
        expect(Number.isFinite(sim.ball.x + sim.ball.y)).toBe(true);
      }
      expect(touched.size).toBe(5);
    }
  });
  test("opening the archive freezes physics and rejects launch", () => {
    const sim = new PinballSimulation();
    sim.launch();
    sim.update(0.05);
    const before = { ...sim.ball };
    sim.paused = true;
    for (let i = 0; i < 100; i++) sim.update(0.05);
    expect(sim.ball).toEqual(before);
    sim.reset();
    expect(sim.launch()).toBe(false);
  });
  test("fixed timesteps give the same trajectory at 30 and 120 frames per second", () => {
    const a = new PinballSimulation(),
      b = new PinballSimulation();
    a.launch();
    b.launch();
    for (let i = 0; i < 90; i++) a.update(1 / 30);
    for (let i = 0; i < 360; i++) b.update(1 / 120);
    expect(a.ball.x).toBeCloseTo(b.ball.x, 5);
    expect(a.ball.y).toBeCloseTo(b.ball.y, 5);
  });
  test("a drained ball resets to a launchable state exactly once", () => {
    const sim = new PinballSimulation();
    let drains = 0;
    sim.onDrain = () => drains++;
    sim.active = true;
    sim.ball = { x: 360, y: 999, vx: 0, vy: 200 };
    sim.update(0.05);
    expect(drains).toBe(1);
    expect(sim.active).toBe(false);
    expect(sim.launch()).toBe(true);
  });
});

test("catalogue discovers thirty apps, ignores non-app folders and home, and admits the next demo without source edits", async () => {
  const root = await mkdtemp(join(tmpdir(), "beyond-catalogue-"));
  try {
    await mkdir(join(root, "apps"), { recursive: true });
    await mkdir(join(root, "apps", "assets"));
    await mkdir(join(root, "apps", "home"));
    await writeFile(join(root, "apps", "home", "package.json"), "{}");
    for (let index = 0; index < 30; index++) {
      const slug = `experiment-${String(index).padStart(2, "0")}`;
      await mkdir(join(root, "apps", slug));
      await writeFile(
        join(root, "apps", slug, "package.json"),
        JSON.stringify({
          name: slug,
          demo: {
            title: `Experiment ${index}`,
            date: "2026-09-18",
            category: "Motion",
          },
        }),
      );
    }
    const initial = await discoverDemos(root);
    expect(initial).toHaveLength(30);
    expect(initial.every((demo) => demo.category === "Motion")).toBe(true);
    await mkdir(join(root, "apps", "new-arrival"));
    await writeFile(
      join(root, "apps", "new-arrival", "package.json"),
      JSON.stringify({ name: "new-arrival", demo: { date: "2026-09-19" } }),
    );
    const updated = await discoverDemos(root);
    expect(updated).toHaveLength(31);
    expect(updated[0].title).toBe("New Arrival");
    expect(updated[0].href).toBe("/new-arrival/");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
