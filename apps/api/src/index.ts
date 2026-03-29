// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

import { buildApp } from "./app.js";

/** Dev default: `26` + DD + `1`. Override with PORT. */
function defaultApiDevPort(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  return Number.parseInt(`26${dd}1`, 10);
}

const port = Number(process.env.PORT ?? defaultApiDevPort());
const host = process.env.HOST ?? "0.0.0.0";

const app = await buildApp();

try {
  await app.listen({ port, host });
  app.log.info(`Listening on http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
