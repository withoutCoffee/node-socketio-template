import express, { Express, Request, Response } from "express";
import cor from "cors";
import helmet from "helmet";
import path from "path";
import { config } from "./config/env";
import prisma from "./lib/prisma";

export const createApp = (): Express => {
  const app = express();

  app.use(
    cor({
      origin: "*",
    }),
  ); // Habilita CORS para todas as localhosts e métodos

  app.use(helmet());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get(`${config.prefix}/health`, async (req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({
        status: "ok",
        message: "Database connection is healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Database connection failed",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
  return app;
};

export default createApp;
