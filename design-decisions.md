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

- In **development**, default ports follow **`26` + two-digit calendar day (DD) + one digit (slot)**:
  - **Slot 0** — web (Vite).
  - **Slot 1** — API (Fastify).
- Example: the **29th** of the month → **26290** (web), **26291** (API).
- Override with **`VITE_PORT`**, **`VITE_API_PORT`** (proxy target in Vite), and **`PORT`** (API) when needed.

### Consequences

- Ports **change daily**; bookmarks and integrations should use env overrides for stable values.
- Additional slots (**`26` + DD + `2`…`9`**) are reserved for future dev processes if we extend the scheme.

---

## Index

| ADR | Title |
|-----|--------|
| ADR-001 | Traceability vs. building the application first |
| ADR-002 | Initial application shape (monorepo: web + API) |
| ADR-003 | Licensing (GPL-3.0-or-later, Brighter Sight Inc.) |
| ADR-004 | Dev server ports (`26` + calendar day + slot) |

---

## Related files

- [traceability.md](./traceability.md) — living map referenced in ADR-001.
- [dependencies.md](./dependencies.md) — packages, versions, and why (kept current with the lockfile).
- [LICENSE](./LICENSE), [NOTICE](./NOTICE) — legal text and project copyright (ADR-003).
