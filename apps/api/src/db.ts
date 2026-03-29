// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

import { PrismaClient } from "@prisma/client";

/**
 * Shared Prisma client for the API process. Import from route modules; do not create
 * ad-hoc clients per request.
 * @see prisma/schema.prisma — models `User`, `Sale` (expand per requirements).
 */
export const prisma = new PrismaClient();
