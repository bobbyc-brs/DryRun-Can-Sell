# Traceability (living)

Maps **requirement IDs** to tests and implementation notes. Grow this as features ship.

| Requirement | Test / evidence | Code / notes |
|-------------|-----------------|--------------|
| **NFR-006** | `tests/api/unit/app.test.ts` — `NFR-006-01`, `NFR-006-02` (Vitest) | `apps/api/src/app.ts` — `/health`, `/api/health`, `/api/version` |
| **FR-001–003** | *(pending)* — register/login + JWT routes | `guard.ts`, `schema.prisma` `User` (WIP) |
| **FR-010** | *(pending)* — create sale API test | `schema.prisma` `Sale` (WIP) |

**See:** [requirements.md](./requirements.md), [test-plan.md](./test-plan.md), [design-decisions.md](./design-decisions.md), [CONTRIBUTING.md](./CONTRIBUTING.md).
