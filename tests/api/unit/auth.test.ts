// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @see requirements.md FR-001 (register, sign in, sign out)
 * Naming: `FR-001-xx` maps to traceability.md.
 */

import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "@api/app";

describe("FR-001 auth (register, login, me, logout)", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp({
      logger: false,
      jwtSecret: "test-jwt-secret-auth-tests",
    });
    await app.ready();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it("FR-001-01 POST /api/auth/register returns 201, token, and user id", async () => {
    const email = `${randomUUID()}@test.example`;
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: { email, password: "password12" },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body) as {
      token: string;
      user: { id: string; email: string };
    };
    expect(body.token.length).toBeGreaterThan(20);
    expect(body.user.email).toBe(email);
    expect(body.user.id.length).toBeGreaterThan(10);
  });

  it("FR-001-02 duplicate email returns 409", async () => {
    const email = `${randomUUID()}@test.example`;
    await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: { email, password: "password12" },
    });
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: { email, password: "password12" },
    });
    expect(res.statusCode).toBe(409);
  });

  it("FR-001-03 POST /api/auth/login returns token", async () => {
    const email = `${randomUUID()}@test.example`;
    const password = "password12";
    await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: { email, password },
    });
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email, password },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as { token: string };
    expect(body.token.length).toBeGreaterThan(20);
  });

  it("FR-001-04 login with wrong password returns 401", async () => {
    const email = `${randomUUID()}@test.example`;
    await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: { email, password: "password12" },
    });
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email, password: "wrong-pass" },
    });
    expect(res.statusCode).toBe(401);
  });

  it("FR-001-05 GET /api/auth/me with Bearer token returns user", async () => {
    const email = `${randomUUID()}@test.example`;
    const reg = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: { email, password: "password12" },
    });
    const { token } = JSON.parse(reg.body) as { token: string };
    const res = await app.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body) as { user: { id: string; email: string } };
    expect(body.user.email).toBe(email);
  });

  it("FR-001-06 GET /api/auth/me without token returns 401", async () => {
    const res = await app.inject({ method: "GET", url: "/api/auth/me" });
    expect(res.statusCode).toBe(401);
  });

  it("FR-001-07 POST /api/auth/logout returns 204", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/logout",
    });
    expect(res.statusCode).toBe(204);
  });
});
