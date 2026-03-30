// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from 'react'
import {
  describeFetchError,
  type Health,
  type VersionInfo,
} from './lib/health'
import './App.css'

export default function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState<VersionInfo | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/health')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<Health>
      })
      .then((data) => {
        if (!cancelled) {
          setHealth(data)
          setError(null)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setHealth(null)
          setError(describeFetchError(e))
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/version')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: VersionInfo) => {
        if (!cancelled) setVersion(data)
      })
      .catch(() => {
        if (!cancelled) setVersion(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="shell">
      <header className="header">
        <h1>Can-sell</h1>
        <p className="tagline">
          Web app scaffold — listings and auctions to follow.
        </p>
      </header>

      <section className="panel" aria-live="polite">
        <h2>API status</h2>
        {error && (
          <p className="status status-error">
            Cannot reach API ({error}). Is <code>npm run dev</code> running at
            the repo root?
          </p>
        )}
        {!error && !health && (
          <p className="status status-pending">Checking…</p>
        )}
        {health?.ok && (
          <p className="status status-ok">
            Backend reachable: <code>{health.service ?? 'api'}</code>
          </p>
        )}
      </section>

      <footer className="footer">
        {version && (
          <p className="footer-meta">
            API <code>{version.version}</code> · {version.license}
          </p>
        )}
        <p className="footer-meta">
          {version?.copyright ?? 'Copyright (C) 2026 Brighter Sight Inc.'} ·{' '}
          <a href={`mailto:${version?.contact ?? 'info@BrighterSight.ca'}`}>
            {version?.contact ?? 'info@BrighterSight.ca'}
          </a>
        </p>
      </footer>
    </div>
  )
}
