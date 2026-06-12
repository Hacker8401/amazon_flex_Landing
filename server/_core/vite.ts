import type { Express } from "express";
import type { Server } from "http";
import path from "node:path";
import express from "express";

export async function setupVite(app: Express, server: Server) {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "custom",
    root: path.resolve(import.meta.dirname, "../../client"),
  });

  app.use(vite.middlewares);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "../../dist/public");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
