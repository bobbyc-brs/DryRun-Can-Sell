// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import "@testing-library/jest-dom/vitest";

const root = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(root, "apps/api/.env") });

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "vitest-local-jwt-secret";
}

/** Matches [apps/api/.env.example](./apps/api/.env.example); tests need a reachable DB. */
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://postgres:postgres@localhost:5432/cansell?schema=public";
}
