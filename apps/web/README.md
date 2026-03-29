# Can-sell Web (`apps/web`)

Vite + React + TypeScript SPA. Proxies `/api/*` to the Fastify API (see [apps/api/README.md](../api/README.md)).

## Entry points

| File | Role |
|------|------|
| `index.html` | Shell; loads `src/main.tsx`. |
| `src/main.tsx` | React root + `StrictMode`. |
| `src/App.tsx` | Home shell: fetches `/api/health` and `/api/version` (dev proxy). |
| `vite.config.ts` | Dev server port **26DD0**, proxy to API **26DD1** ([ADR-004](../../design-decisions.md)). |

Product flows (**FR-***) will land here as routes/components grow; see [requirements.md](../../requirements.md).
