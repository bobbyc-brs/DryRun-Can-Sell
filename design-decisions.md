# Design decisions log

Records **why** we chose an approach, not only **what** we built. New decisions append as **ADR-00x**; superseded entries stay for history with a **Status** line.

---

## ADR-001 — Traceability vs. building the application first

**Status:** Accepted (2026-03-29)

### Context

We have requirement IDs (`FR-*`, `NFR-*`) in [requirements.md](./requirements.md) and coverage intent in [test-plan.md](./test-plan.md). We needed to decide whether to produce a full **traceability matrix** (requirements × design × code × tests) before writing code.

### Decision

1. **Start the application** (Phase 0 / thin vertical slices) **before** investing in a complete traceability matrix.
2. Keep traceability **light and living** from the first commits:
   - Continue using **FR-*** / **NFR-*** in requirements and test plans.
   - In automated tests (and tickets), **reference requirement IDs** in names, descriptions, or metadata.
   - Maintain a **single living artifact** (e.g. [traceability.md](./traceability.md) or a small table) that we **append to** as features land—not a one-time exhaustive grid before “hello world.”

### Consequences

- **Positive:** Faster feedback, less rework when the first API and UI exist; matrix rows attach to real tests and modules.
- **Negative:** Full audit-style coverage is **not** complete on day one; acceptable unless compliance mandates a full matrix upfront.

### Notes

Invest in a **heavier** matrix earlier if the domain becomes regulated or formal QA/audit requires it.

---

## ADR-002 — Initial application shape (monorepo: web + API)

**Status:** Accepted (2026-03-29)

### Context

[implementation-plan.md](./implementation-plan.md) calls for a **web-only** client, **API-first** backend, and **PostgreSQL**. We need a repo layout for Phase 0.

### Decision

- **Monorepo** with npm workspaces:
  - **`apps/web`** — React, TypeScript, Vite (responsive SPA foundation).
  - **`apps/api`** — Node.js, Fastify, TypeScript; **Prisma** for schema/migrations toward PostgreSQL.
- **Environment:** `DATABASE_URL` in `.env` (see `.env.example`); local dev may use Docker Postgres or a hosted DB.

### Consequences

- **Positive:** Clear separation matches “API-first”; web and API version together; Prisma gives typed DB access.
- **Negative:** Two processes in dev (served via root `npm run dev` with `concurrently`); teams must keep API contracts stable.

### Alternatives considered

- **Next.js only** (API routes + UI): faster single deploy, but less separation for a strict API-first mental model—we may revisit for production hosting.
- **pnpm** workspaces: slightly nicer DX; we started with **npm** workspaces for ubiquity.

---

## ADR-003 — Licensing (GPL-3.0-or-later, Brighter Sight Inc.)

**Status:** Accepted (2026-03-29)

### Context

We need a clear **open-source** license and **attribution** for Can-sell, with a **contact** path for the copyright holder.

### Decision

- License: **[GNU General Public License v3.0 or later](https://www.gnu.org/licenses/gpl-3.0.html)** (`GPL-3.0-or-later`).
- Copyright: **Brighter Sight Inc.** Contact: **[info@BrighterSight.ca](mailto:info@BrighterSight.ca)**.
- Full license text: [LICENSE](./LICENSE); short notice: [NOTICE](./NOTICE).
- **npm** `author` / `license` fields set in workspace `package.json` files.
- **Source** files (TypeScript, JavaScript, CSS, Prisma schema, HTML) include **SPDX** (`GPL-3.0-or-later`) and copyright where practical.

### Consequences

- Recipients who **distribute** modified versions must comply with GPL obligations (source offer, license copy, etc.—see LICENSE).
- **Third-party** npm packages remain under their own licenses; the lockfile and upstream notices govern those components.

---

## ADR-004 — Dev server ports (`26` + calendar day + slot)

**Status:** Accepted (2026-03-29)

### Context

Fixed ports (e.g. 5173 / 3001) often collide with other local services.

### Decision

- In **development**, default ports follow **`26` + DD + slot**, where **DD** is the two-digit **day of month** (01–31) and **slot** is a single digit:
  - **Slot 0** — web (Vite).
  - **Slot 1** — API (Fastify).
- Example: the **29th** of the month → **26290** (web), **26291** (API).
- Override with **`VITE_PORT`**, **`VITE_API_PORT`** (proxy target in Vite), and **`PORT`** (API) when needed.

### Day-of-month only (not full MMDD)

- The middle digits are **DD** (01–31), **not** month+day (**MMDD**). Encoding **MMDD** (e.g. March 9 → `0309`) would produce values such as **`2603090`**, which are **not valid TCP ports** (max **65535**) unless we shorten or hash the date differently.
- Using **DD** keeps ports in a predictable band (roughly **26010**–**26319** for slots 0–1) and matches the intended examples (**26290** / **26291** on the 29th).
- The **month is not** in the port number; only the **day of the current month** matters. Two different months with the same calendar day (e.g. Jan 29 and Mar 29) reuse the same default ports—acceptable for local dev; use **env overrides** if that collision matters.

### Consequences

- Ports **change with the day of the month** (not uniquely per calendar date); bookmarks and integrations should use env overrides for stable values.
- Additional slots (**`26` + DD + `2`…`9`**) are reserved for future dev processes if we extend the scheme.

---

## ADR-005 — In-repo docs, smoke tests, and pull requests

**Status:** Accepted (2026-03-29)

### Context

We need to **understand** evolving code and schema without spelunking only, and to **verify** behavior incrementally. We also want **`main`** to stay a sane integration line as the team grows.

### Decision

1. **API** — Expose a **`buildApp()`** factory (`app.ts`) so routes are testable without binding a TCP port; **`index.ts`** only listens.
2. **Documentation** — Per-app READMEs (`apps/api`, `apps/web`), JSDoc on `buildApp` and public routes, and **`///` field comments** on Prisma models.
3. **Tests** — **Vitest** in `apps/api`; first tests are **smoke** checks for `/api/health` and `/api/version`, named **`NFR-006-xx`** to match [test-plan.md](./test-plan.md).
4. **Traceability** — Maintain [traceability.md](./traceability.md) as features land.
5. **Git** — Prefer **feature branches + PRs** into `main`; document in [CONTRIBUTING.md](./CONTRIBUTING.md).

### Consequences

- Slightly more files (`app.ts` vs a single `index.ts`) in exchange for **fast, DB-free** API tests.
- PR discipline is **policy** until branch protection is enabled on the host.

---

## Index

| ADR | Title |
|-----|--------|
| ADR-001 | Traceability vs. building the application first |
| ADR-002 | Initial application shape (monorepo: web + API) |
| ADR-003 | Licensing (GPL-3.0-or-later, Brighter Sight Inc.) |
| ADR-004 | Dev server ports (`26` + calendar day + slot) |
| ADR-005 | In-repo docs, smoke tests, and pull requests |

---

## Related files

- [traceability.md](./traceability.md) — living map referenced in ADR-001.
- [dependencies.md](./dependencies.md) — packages, versions, and why (kept current with the lockfile).
- [LICENSE](./LICENSE), [NOTICE](./NOTICE) — legal text and project copyright (ADR-003).
- [CONTRIBUTING.md](./CONTRIBUTING.md) — PR workflow (ADR-005).
