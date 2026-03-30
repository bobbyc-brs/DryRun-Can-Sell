// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it } from 'vitest'
import {
  describeFetchError,
  isBackendReachable,
} from '@web/lib/health'

describe('health helpers', () => {
  it('describeFetchError uses Error.message when Error', () => {
    expect(describeFetchError(new Error('HTTP 503'))).toBe('HTTP 503')
  })

  it('describeFetchError falls back for non-Error', () => {
    expect(describeFetchError('x')).toBe('Request failed')
  })

  it('isBackendReachable is true only when ok', () => {
    expect(isBackendReachable({ ok: true, service: 'api' })).toBe(true)
    expect(isBackendReachable({ ok: false })).toBe(false)
    expect(isBackendReachable(null)).toBe(false)
  })
})
