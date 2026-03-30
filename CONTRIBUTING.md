# Contributing

Copyright (C) 2026 Brighter Sight Inc. Licensed under GPL-3.0-or-later (see [LICENSE](./LICENSE)).

## Pull requests instead of pushing to `main`

For anything beyond trivial doc typos, use **short-lived branches** and **pull requests** into `main`:

1. `git checkout -b feature/short-description` (or `fix/…`, `chore/…`).
2. Commit in logical chunks with clear messages.
3. Open a **PR** on GitHub; describe *what* changed and *why*.
4. Prefer **squash merge** or **merge commit** per team taste; keep history readable.

**Why:** `main` stays releasable, changes get a review trail, and **CI** (GitHub Actions on push/PR to `main`, see [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) runs **`npm run verify`** against a PostgreSQL service.

Direct pushes to `main` are OK for **solo** hotfixes if you accept the risk; as soon as more than one person touches the repo—or you care about audit—default to PRs.

## Checks before you open a PR

```bash
npm install
npm run verify
```

`verify` runs **`build`** (web + api), **`test`** (Vitest), and **`lint`** (web ESLint)—same as the **pre-push** hook. **`DATABASE_URL`** must point at a migrated PostgreSQL instance for **FR-001** API auth tests (see [tests/README.md](./tests/README.md)); CI provides Postgres automatically.

## Git hooks (Husky)

After **`npm install`** (runs the `prepare` script), [Husky](https://typicode.github.io/husky/) sets `core.hooksPath` to `.husky/_` and runs hooks defined beside it (e.g. [`.husky/pre-push`](./.husky/pre-push)).

| Hook | What runs | Why |
|------|-----------|-----|
| **`pre-push`** | `npm run verify` | Stops broken builds, failing tests, or lint errors from reaching GitHub. |

**Skip when you must** (emergency push, WIP branch): `git push --no-verify`, or `HUSKY=0 git push`. Use sparingly.

**Optional later:** add **`pre-commit`** with [lint-staged](https://github.com/lint-staged/lint-staged) to ESLint/format only staged files—faster feedback than waiting for push. The pre-push hook stays the **full** gate.

Add API tests when you add routes; name them with **`FR-xxx`** or **`NFR-xxx`** prefixes where they map to [requirements.md](./requirements.md).

Update [traceability.md](./traceability.md) when new automated tests cover a requirement.

## Docs to keep in sync

| Change | Update |
|--------|--------|
| New Prisma models/fields | `///` comments in `schema.prisma` + this API README if public behavior changes |
| New routes | JSDoc on handlers in `app.ts` (or route modules) + `apps/api/README.md` table |
| New product rules | [requirements.md](./requirements.md) first, then tests |
