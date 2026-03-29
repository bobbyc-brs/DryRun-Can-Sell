# Contributing

Copyright (C) 2026 Brighter Sight Inc. Licensed under GPL-3.0-or-later (see [LICENSE](./LICENSE)).

## Pull requests instead of pushing to `main`

For anything beyond trivial doc typos, use **short-lived branches** and **pull requests** into `main`:

1. `git checkout -b feature/short-description` (or `fix/…`, `chore/…`).
2. Commit in logical chunks with clear messages.
3. Open a **PR** on GitHub; describe *what* changed and *why*.
4. Prefer **squash merge** or **merge commit** per team taste; keep history readable.

**Why:** `main` stays releasable, changes get a review trail, and CI (when added) can gate merges.

Direct pushes to `main` are OK for **solo** hotfixes if you accept the risk; as soon as more than one person touches the repo—or you care about audit—default to PRs.

## Checks before you open a PR

```bash
npm install
npm run build
npm run test -w api
npm run lint -w web
```

Add API tests when you add routes; name them with **`FR-xxx`** or **`NFR-xxx`** prefixes where they map to [requirements.md](./requirements.md).

Update [traceability.md](./traceability.md) when new automated tests cover a requirement.

## Docs to keep in sync

| Change | Update |
|--------|--------|
| New Prisma models/fields | `///` comments in `schema.prisma` + this API README if public behavior changes |
| New routes | JSDoc on handlers in `app.ts` (or route modules) + `apps/api/README.md` table |
| New product rules | [requirements.md](./requirements.md) first, then tests |
