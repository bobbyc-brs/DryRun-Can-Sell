// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { FastifyInstance } from "fastify";
import { prisma } from "../db.js";
import { getUserId, requireAuth, type JwtPayload } from "../guard.js";

const BCRYPT_ROUNDS = 10;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Register/login/logout and current user.
 * @see requirements.md FR-001 (register, sign in, sign out)
 */
export async function registerAuthRoutes(app: FastifyInstance) {
  app.post<{
    Body: { email?: string; password?: string };
  }>("/api/auth/register", async (request, reply) => {
    const emailRaw = request.body?.email;
    const password = request.body?.password;
    if (typeof emailRaw !== "string" || typeof password !== "string") {
      await reply.code(400).send({ error: "email and password are required" });
      return;
    }
    const email = normalizeEmail(emailRaw);
    if (!email.includes("@")) {
      await reply.code(400).send({ error: "Invalid email" });
      return;
    }
    if (password.length < 8) {
      await reply
        .code(400)
        .send({ error: "Password must be at least 8 characters" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    try {
      const user = await prisma.user.create({
        data: { email, passwordHash },
      });
      const payload: JwtPayload = { sub: user.id, email: user.email };
      const token = await reply.jwtSign(payload);
      await reply.code(201).send({
        token,
        user: { id: user.id, email: user.email },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        await reply.code(409).send({ error: "Email already registered" });
        return;
      }
      throw err;
    }
  });

  app.post<{
    Body: { email?: string; password?: string };
  }>("/api/auth/login", async (request, reply) => {
    const emailRaw = request.body?.email;
    const password = request.body?.password;
    if (typeof emailRaw !== "string" || typeof password !== "string") {
      await reply.code(400).send({ error: "email and password are required" });
      return;
    }
    const email = normalizeEmail(emailRaw);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await reply.code(401).send({ error: "Invalid email or password" });
      return;
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      await reply.code(401).send({ error: "Invalid email or password" });
      return;
    }
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const token = await reply.jwtSign(payload);
    await reply.send({
      token,
      user: { id: user.id, email: user.email },
    });
  });

  /**
   * FR-001 sign-out: JWTs are stateless; clients discard the token. This route
   * exists so clients can call a dedicated endpoint after clearing storage.
   */
  app.post("/api/auth/logout", async (_request, reply) => {
    await reply.code(204).send();
  });

  app.get(
    "/api/auth/me",
    { preHandler: requireAuth },
    async (request, reply) => {
      const id = getUserId(request);
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true },
      });
      if (!user) {
        await reply.code(401).send({ error: "Unauthorized" });
        return;
      }
      await reply.send({ user });
    },
  );
}
