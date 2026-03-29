# Can-sell

Marketplace for timed auctions and listings (see [Vision.md](./Vision.md)).

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
