# Traceability (living)

Maps **requirement IDs** to tests and implementation notes. Grow this as features ship.

| Requirement | Test / evidence | Code / notes |
|-------------|-----------------|--------------|
| **NFR-006** | `tests/api/unit/app.test.ts` — `NFR-006-01`, `NFR-006-02` (Vitest) | `apps/api/src/app.ts` — `/health`, `/api/health`, `/api/version` |
| **FR-001** | `tests/api/unit/auth.test.ts` — `FR-001-01` … `FR-001-07` (needs PostgreSQL; see [tests/README.md](./tests/README.md)) | `apps/api/src/routes/auth.ts`, `apps/api/src/guard.ts`, `User` in `schema.prisma` |
| **FR-002** | `tests/api/unit/auth.test.ts` — `FR-001-06` (no token → 401 on `/api/auth/me`) | `requireAuth` in `guard.ts`; future mutations will use the same pattern |
| **FR-003** | *(partial)* — seller-scoped data enforced when sale/item routes exist | JWT `sub` = user id (`getUserId`); sale CRUD next |
| **FR-010** | *(pending)* — create sale API test | `schema.prisma` `Sale` (WIP) |

**See:** [requirements.md](./requirements.md), [test-plan.md](./test-plan.md), [design-decisions.md](./design-decisions.md), [CONTRIBUTING.md](./CONTRIBUTING.md).
