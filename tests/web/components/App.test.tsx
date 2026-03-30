// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '@web/App'

function createFetchMock() {
  const health = { ok: true, service: 'can-sell-api' }
  const version = {
    name: 'web',
    version: '0.0.0',
    license: 'GPL-3.0-or-later',
    copyright: 'Copyright (C) 2026 Brighter Sight Inc.',
    contact: 'info@BrighterSight.ca',
  }
  return vi.fn((input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString()
    if (url.includes('/api/health')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(health),
      })
    }
    if (url.includes('/api/version')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(version),
      })
    }
    return Promise.reject(new Error('unknown url'))
  })
}

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', createFetchMock())
  })

  it('renders product title', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Can-sell/i }),
    ).toBeInTheDocument()
  })

  it('shows backend reachable after health fetch', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText(/Backend reachable/)).toBeInTheDocument()
    })
  })
})
