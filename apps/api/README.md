# Can-sell API (`apps/api`)

Fastify + Prisma + PostgreSQL. See the monorepo [README](../../README.md) for install and `npm run dev`.

## Layout

| Path | Role |
|------|------|
| `src/index.ts` | Process entry: loads `.env`, `buildApp()`, bind port ([ADR-004](../../design-decisions.md)), listen. |
| `src/app.ts` | **`buildApp()`** — registers JWT, routes; used by tests without listening. |
| `src/version-info.ts` | Reads `package.json` for `/api/version`. |
| `src/db.ts` | Singleton `PrismaClient`. |
| `src/guard.ts` | JWT `requireAuth` / `getUserId`. |
| `src/routes/auth.ts` | **FR-001** — `/api/auth/register`, `/login`, `/logout`, `/me`. |
| `prisma/schema.prisma` | Data model; field-level `///` docs in file. |

## HTTP routes (current)

| Method | Path | Purpose | Requirements (trace) |
|--------|------|---------|------------------------|
| GET | `/health` | Plain liveness | NFR-006 |
| GET | `/api/health` | JSON liveness + service name | NFR-006 |
| GET | `/api/version` | Name, version, GPL / copyright / contact | License / ops |
| POST | `/api/auth/register` | Create user; returns JWT | FR-001 |
| POST | `/api/auth/login` | Email/password; returns JWT | FR-001 |
| POST | `/api/auth/logout` | No-op for JWT (client discards token) | FR-001 |
| GET | `/api/auth/me` | Current user (Bearer JWT) | FR-001, FR-002 |

Protected seller/buyer routes for sales/items (**FR-010+**) are not registered yet.

## Environment

Copy [`.env.example`](./.env.example) to **`.env`**. Required for auth:

- **`DATABASE_URL`** — PostgreSQL connection string.
- **`JWT_SECRET`** — secret for signing access tokens (use a long random value in production).

Optional: **`JWT_EXPIRES_IN`** (default `7d`), **`PORT`**, **`HOST`**.

## Commands

```bash
npm run dev -w api          # tsx watch
npm run build -w api        # compile to dist/
npm run db:migrate -w api   # dev migrations (needs DATABASE_URL)
npm run db:deploy -w api    # apply migrations (CI / staging / prod)
```

## Tests

API tests live under the repo [`tests/api/unit/`](../../tests/api/unit/) (Vitest from the monorepo root: `npm test`). **`NFR-006-xx`** cases inject into `buildApp({ logger: false })`. **`FR-001-xx`** auth cases need PostgreSQL and migrations applied — see [tests/README.md](../../tests/README.md).
