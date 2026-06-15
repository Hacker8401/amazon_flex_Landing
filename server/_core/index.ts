import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getDb } from "../db";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "node:path";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, "0.0.0.0", () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  if (process.env.NODE_ENV === "production") {
    return startPort;
  }

  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function runMigrations() {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[Database] Migration skipped: DATABASE_URL not provided");
      return;
    }

    console.log("[Database] Running migrations...");
    const migrationsPath = process.env.NODE_ENV === "production" 
      ? path.resolve(import.meta.dirname, "drizzle/migrations")
      : path.resolve(import.meta.dirname, "../../drizzle/migrations");
      
    await migrate(db, { migrationsFolder: migrationsPath });
    console.log("[Database] Migrations completed successfully");
  } catch (error) {
    console.error("[Database] Migration failed:", error);
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Configure body parser
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
      onError: ({ path, error }) => {
        console.error(`[tRPC Error] ${path}:`, error);
      }
    })
  );
  
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "3000");
  const finalPort = await findAvailablePort(port);

  server.listen(finalPort, "0.0.0.0", () => {
    console.log(`Server running on port ${finalPort}`);
    
    // Run migrations in background after server starts to avoid blocking
    runMigrations().catch(console.error);
  });
}

startServer().catch(console.error);
