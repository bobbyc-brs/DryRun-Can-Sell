// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

import jwt from "@fastify/jwt";
import Fastify, { type FastifyServerOptions } from "fastify";
import { prisma } from "./db.js";
import { registerAuthRoutes } from "./routes/auth.js";
import { readApiPackage } from "./version-info.js";

export type BuildAppOptions = {
  /** Set `false` in tests; default `true` in production-like runs. */
  logger?: FastifyServerOptions["logger"];
  /** Overrides `process.env.JWT_SECRET` (tests should pass an explicit value). */
  jwtSecret?: string;
};

/**
 * Builds the Fastify app with all HTTP routes (no listen).
 *
 * Requirement touchpoints (see [requirements.md](../../../requirements.md)):
 * - **FR-001–003**: JWT auth (`/api/auth/*`), `guard.ts` (`requireAuth`).
 * - Future **FR-010+**: seller/sale CRUD will extend this app.
 *
 * Current routes include **infrastructure / ops** (health, version), not yet mapped to a
 * functional FR beyond auth; tests reference **NFR-006** (observability baseline).
 */
export async function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({
    logger: options.logger ?? true,
  });

  const jwtSecret = options.jwtSecret ?? process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is required");
  }

  await app.register(jwt, {
    secret: jwtSecret,
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
    },
  });

  await registerAuthRoutes(app);

  const pkg = readApiPackage();

  /**
   * Liveness for load balancers / process managers.
   * @see NFR-006 — baseline health signal for ops.
   */
  app.get("/health", async () => ({ ok: true }));

  /**
   * JSON health under `/api` (same host as app routes).
   * @see NFR-006
   */
  app.get("/api/health", async () => ({
    ok: true,
    service: "can-sell-api",
  }));

  /**
   * Build metadata and license (GPL notice for API consumers).
   * @see NOTICE at repo root
   */
  app.get("/api/version", async () => ({
    name: pkg.name,
    version: pkg.version,
    license: "GPL-3.0-or-later",
    copyright: "Copyright (C) 2026 Brighter Sight Inc.",
    contact: "info@BrighterSight.ca",
  }));

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
}
