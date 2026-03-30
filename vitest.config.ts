// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@api": path.join(root, "apps/api/src"),
      "@web": path.join(root, "apps/web/src"),
    },
  },
  test: {
    globals: false,
    passWithNoTests: false,
    setupFiles: [path.join(root, "vitest.setup.ts")],
    environment: "node",
    environmentMatchGlobs: [
      ["tests/web/**", "jsdom"],
      ["tests/api/**", "node"],
    ],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
