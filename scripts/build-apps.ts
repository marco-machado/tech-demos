import { readdir, mkdir, writeFile, access } from "node:fs/promises";
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

const links = apps
  .sort()
  .map((slug) => `<li><a href="/${slug}/">${slug}</a></li>`)
  .join("\n");

await writeFile(
  join(distDir, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>tech-demos</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; max-width: 40rem; margin: 3rem auto; padding: 0 1rem; line-height: 1.5; }
      a { color: #2563eb; }
    </style>
  </head>
  <body>
    <h1>tech-demos</h1>
    <p>Sticky monorepo demos (path per app).</p>
    <ul>
${links || "      <li>No apps built yet.</li>"}
    </ul>
  </body>
</html>
`,
);

console.log(`\nBuilt ${apps.length} app(s) → dist/`);
