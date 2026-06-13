import type { Express } from "express";
import type { Server } from "http";
import path from "node:path";
import express from "express";
import fs from "node:fs";

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
  // In production, the built file is at dist/index.js
  // The static files are at dist/public
  const distPath = path.resolve(import.meta.dirname, "public");
  
  if (!fs.existsSync(distPath)) {
    console.error(`[Static] Directory not found: ${distPath}`);
  }

  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Not Found");
    }
  });
}
