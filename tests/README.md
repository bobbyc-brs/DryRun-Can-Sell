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

### Layout

```text
tests/
  api/unit/          # Fastify inject tests (Node)
  web/unit/          # Pure helpers / small modules (Node)
  web/components/    # React + Testing Library (jsdom)
```
