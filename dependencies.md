# Dependencies — packages, versions, and rationale

**Source of truth for exact resolved versions:** [package-lock.json](./package-lock.json) (commit that file when dependencies change).  
**Ranges in `package.json`** use semver (`^`, `~`); **installed** versions below reflect the current lockfile (run `npm ls <name>` to refresh).

*Last verified:* 2026-03-29 (from `npm ls` after install).

---

## Runtime and platform

| Package | Installed (approx.) | Where | Why |
|---------|---------------------|--------|-----|
| **Node.js** | *(your install)* | dev / CI / prod | LTS recommended; workspace uses `import` and modern TS. |
| **PostgreSQL** | *(your install)* | server | Persistent data via Prisma; required when you run migrations against a real DB. |

---

## Root workspace (`can-sell`)

| Package | Installed | Why |
|---------|-----------|-----|
| **concurrently** `^9.1.2` → **9.2.1** | dev | Run **web + API** with one `npm run dev` and labeled output ([design-decisions.md](./design-decisions.md) ADR-002). |
| **esbuild** `^0.27.4` | dev | Declared at the **root** so optional **`@esbuild/*`** platform packages install reliably; **`tsx`** (API dev) and **Vite** depend on esbuild transforms. See [README](./README.md) troubleshooting if `@esbuild/linux-x64` (or your OS) is missing. |

---

## Web app (`apps/web`)

| Package | Installed | Why |
|---------|-----------|-----|
| **react** / **react-dom** `^19.2.4` → **19.2.4** | deps | UI layer; broad ecosystem; matches Vite React template. |
| **vite** `^8.0.1` → **8.0.3** | dev | Fast dev server, HMR, production build; fits “web-only SPA” in [Vision.md](./Vision.md). |
| **@vitejs/plugin-react** `^6.0.1` | dev | JSX + Fast Refresh for React. |
| **typescript** `~5.9.3` → **5.9.3** | dev | Shared typed frontend; aligns with API package. |
| **eslint** `^9.39.4` → **9.39.4** | dev | Linting for consistent style and catch common bugs. |
| **typescript-eslint**, **eslint-plugin-react-hooks**, **eslint-plugin-react-refresh**, **@eslint/js**, **globals** | dev | TypeScript-aware lint + React hooks + Vite HMR rules (template defaults). |

**Why Vite + React (not Next.js for v1):** Matches ADR-002: separate **API-first** backend; SPA can be hosted as static assets while the API scales independently.

---

## API (`apps/api`)

| Package | Installed | Why |
|---------|-----------|-----|
| **fastify** `^5.6.0` → **5.8.4** | deps | Lightweight HTTP server, schema-friendly, good performance for JSON APIs. |
| **@prisma/client** `^6.19.0` → **6.19.2** | deps | Type-safe DB access generated from [schema](./apps/api/prisma/schema.prisma). |
| **prisma** `^6.19.0` → **6.19.2** | dev | Migrations, `db push`, `prisma generate` in CI/dev. |
| **tsx** `^4.20.5` → **4.21.0** | dev | Run TypeScript in dev with **`tsx watch`** without a separate compile step. |
| **typescript** `~5.9.3` → **5.9.3** | dev | Same language version as web for shared types later if needed. |
| **@types/node** `^22.16.5` | dev | Node typings for Fastify and `process.env`. |
| **vitest** `^3.2.4` | dev | API unit/smoke tests (`npm run test -w api`); see [ADR-005](./design-decisions.md). |

**Why Fastify:** Small surface area for Phase 0; easy to add plugins (auth, multipart uploads, rate limits) later.

**Why Prisma:** Schema-first evolution toward auctions, users, and bids; migrations tracked in repo.

---

## Notable transitive dependencies

The lockfile pulls in **Babel** (via Vite/React), **undici-types**, ESLint plugins, etc. We do not pin those directly unless we need to; upgrades flow from the direct dependencies above.

---

## Refreshing this document

After `npm update` or changing `package.json`:

```bash
npm ls concurrently vite react react-dom fastify @prisma/client prisma typescript eslint tsx vitest --all
```

Update the **Installed** column and the date in the header.

---

## Related

- [design-decisions.md](./design-decisions.md) — ADR-002 (monorepo shape).
- [implementation-plan.md](./implementation-plan.md) — phased technical work.

---

## Official reference URLs

Use these for upstream docs, tutorials, and API references. (If a link breaks, search the project name; vendors move pages occasionally.)

| Tool | Primary documentation |
|------|------------------------|
| **Node.js** | [https://nodejs.org/en/docs](https://nodejs.org/en/docs) |
| **npm** (workspaces, CLI) | [https://docs.npmjs.com/](https://docs.npmjs.com/) |
| **PostgreSQL** | [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/) |
| **concurrently** | [https://github.com/open-cli-tools/concurrently](https://github.com/open-cli-tools/concurrently) |
| **React** | [https://react.dev/](https://react.dev/) |
| **Vite** | [https://vite.dev/](https://vite.dev/) |
| **@vitejs/plugin-react** | [https://github.com/vitejs/vite-plugin-react](https://github.com/vitejs/vite-plugin-react) |
| **TypeScript** | [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/) |
| **ESLint** | [https://eslint.org/docs/latest/](https://eslint.org/docs/latest/) |
| **typescript-eslint** | [https://typescript-eslint.io/](https://typescript-eslint.io/) |
| **Fastify** | [https://fastify.dev/](https://fastify.dev/) |
| **Prisma** | [https://www.prisma.io/docs](https://www.prisma.io/docs) |
| **esbuild** | [https://esbuild.github.io/](https://esbuild.github.io/) |
| **tsx** | [https://tsx.is/](https://tsx.is/) |
| **Vitest** | [https://vitest.dev/](https://vitest.dev/) |
