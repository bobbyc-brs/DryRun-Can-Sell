// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

import "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    await reply.code(401).send({ error: "Unauthorized" });
  }
}

export type JwtPayload = { sub: string; email: string };

export function getUserId(request: FastifyRequest): string {
  const u = request.user as JwtPayload;
  return u.sub;
}
