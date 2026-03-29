# Can-sell — Requirements

**Source of truth for product intent:** [Vision.md](./Vision.md).  
**Traceability:** requirement IDs (`FR-*`, `NFR-*`) are referenced in [test-plan.md](./test-plan.md).

---

## 1. Scope and assumptions

| Item | Description |
|------|-------------|
| **Product** | Web application (responsive desktop and mobile browsers). |
| **Out of scope (v1)** | Native iOS/Android store apps; unlimited items per sale; guaranteed AI accuracy. |
| **Catalog limit** | **255** items (or lots, per product rules) per sale, enforced in UI and server. |

---

## 2. User roles

| Role | Capabilities (high level) |
|------|---------------------------|
| **Guest** | Browse public listings/sales where policy allows; register or sign in to bid. |
| **Buyer** | Search, watch, bid, use buyer tools (e.g., room preview, similar sales); complete purchase per policy. |
| **Seller** | Create/manage sales and listings; photos; AI assist; optional banana-for-scale; set auction parameters and logistics fields. |
| **Admin** (future / as needed) | Moderation, prohibited items, disputes, configuration. |

*Exact authentication model (email, OAuth, etc.) is an implementation decision.*

---

## 3. Functional requirements

### 3.1 Identity, sessions, and authorization

| ID | Requirement |
|----|-------------|
| FR-001 | Users can **register** and **sign in** and **sign out**. |
| FR-002 | Actions that mutate data (bids, listings, profile) require an **authenticated** session (or equivalent secure mechanism). |
| FR-003 | **Sellers** can only create/edit **their own** sales and items; **buyers** cannot alter others’ bids beyond allowed auction rules. |

### 3.2 Sales and catalog

| ID | Requirement |
|----|-------------|
| FR-010 | A **seller** can create a **sale** (auction event) with metadata needed for scheduling and logistics (e.g., title, description, **pickup window** or rules, timezone). |
| FR-011 | A **seller** can add **items or lots** to a sale up to **255** total; the system **rejects** additional adds with a clear message. |
| FR-012 | A **seller** can attach **one or more images** per item/lot; support **camera capture** and **file upload** on supported browsers. |
| FR-013 | **Single-item** and **grouped lot** listing types are supported if/when defined in the data model (vision allows both). |

### 3.3 AI-assisted identification and copy

| ID | Requirement |
|----|-------------|
| FR-020 | From listing images (and optional seller hints), the system can request **AI-derived** suggestions: **category**, **likely attributes** (e.g., brand/era where applicable), and **draft title/description**. |
| FR-021 | **No AI output is published** without **explicit seller review** and **confirm/edit** (or discard) actions. |
| FR-022 | UI surfaces that AI suggestions are **assistive** and may be **wrong**; seller attestation of accuracy where required by policy. |

### 3.4 Banana for scale

| ID | Requirement |
|----|-------------|
| FR-030 | **Seller** can mark a photo as using a **reference object** (e.g., banana) and/or follow guided capture for scale. |
| FR-031 | System derives **estimated dimensions** (or size class) from image + reference assumption, and stores **display values** with **disclaimer** that values are **estimates**. |
| FR-032 | **Buyers** see estimated dimensions/disclaimer on the listing when available. |

### 3.5 Auctions and bidding (eBay-like core)

| ID | Requirement |
|----|-------------|
| FR-040 | Each auction has defined **start**, **end**, **currency**, **minimum bid increment** (or rule to derive it), and visibility of **current price** / high bid state appropriate to the auction model. |
| FR-041 | **Authenticated buyers** can place **bids** subject to validation (amount, timing, sale rules). |
| FR-042 | Support **proxy / max bid** behavior if specified in auction rules (implementation must match documented behavior). |
| FR-043 | **Anti-sniping** (e.g., soft close extension) is **configurable per sale or platform policy**; behavior must be **documented to users** before bidding. |
| FR-044 | At auction end, system records **winning bidder** and **final price** for settlement workflow (exact payment integration TBD). |

### 3.6 Discovery, marketing, and locality

| ID | Requirement |
|----|-------------|
| FR-050 | **Buyers** can **search and filter** listings/sales (e.g., category, text, region if available). |
| FR-051 | With **user permission**, the app may use **browser geolocation** to improve **local** ranking or distance display; **degrade gracefully** if denied or unavailable. |
| FR-052 | **Shareable URLs** and basic **SEO-friendly** public pages for discoverable content (policy-dependent). |

### 3.7 Buyer: “How will this look in my room”

| ID | Requirement |
|----|-------------|
| FR-060 | On supported devices/browsers, **buyer** can launch a **room visualization** experience (e.g., **WebXR** path). |
| FR-061 | **Fallback** when AR/WebXR is unavailable: e.g., **upload a room photo** and composite or place asset per feasible UX—exact interaction TBD but **must not** hard-require AR. |
| FR-062 | Preview is **non-binding** and labeled as **illustrative** (lighting, color, scale). |

### 3.8 Similar sales

| ID | Requirement |
|----|-------------|
| FR-070 | System can show **other completed sales** at the **same realized price** (or nearest band), subject to **minimum data** and **privacy** rules (e.g., no misleading matches). |
| FR-071 | **Matching rules** (category, condition, region) are **documented** or explained at a high level in UI to set expectations. |

### 3.9 Compliance and trust (product-level)

| ID | Requirement |
|----|-------------|
| FR-080 | **Prohibited items** policy is available; listing flow **warns or blocks** per policy. |
| FR-081 | **Payment and pickup/shipping** terms are visible to buyers **before** binding bid where regulations require clarity (exact legal copy TBD). |

---

## 4. Non-functional requirements

| ID | Requirement |
|----|-------------|
| NFR-001 | **Responsive UI** usable on **mobile** and **desktop** viewports defined in the test plan. |
| NFR-002 | **Performance:** core listing and auction pages meet agreed targets (e.g., LCP budget—set during implementation). |
| NFR-003 | **Security:** industry-standard practices for **auth**, **sessions**, **CSRF** where applicable, **input validation**, and **file upload** constraints. |
| NFR-004 | **Privacy:** geolocation used only with **consent**; clear **privacy notice** for data use. |
| NFR-005 | **Accessibility:** WCAG target level agreed for MVP (e.g., 2.1 AA for primary flows—confirm in implementation). |
| NFR-006 | **Observability:** logging and metrics sufficient to debug bid failures, AI errors, and checkout issues. |

---

## 5. Prioritization (suggested)

| Tier | Includes |
|------|----------|
| **MVP** | FR-001–003, FR-010–013, FR-020–022, FR-040–044 (minimal auction), FR-050–052 (basic discovery), NFR-001, NFR-003–004, core NFR-006. |
| **v1+** | FR-030–032, FR-060–062, FR-070–071, FR-080–081, proxy/anti-sniping as fully specified, NFR-002, NFR-005. |

*Priorities may be adjusted without changing IDs; update this table when they do.*

---

## 6. Open decisions (to resolve before build)

- Payment provider and **escrow** vs immediate charge.
- Exact **auction** rules: increments, reserves, soft-close length.
- **Similar sales** thresholds: minimum comparables, regional scope.
- **Banana for scale**: single reference type vs configurable object; unit system (metric/imperial).

---

## Document status

Living document. Changes should stay consistent with [Vision.md](./Vision.md).
