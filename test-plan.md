# Can-sell — Test Plan

**References:** [Vision.md](./Vision.md), [requirements.md](./requirements.md).  
**Traceability:** Tests map to `FR-*` / `NFR-*` IDs from requirements.

---

## 1. Objectives

- Verify **functional** behavior for sellers, buyers, and auctions.  
- Validate **non-functional** qualities: security basics, responsiveness, critical path performance.  
- Provide **regression** safety for bid logic, AI review gates, and financial flows once live.

---

## 2. Test levels

| Level | Scope | Tools (examples) |
|-------|--------|------------------|
| **Unit** | Pure functions: bid validation, increment rules, price bands for similar sales | Jest, Vitest, pytest, Go test |
| **Integration** | API + DB: create sale, bid, close auction, idempotency | Same + test DB |
| **End-to-end (E2E)** | Browser flows: login, list item, bid, optional geolocation mocks | Playwright, Cypress |
| **Manual / exploratory** | UX edge cases, AR fallback devices, odd cameras | Checklists below |
| **Non-functional** | Load on auction close, security scans, a11y spot checks | k6/Locust, OWASP ZAP, axe |

---

## 3. Environments

| Environment | Purpose |
|-------------|---------|
| **Local** | Developer tests; seeded data |
| **CI** | Unit + integration on every PR; smoke E2E optional |
| **Staging** | Full E2E, demo data, feature flags |
| **Production** | Synthetic monitoring post-launch only (non-destructive) |

---

## 4. Functional test matrix (by requirement area)

### 4.1 Auth (FR-001–FR-003)

| ID | Cases |
|----|--------|
| FR-001 | Register, login, logout; invalid credentials rejected |
| FR-002 | Mutations without session rejected (401/403) |
| FR-003 | Seller A cannot edit Seller B’s sale; buyer cannot alter foreign bids |

### 4.2 Catalog and sales (FR-010–FR-013)

| ID | Cases |
|----|--------|
| FR-010 | Create sale with required fields; validation errors readable |
| FR-011 | Add items up to **255**; **256th** rejected with message |
| FR-012 | Upload image; mobile **camera** capture path on supported browser (manual or device farm) |
| FR-013 | If lots supported: create lot vs single item per model |

### 4.3 AI assist (FR-020–FR-022)

| ID | Cases |
|----|--------|
| FR-020 | AI returns suggestions when images present; handles timeout gracefully |
| FR-021 | Listing **does not** go live until seller **confirms** or saves edited copy |
| FR-022 | Disclaimer text present on AI-assisted fields |

### 4.4 Banana for scale (FR-030–FR-032)

| ID | Cases |
|----|--------|
| FR-030 | Seller can enable/reference flow; can skip |
| FR-031 | Estimates stored with **estimate** flag; extreme aspect ratios don’t crash |
| FR-032 | Buyer sees dimensions + **disclaimer** when enabled |

### 4.5 Auctions and bidding (FR-040–FR-044)

| ID | Cases |
|----|--------|
| FR-040 | Displayed end time matches server; clock skew messaging if any |
| FR-041 | Valid bid accepted; below minimum rejected; after end rejected |
| FR-042 | Proxy bid: documented scenarios (highest wins, increment rules) |
| FR-043 | Soft close: extension fires only per policy; no infinite extension bug |
| FR-044 | Winner and final price correct after close; tie-break per rules |

**Concurrency:** Two simultaneous bids near close—only one wins; no negative prices.

### 4.6 Discovery and geolocation (FR-050–FR-052)

| ID | Cases |
|----|--------|
| FR-050 | Search returns relevant results; empty state |
| FR-051 | With permission: location used; **without**: app still works |
| FR-052 | Public URLs resolve; meta basics for key pages |

### 4.7 Room preview (FR-060–FR-062)

| ID | Cases |
|----|--------|
| FR-060 | WebXR path on supported device (manual matrix) |
| FR-061 | Fallback works when WebXR unavailable |
| FR-062 | “Illustrative only” copy visible |

### 4.8 Similar sales (FR-070–FR-071)

| ID | Cases |
|----|--------|
| FR-070 | Shows comparables when data exists; hides or explains when sparse |
| FR-071 | UI explains matching (price band, category, etc.) |

### 4.9 Compliance (FR-080–FR-081)

| ID | Cases |
|----|--------|
| FR-080 | Blocked category cannot publish |
| FR-081 | Terms/location visible on checkout or bid confirmation per design |

---

## 5. Non-functional tests (NFR-*)

| ID | Approach |
|----|----------|
| NFR-001 | Resize viewports (e.g., 375×812, 1280×720); critical paths usable |
| NFR-002 | Define budgets in implementation; Lighthouse or RUM on LCP |
| NFR-003 | Auth: session fixation/hijack basics; upload: oversized/malicious file types |
| NFR-004 | Geolocation prompt only when feature used; deny path OK |
| NFR-005 | axe-core on main flows; keyboard navigation for bid + listing |
| NFR-006 | Structured logs for bid errors; alert on error rate spike |

---

## 6. Regression suite (minimum)

Run on every release candidate (automate where possible):

1. Login → create sale → add item with image → publish  
2. Second user → bid → auction closes → winner correct  
3. AI suggestion → **must confirm** before visible publicly  
4. FR-011 cap at 255  
5. Geolocation denied → browse still works  

---

## 7. Entry and exit criteria

| Gate | Criteria |
|------|----------|
| **MVP release** | All MVP rows in [requirements.md](./requirements.md) §5 covered by at least **integration** or **E2E**; no open **P0** bugs in auction/auth |
| **Phase 2 release** | FR-030–032, FR-060–062, FR-070–071 covered by tests + manual AR matrix |

---

## 8. Roles

| Role | Responsibility |
|------|----------------|
| **Developers** | Unit + integration; maintain E2E smoke |
| **QA / author** | Exploratory, device matrix, release sign-off |
| **Product** | Accepts UAT on staging |

---

## Document status

Update when requirements change; add test case IDs in your tracker (e.g., `TC-FR-041-01`) as automation grows.
