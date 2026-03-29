import { useEffect, useState } from 'react'
import './App.css'

type Health = { ok: boolean; service?: string }

export default function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [error, setError] = useState<string | null>(null)

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
          setError(e instanceof Error ? e.message : 'Request failed')
        }
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
    </div>
  )
}
