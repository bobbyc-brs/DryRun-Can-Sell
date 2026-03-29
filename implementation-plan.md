# Can-sell — Implementation Plan

**References:** [Vision.md](./Vision.md), [requirements.md](./requirements.md).

This plan proposes **phases**, **technical building blocks**, and **dependencies**. Stack choices are **defaults** until the team locks them; swap equivalents where justified.

---

## 1. Guiding principles

- **Web-only:** one primary client (responsive SPA or hybrid SSR) targeting modern browsers.
- **API-first:** separate backend so future native clients are possible without rewriting core logic.
- **Human-in-the-loop AI:** server-side orchestration of model calls; never auto-publish AI text.
- **Progressive enhancement:** camera, geolocation, WebXR, and file upload degrade clearly when unsupported.

---

## 2. Phased roadmap

### Phase 0 — Foundation (weeks 1–2, indicative)

| Deliverable | Notes |
|-------------|--------|
| Repository layout, CI, lint/format, env config | Monorepo or single repo—team choice. |
| **Auth** scaffolding | Sessions/JWT/OAuth—match FR-001–003. |
| **Database** schema v0 | Users, sales, items/lots, images, auctions, bids (minimal). |
| **Deployment** to staging | Container or PaaS; secrets management. |

**Exit criteria:** Deployed “hello” app with auth smoke test and DB migrations.

---

### Phase 1 — MVP marketplace + listings

| Deliverable | Requirements |
|-------------|----------------|
| Seller: create sale, add items up to **255**, images (upload + mobile camera) | FR-010–FR-013 |
| AI listing assist (async job + review UI) | FR-020–FR-022 |
| Public browse + search/filter (basic) | FR-050, FR-052 (partial) |
| Auction: timed end, open bids, winner + final price recorded | FR-040–FR-041, FR-044 (settlement stub OK) |
| Geolocation optional for discovery | FR-051 |

**Exit criteria:** End-to-end “list → publish → bid → close” in staging with test accounts.

---

### Phase 2 — Differentiators and trust

| Deliverable | Requirements |
|-------------|----------------|
| **Banana for scale:** calibration UX, dimension estimate pipeline, disclaimers | FR-030–FR-032 |
| **Room preview:** WebXR path + photo fallback | FR-060–FR-062 |
| **Similar sales:** query closed auctions by price band + rules | FR-070–FR-071 |
| Proxy/max bid + anti-sniping (if not in MVP) | FR-042–FR-043 |
| Prohibited-items checks | FR-080 |

**Exit criteria:** Feature-flagged or full rollout per risk review; documented user-facing behavior.

---

### Phase 3 — Hardening and growth

| Deliverable | Notes |
|-------------|--------|
| Real **payments** integration | Replace stubs; align with FR-081. |
| SEO, share cards, email/push (if any) | FR-052 depth |
| Admin moderation | As needed for production |
| Performance and accessibility pass | NFR-002, NFR-005 |

---

## 3. Suggested architecture (logical)

```
[Browser: React/Vue/Svelte + responsive CSS]
        |
        v
[API layer: REST or GraphQL]  <-->  [Auth service / middleware]
        |
        +--> [Auction engine service]  (bid validation, close, extensions)
        |
        +--> [AI orchestration]  (image -> suggestions; store draft + version)
        |
        +--> [Media pipeline]  (upload -> storage -> thumbnails)
        |
        +--> [Search index]  (Postgres FTS or Meilisearch/Elastic later)
        |
        v
[PostgreSQL] + [Object storage (S3-compatible)]
```

- **Auction-critical paths** should be **transactional** (single source of truth for high bid and close).
- **AI calls** asynchronous where latency is high; show job status in UI.

---

## 4. Workstreams (parallelizable)

| Stream | Owner focus | Depends on |
|--------|-------------|------------|
| **Frontend** | Seller wizard, buyer auction UI, responsive layouts | API contracts |
| **Backend** | Domain model, auctions, bids | DB, auth |
| **Media** | Uploads, virus/size limits, CDN | Object storage |
| **AI** | Prompting, schema for attributes, guardrails | Media URLs |
| **Infra** | CI/CD, staging/prod, secrets | — |
| **Banana / CV** | Reference detection or manual tagging + geometry | Media |
| **Room / AR** | WebXR prototype + fallback compositor | 3D assets or 2D overlay |

---

## 5. Technology defaults (non-binding)

| Concern | Suggested options |
|---------|-------------------|
| Frontend | TypeScript, component framework with strong a11y story |
| API | Node (Nest/Fastify), Python (FastAPI), or Go—team preference |
| DB | PostgreSQL |
| Cache / jobs | Redis for sessions, rate limits, job queues |
| AI | Vendor API (vision + text) with **PII-safe** image handling |
| Hosting | Managed Postgres + object storage + container host |

---

## 6. Dependencies and risks

| Risk | Mitigation |
|------|------------|
| WebXR limited adoption | Ship **fallback** first in UX design (FR-061). |
| AI cost / rate limits | Cache by image hash; batch; cap free tier. |
| Auction race conditions | Serialize bid handling; use DB constraints or dedicated service. |
| Banana accuracy | Clear **estimate** copy; optional manual dimension override. |

---

## 7. Milestone checklist (copy for project board)

- [ ] Phase 0 complete  
- [ ] MVP bid path complete (Phase 1)  
- [ ] AI review UX signed off  
- [ ] Phase 2 differentiators behind flags  
- [ ] Payments live (Phase 3)  
- [ ] Launch readiness review (security, privacy, support)  

---

## Document status

Update this plan when phases slip or scope changes; keep **requirements IDs** in sync in [requirements.md](./requirements.md).
