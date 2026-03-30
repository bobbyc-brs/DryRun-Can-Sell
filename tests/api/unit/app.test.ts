// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @see test-plan.md — NFR-006 (structured health signals for debugging/ops).
 * Naming: `NFR-006-*` maps to traceability.md.
 */

import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "@api/app";

describe("NFR-006 API health and version (smoke)", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("NFR-006-01 GET /api/health returns 200 and ok", async () => {
    const res = await app.inject({ method: "GET", url: "/api/health" });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as { ok: boolean; service: string };
    expect(body.ok).toBe(true);
    expect(body.service).toBe("can-sell-api");
  });

  it("NFR-006-02 GET /api/version returns license metadata", async () => {
    const res = await app.inject({ method: "GET", url: "/api/version" });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as { license: string; contact: string };
    expect(body.license).toBe("GPL-3.0-or-later");
    expect(body.contact).toContain("@");
  });
});
