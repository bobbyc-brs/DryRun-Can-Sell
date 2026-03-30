# Can-sell

Marketplace for timed auctions and listings (see [Vision.md](./Vision.md)).

## License

Copyright (C) 2026 [Brighter Sight Inc.](mailto:info@BrighterSight.ca)

This program is free software: you can redistribute it and/or modify it under the terms of the **GNU General Public License** as published by the Free Software Foundation, either **version 3** of the License, or (at your option) any later version. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

## Development

**Requirements:** Node.js 20+, npm 10+. PostgreSQL is required when you run Prisma migrations against a real database.

```bash
npm install
npm run dev
```

This runs:

- **Web** — Vite dev server on **`26` + day-of-month (DD) + `0`** (e.g. March 29 → [http://localhost:26290](http://localhost:26290)), proxying `/api` to the API.
- **API** — Fastify on **`26` + DD + `1`** (e.g. March 29 → [http://127.0.0.1:26291](http://127.0.0.1:26291)).

Ports change with the calendar day so local runs are less likely to clash with other tools. Override with **`VITE_PORT`** / **`VITE_API_PORT`** (web) and **`PORT`** (API) in the environment if needed.

### Database (Prisma)

```bash
cp apps/api/.env.example apps/api/.env
# Edit DATABASE_URL, then:
npm run db:push -w api
# or: npm run db:migrate -w api
```

The API loads **`JWT_SECRET`** (and **`DATABASE_URL`**) from `apps/api/.env` for auth routes. PostgreSQL must be running with migrations applied for **register/login** and for **API tests** that hit the database.

### Continuous integration

On **push** and **pull requests** to **`main`**, [GitHub Actions](.github/workflows/ci.yml) starts **PostgreSQL**, runs **`prisma migrate deploy`** for the API, then **`npm run verify`** (same as local pre-push).

### Workspace commands

| Command | Description |
|--------|-------------|
| `npm run dev` | Web + API concurrently |
| `npm run build` | Production build for both apps |
| `npm test` | All Vitest suites under [`tests/`](./tests/README.md) |
| `npm run test:watch` | Vitest watch mode |
| `npm run lint -w web` | ESLint (web) |
| `npm run verify` | Build + test + lint (also runs on **`git push`** via Husky) |

### Contributing and Git workflow

Use **feature branches + pull requests** into `main` for substantive work (see [CONTRIBUTING.md](./CONTRIBUTING.md)). **Code and schema docs:** [apps/api/README.md](./apps/api/README.md), [apps/web/README.md](./apps/web/README.md), Prisma `///` comments in [apps/api/prisma/schema.prisma](./apps/api/prisma/schema.prisma). **Requirement ↔ test map:** [traceability.md](./traceability.md).

### Troubleshooting

**`tsx` / API dev: “The package \"@esbuild/linux-x64\" could not be found”** (or similar for your OS): the API dev script uses **`tsx`**, which relies on **esbuild** platform binaries shipped as optional dependencies. Do **not** install with `npm install --omit=optional`. If it still happens, run `npm install` again from the repo root (root **`esbuild`** in `package.json` helps npm lay out `@esbuild/*` correctly). On Linux you can confirm with `ls node_modules/@esbuild/`.

**`EADDRINUSE`:** another process is using the web or API dev port (see the **`26` + DD + `0` / `1`** scheme above). Stop the old dev server or free the port (e.g. `fuser -k 26291/tcp` on Linux when the API fails to bind), then `npm run dev` again.

**`npm test` / `vite build` / native bindings (`@rolldown/…`, `lightningcss.…node`):** do not use `npm install --omit=optional`. If a platform binary is missing, run `npm install` again from the repo root; root `package.json` may pin Linux helpers for CI/dev consistency.

## Documentation

| File | Purpose |
|------|---------|
| [Vision.md](./Vision.md) | Product vision |
| [requirements.md](./requirements.md) | Requirements (`FR-*`, `NFR-*`) |
| [test-plan.md](./test-plan.md) | Test strategy |
| [implementation-plan.md](./implementation-plan.md) | Phased delivery |
| [HLD.md](./HLD.md) | High-level design (Mermaid: context, classes, sequences) |
| [design-decisions.md](./design-decisions.md) | Architecture and process ADRs |
| [dependencies.md](./dependencies.md) | Packages, locked versions, rationale |
| [traceability.md](./traceability.md) | Living requirement ↔ test map |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | PR workflow, checks before merge |
| [tests/README.md](./tests/README.md) | Test folder layout (`api/`, `web/`) |
