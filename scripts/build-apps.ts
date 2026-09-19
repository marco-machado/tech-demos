import { readdir, mkdir, access } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";

const root = join(import.meta.dir, "..");
const appsDir = join(root, "apps");
const distDir = join(root, "dist");

function run(cmd: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: "inherit", env: process.env });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`)),
    );
  });
}

async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

await mkdir(distDir, { recursive: true });

const entries = await readdir(appsDir, { withFileTypes: true });
const apps: string[] = [];

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const slug = entry.name;
  if (slug === "home") continue;
  const appPath = join(appsDir, slug);
  if (!(await exists(join(appPath, "package.json")))) continue;
  apps.push(slug);

  console.log(`\n=== Building ${slug} ===`);
  await run("bun", ["install"], appPath);
  const outDir = join(distDir, slug);
  await run(
    "bun",
    ["x", "vite", "build", "--base", `/${slug}/`, "--outDir", outDir, "--emptyOutDir"],
    appPath,
  );
}

// Build the public front door last. Do not empty dist: demo routes live here too.
const homepage = join(appsDir, "home");
await run("bun", ["install"], homepage);
await run("bun", ["x", "tsc", "--noEmit"], homepage);
await run("bun", ["x", "vite", "build", "--base", "/", "--outDir", distDir], homepage);

console.log(`\nBuilt ${apps.length} app(s) → dist/`);
