import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { discoverDemos } from "./catalogue.ts";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "demo-catalogue",
      resolveId(id) {
        return id === "virtual:demo-catalogue"
          ? "\0virtual:demo-catalogue"
          : undefined;
      },
      async load(id) {
        if (id === "\0virtual:demo-catalogue")
          return `export default ${JSON.stringify(await discoverDemos(fileURLToPath(new URL("../..", import.meta.url))))}`;
      },
      configureServer(server) {
        server.watcher.add([
          fileURLToPath(new URL("../", import.meta.url)),
          fileURLToPath(
            new URL("../../tracking/seen-bookmarks.json", import.meta.url),
          ),
        ]);
        server.watcher.on("all", (_event, file) => {
          if (
            file.endsWith("package.json") ||
            file.endsWith("seen-bookmarks.json")
          ) {
            const module = server.moduleGraph.getModuleById(
              "\0virtual:demo-catalogue",
            );
            if (module) server.moduleGraph.invalidateModule(module);
            server.ws.send({ type: "full-reload" });
          }
        });
      },
    },
  ],
  server: {
    host: true,
    port: 5180,
    watch: { usePolling: true, interval: 300 },
    proxy: Object.fromEntries(
      ["cult-ui", "motion-panels", "pr-lens", "show-me", "ui-effects"].map(
        (slug) => [
          `/${slug}/`,
          { target: "https://beyond-localhost.vercel.app", changeOrigin: true },
        ],
      ),
    ),
  },
  build: { chunkSizeWarningLimit: 1600 },
});
