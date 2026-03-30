# Can-sell API (`apps/api`)

Fastify + Prisma + PostgreSQL. See the monorepo [README](../../README.md) for install and `npm run dev`.

## Layout

| Path | Role |
|------|------|
| `src/index.ts` | Process entry: `buildApp()`, bind port ([ADR-004](../../design-decisions.md)), listen. |
| `src/app.ts` | **`buildApp()`** — registers all routes; used by tests without listening. |
| `src/version-info.ts` | Reads `package.json` for `/api/version`. |
| `src/db.ts` | Singleton `PrismaClient`. |
| `src/guard.ts` | JWT `requireAuth` / `getUserId` (not wired into routes yet). |
| `prisma/schema.prisma` | Data model; field-level `///` docs in file. |

## HTTP routes (current)

| Method | Path | Purpose | Requirements (trace) |
|--------|------|---------|----------------------|
| GET | `/health` | Plain liveness | NFR-006 |
| GET | `/api/health` | JSON liveness + service name | NFR-006 |
| GET | `/api/version` | Name, version, GPL / copyright / contact | License / ops |

Protected seller/buyer routes (**FR-001+**) are not registered yet.

## Commands

```bash
npm run dev -w api          # tsx watch
npm run build -w api        # compile to dist/
npm run db:migrate -w api   # needs DATABASE_URL
```

## Tests

API tests live under the repo [`tests/api/unit/`](../../tests/api/unit/) (Vitest from the monorepo root: `npm test`). **`NFR-006-xx`** cases inject into `buildApp({ logger: false })` — see [tests/README.md](../../tests/README.md).
