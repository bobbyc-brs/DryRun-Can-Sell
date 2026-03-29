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

- **Web** — Vite dev server (default [http://localhost:5173](http://localhost:5173)), proxying `/api` to the API.
- **API** — Fastify on [http://127.0.0.1:3001](http://127.0.0.1:3001).

### Database (Prisma)

```bash
cp apps/api/.env.example apps/api/.env
# Edit DATABASE_URL, then:
npm run db:push -w api
# or: npm run db:migrate -w api
```

The API process does not require PostgreSQL to start; Prisma is used when you add routes that query the database.

### Workspace commands

| Command | Description |
|--------|-------------|
| `npm run dev` | Web + API concurrently |
| `npm run build` | Production build for both apps |
| `npm run lint -w web` | ESLint (web) |

### Troubleshooting

**`tsx` / API dev: “The package \"@esbuild/linux-x64\" could not be found”** (or similar for your OS): the API dev script uses **`tsx`**, which relies on **esbuild** platform binaries shipped as optional dependencies. Do **not** install with `npm install --omit=optional`. If it still happens, run `npm install` again from the repo root (root **`esbuild`** in `package.json` helps npm lay out `@esbuild/*` correctly). On Linux you can confirm with `ls node_modules/@esbuild/`.

**`EADDRINUSE` on port 3001:** another process is using the API port. Stop the old dev server or run `fuser -k 3001/tcp` (Linux), then `npm run dev` again.

## Documentation

| File | Purpose |
|------|---------|
| [Vision.md](./Vision.md) | Product vision |
| [requirements.md](./requirements.md) | Requirements (`FR-*`, `NFR-*`) |
| [test-plan.md](./test-plan.md) | Test strategy |
| [implementation-plan.md](./implementation-plan.md) | Phased delivery |
| [design-decisions.md](./design-decisions.md) | Architecture and process ADRs |
| [dependencies.md](./dependencies.md) | Packages, locked versions, rationale |
| [traceability.md](./traceability.md) | Living requirement ↔ test map |
