# Test layout

All automated tests live under **`tests/`**, grouped by area:

| Path | Purpose |
|------|---------|
| `tests/api/unit/` | API unit / integration-style tests (Fastify `inject`, no TCP). |
| `tests/web/unit/` | Pure functions and small modules from `apps/web` (Node env). |
| `tests/web/components/` | React component tests (jsdom). |

Run from the **repository root**:

```bash
npm test
npm run test:watch
```

Configuration: root [`vitest.config.ts`](../vitest.config.ts). Imports use aliases **`@api/*`** → `apps/api/src` and **`@web/*`** → `apps/web/src`.

Name tests with **`FR-xxx`** / **`NFR-xxx`** prefixes when they map to [requirements.md](../requirements.md); update [traceability.md](../traceability.md).

**API auth tests** ([`tests/api/unit/auth.test.ts`](../tests/api/unit/auth.test.ts)) need a **reachable PostgreSQL** database: set **`DATABASE_URL`** in `apps/api/.env` (see [`apps/api/.env.example`](../apps/api/.env.example)) and apply migrations (`npm run db:migrate -w api` or `db:deploy`). Vitest defaults `DATABASE_URL` to the example URL if unset; without a running server those tests fail with connection errors.

### Layout

```text
tests/
  api/unit/          # Fastify inject tests (Node)
  web/unit/          # Pure helpers / small modules (Node)
  web/components/    # React + Testing Library (jsdom)
```
