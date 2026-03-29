// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

import Fastify from "fastify";
import { readApiPackage } from "./version-info.js";

const app = Fastify({ logger: true });

const pkg = readApiPackage();

app.get("/health", async () => ({ ok: true }));

app.get("/api/health", async () => ({
  ok: true,
  service: "can-sell-api",
}));

app.get("/api/version", async () => ({
  name: pkg.name,
  version: pkg.version,
  license: "GPL-3.0-or-later",
  copyright: "Copyright (C) 2026 Brighter Sight Inc.",
  contact: "info@BrighterSight.ca",
}));

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";

try {
  await app.listen({ port, host });
  app.log.info(`Listening on http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
