# Can-sell — High Level Design (HLD)

**Copyright (C) 2026 Brighter Sight Inc.** Licensed under GPL-3.0-or-later.

This document summarizes **architecture**, a **logical data model** (as implemented and as planned), and **typical interaction flows**. It complements [Vision.md](./Vision.md), [requirements.md](./requirements.md), and [design-decisions.md](./design-decisions.md).

**Status:** Living document. The codebase today implements **User** / **Sale** in the database and **health/version** routes on the API; diagrams labeled *planned* describe the target product.

---

## 1. System context

```mermaid
flowchart LR
  subgraph clients["Clients"]
    B[Browser / mobile web]
  end

  subgraph cansell["Can-sell platform"]
    W[Web SPA — Vite + React]
    A[API — Fastify + TypeScript]
    D[(PostgreSQL)]
    O[Object storage — planned]
  end

  subgraph external["External services — planned / optional"]
    AI[AI vendor — vision + text]
    PAY[Payment provider]
    GEO[Browser geolocation API]
  end

  B --> W
  W -->|HTTPS /api| A
  A --> D
  A -.->|uploads| O
  A -.->|FR-020| AI
  A -.->|settlement| PAY
  B -.->|FR-051| GEO
```

---

## 2. Component view (logical)

| Component | Responsibility |
|-----------|----------------|
| **Web SPA** | Responsive UI: seller listing wizard, buyer browse/bid, progressive use of camera, geolocation, WebXR where available ([Vision.md](./Vision.md)). |
| **API** | Auth, sales/catalog, auctions/bids, AI orchestration, media URLs, business rules (e.g. **≤255** items per sale — FR-011). |
| **PostgreSQL** | System of record via Prisma ([schema](./apps/api/prisma/schema.prisma)). |
| **Object storage** *(planned)* | Listing images, room-preview assets. |
| **AI vendor** *(planned)* | Suggest category, attributes, copy from images (FR-020–022). |

Deployment is **web-only** for v1 (no native store apps). Dev ports follow **ADR-004** (`26` + DD + slot).

---

## 3. Data model — class diagrams

### 3.1 Implemented persistence (Prisma)

Reflects the current [schema.prisma](./apps/api/prisma/schema.prisma).

```mermaid
classDiagram
  direction TB

  class User {
    +String id
    +String email
    -String passwordHash
    +DateTime createdAt
    +DateTime updatedAt
  }

  class Sale {
    +String id
    +String title
    +String sellerId
    +DateTime createdAt
    +DateTime updatedAt
  }

  User "1" --> "*" Sale : owns
```

### 3.2 Target domain (conceptual — planned entities)

Extends the model toward [requirements.md](./requirements.md) (items, auctions, bids, media, AI jobs). **Not all tables exist yet**; names are indicative.

```mermaid
classDiagram
  direction TB

  class User {
    +String id
    +String email
  }

  class Sale {
    +String id
    +String title
    +String timezone
    +pickupRules
  }

  class Item {
    +String id
    +String title
    +String description
    +int sortOrder
  }

  class Lot {
    +String id
    +String title
  }

  class MediaAsset {
    +String id
    +String url
    +bool referenceForScale
  }

  class Auction {
    +DateTime startAt
    +DateTime endAt
    +Money minIncrement
    +Money currentHighBid
  }

  class Bid {
    +String id
    +Money amount
    +DateTime placedAt
    +bool proxyMax
  }

  class AiSuggestionJob {
    +String status
    +JSON suggestedAttributes
  }

  User "1" --> "*" Sale : creates
  Sale "1" --> "*" Item : contains
  Sale "1" --> "*" Lot : contains
  Item "1" --> "*" MediaAsset
  Lot "1" --> "*" MediaAsset
  Sale "1" --> "0..1" Auction : schedules
  Auction "1" --> "*" Bid : receives
  User "1" --> "*" Bid : places
  Item ..> AiSuggestionJob : triggers
```

**Notes**

- **FR-011:** enforce **≤255** `Item`/`Lot` rows (or equivalent) per `Sale` in the API.
- **Single-item vs grouped lot (FR-013):** may be modeled as `Item` vs `Lot` or a discriminated type; diagram shows both for clarity.

---

## 4. Sequence diagrams — typical use cases

### 4.1 Seller registration and sign-in (FR-001, FR-002)

*Planned flow once auth routes are implemented.*

```mermaid
sequenceDiagram
  autonumber
  actor Seller as Seller (browser)
  participant SPA as Web SPA
  participant API as API
  participant DB as PostgreSQL

  Seller->>SPA: Enter email + password (register)
  SPA->>API: POST /api/auth/register
  API->>API: Hash password (e.g. bcrypt)
  API->>DB: INSERT User
  DB-->>API: user id
  API-->>SPA: 201 + optional session/JWT
  SPA-->>Seller: Confirm account

  Seller->>SPA: Sign in
  SPA->>API: POST /api/auth/login
  API->>DB: SELECT User by email
  API->>API: Verify hash, issue JWT/session
  API-->>SPA: Token + user summary
  SPA-->>Seller: Authenticated home
```

### 4.2 Create a sale (FR-010, FR-003)

```mermaid
sequenceDiagram
  autonumber
  actor Seller as Seller
  participant SPA as Web SPA
  participant API as API
  participant DB as PostgreSQL

  Seller->>SPA: Open “New sale”, enter title + logistics
  SPA->>API: POST /api/sales (Authorization: Bearer JWT)
  API->>API: requireAuth, resolve seller id = sub
  API->>DB: INSERT Sale(sellerId, title, …)
  DB-->>API: sale id
  API-->>SPA: 201 + Sale JSON
  SPA-->>Seller: Sale created
```

### 4.3 Add catalog item with AI assist (FR-020–022)

*Human-in-the-loop: nothing published until seller confirms.*

```mermaid
sequenceDiagram
  autonumber
  actor Seller as Seller
  participant SPA as Web SPA
  participant API as API
  participant DB as PostgreSQL
  participant AI as AI service

  Seller->>SPA: Upload photos + optional hints
  SPA->>API: POST /api/sales/:id/items/draft (multipart)
  API->>API: Store media refs (object storage)
  API->>AI: Request labels / attributes / draft copy
  AI-->>API: Suggestions (not public)
  API->>DB: Save draft Item + suggestion payload
  API-->>SPA: Draft + disclaimer (FR-022)
  SPA-->>Seller: Review / edit / discard

  Seller->>SPA: Confirm listing fields
  SPA->>API: PATCH /api/items/:id (publish)
  API->>DB: Mark visible, clear draft-only flags
  API-->>SPA: Published item
```

### 4.4 Buyer discovers sale and places a bid (FR-050, FR-041, FR-040)

```mermaid
sequenceDiagram
  autonumber
  actor Buyer as Buyer
  participant SPA as Web SPA
  participant API as API
  participant DB as PostgreSQL

  Buyer->>SPA: Search / browse (optional geolocation FR-051)
  SPA->>API: GET /api/sales?query&region
  API->>DB: Query published sales / items
  DB-->>API: Results
  API-->>SPA: JSON listings
  SPA-->>Buyer: Show sale detail + auction state

  Buyer->>SPA: Enter bid amount
  SPA->>API: POST /api/auctions/:id/bids (JWT)
  API->>API: Validate amount, time window, increments (FR-040)
  API->>DB: Transaction: insert Bid, update high bid
  DB-->>API: OK
  API-->>SPA: 201 + updated auction state
  SPA-->>Buyer: Bid accepted or error message
```

### 4.5 Auction soft-close and winner (FR-043, FR-044)

```mermaid
sequenceDiagram
  autonumber
  participant Clock as Scheduler / job
  participant API as API
  participant DB as PostgreSQL
  actor Buyer as Winning buyer

  Note over Clock,DB: Near scheduled end, bid arrives (FR-043)
  Buyer->>API: POST bid (last seconds)
  API->>DB: Detect need for extension
  API->>DB: UPDATE Auction.endAt += softCloseWindow
  API-->>Buyer: Ack + new end time (documented policy)

  Note over Clock,DB: After true end
  Clock->>API: closeAuction(auctionId)
  API->>DB: Lock row, compute winner, final price
  API->>DB: INSERT outcome / notify queue
  API-->>Clock: OK

  Note over Buyer: Settlement (payment) TBD — FR-081
```

### 4.6 “How will this look in my room” (FR-060, FR-061)

```mermaid
sequenceDiagram
  autonumber
  actor Buyer as Buyer
  participant SPA as Web SPA
  participant API as API
  participant XR as WebXR / canvas

  Buyer->>SPA: Open room preview on listing
  alt WebXR supported (FR-060)
    SPA->>XR: Start AR session, place model
    XR-->>Buyer: Illustrative preview (FR-062 disclaimer)
  else Fallback (FR-061)
    Buyer->>SPA: Upload room photo
    SPA->>API: POST composite job or client-side overlay
    API-->>SPA: Preview asset URL (optional)
    SPA-->>Buyer: Composite preview + disclaimer
  end
```

### 4.7 Similar sales at a price (FR-070, FR-071)

```mermaid
sequenceDiagram
  autonumber
  actor User as Buyer or seller
  participant SPA as Web SPA
  participant API as API
  participant DB as PostgreSQL

  User->>SPA: View item or pricing helper
  SPA->>API: GET /api/similar-sales?priceBand&category
  API->>DB: Query closed auctions / realized prices
  DB-->>API: Comparable rows (minimum data rules)
  API-->>SPA: List + short explanation of match rules (FR-071)
  SPA-->>User: Benchmark panel
```

---

## 5. Security and trust (summary)

| Topic | Design intent |
|--------|----------------|
| **Auth** | JWT or session for FR-002; HTTPS in production. |
| **Authorization** | Seller scoped to own `Sale` / items (FR-003); bid rules prevent tampering with others’ bids. |
| **AI** | Suggestions never auto-published (FR-021); seller attestation where required. |
| **Privacy** | Geolocation only with consent (FR-004 / FR-051). |

---

## 6. Related artifacts

| Artifact | Role |
|----------|------|
| [implementation-plan.md](./implementation-plan.md) | Phased delivery |
| [test-plan.md](./test-plan.md) | Verification by FR/NFR |
| [traceability.md](./traceability.md) | Requirement ↔ test ↔ code |
| [apps/api/README.md](./apps/api/README.md) | Current API surface |

---

## Document history

| Date | Change |
|------|--------|
| 2026-03-29 | Initial HLD with Mermaid class + sequence diagrams |
