// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

/** Response shape for `/api/health`. */
export type Health = { ok: boolean; service?: string }

export type VersionInfo = {
  name: string
  version: string
  license: string
  copyright: string
  contact: string
}

/** Normalizes fetch / network errors for UI copy. */
export function describeFetchError(err: unknown): string {
  return err instanceof Error ? err.message : 'Request failed'
}

/** True when the health payload indicates the API is up. */
export function isBackendReachable(health: Health | null): boolean {
  return health?.ok === true
}
