# Can-sell — Product Vision

## Executive summary

**Can-sell** is a multi-channel marketplace for sellers to photograph items, build a structured catalog (up to **255 items** per sale), and run **time-limited auctions** with buyer discovery and bidding flows comparable to established online auction experiences (e.g., eBay-style bidding). The product leans on **AI-assisted identification and copy** to reduce friction for sellers and to produce clearer, more inviting listings. Delivery surfaces: **web first**, **Android**, with **Apple** planned.

This document grounds the vision in how **MaxSold** and adjacent platforms operate, then states what we aim to build and how we intend to differentiate.

---

## Market context: MaxSold and similar platforms

### MaxSold (primary reference)

[MaxSold](https://maxsold.com/) positions itself around **estate liquidation and large clear-outs**, combining **online auctions** with operational patterns tuned to physical goods and local pickup.

Observed patterns relevant to our product:

| Theme | How MaxSold frames it |
|--------|------------------------|
| **Seller-managed flow** | Sellers can run auctions themselves using tools for **lot setup**, **catalog creation with photos and descriptions**, **auction timing**, **live bidding**, and a **preset pickup day** to simplify coordination. ([Seller-managed overview](https://maxsold.com/sm)) |
| **Lots vs. single items** | Items are often **grouped into lots** to drive competition and simplify pickup; our vision explicitly includes single-item and multi-item structures—**catalog cap of 255** is our constraint. |
| **Marketing to buyers** | Emphasis on **exposure to local/regional bidders** and platform-led promotion of sales. |
| **Commercial model (public)** | Seller-managed fees are described as **30% of auction proceeds or a minimum fee**, with **no reserves or minimum bids** on that path—useful as a **benchmark**, not a prescription for Can-sell. |

**Takeaway for Can-sell:** The “estate sale / liquidation auction” segment values **fast cataloging**, **clear pickup semantics**, and **trust** (payments, dispute expectations, prohibited items). Our AI-assisted pipeline targets the **cataloging and storytelling** step where sellers often struggle.

### Comparable and adjacent platforms

These illustrate alternative positioning; none is a blueprint, but each informs feature expectations:

| Platform / category | Role in the landscape |
|----------------------|------------------------|
| **[Executor](https://www.goexecutor.com/)** | Estate-sale oriented marketplace; stresses curated experience and guidance—shows demand for **human + structured** selling flows. |
| **[CTBIDS](https://www.ctbids.com/)** (Caring Transitions) | National estate-sale auctions with mobile apps; strong **category/location discovery** and **$1 start** style mechanics in many sales. |
| **[AuctionZip](https://www.auctionzip.com/)** | Broad auction aggregator; illustrates **scale of inventory**, **search by geography**, and **many independent auctioneers**—relevant for **buyer discovery** patterns. |
| **[BidStream](https://www.thebidstream.com/)** (and similar B2B tools) | Software for **professional auctioneers**: bulk cataloging, reporting, **pickup scheduling**—informs **operator-grade** backlog if we ever serve pros. |
| **eBay (and general C2C marketplaces)** | De facto reference for **proxy bidding**, **sniping protections**, **watch lists**, **seller ratings**, and **structured checkout**—our auction UX should feel familiar to buyers who have used those patterns. |

**Takeaway:** Buyers expect **search, filters, trust signals, and predictable auction rules**. Sellers expect **speed to list** and **simple post-sale logistics**. Can-sell’s bet is **AI-accelerated catalog quality** plus a **255-item ceiling** that keeps sales **scoped and manageable** for individuals and small sellers.

---

## Problem we are solving

1. **Listing is slow and uneven** — Photos alone are not enough; weak titles and descriptions reduce bids.
2. **Discovery is hard for one-off sellers** — Without marketing and browseable inventory, auctions underperform.
3. **Auction mechanics are intimidating** — Reserve prices, bid increments, pickup windows, and payments must be **clear and consistent** across web and mobile.

---

## Product vision

**Can-sell** is the place where a seller can **capture**, **understand**, and **present** up to **255 items** in a single sale, and where buyers can **discover**, **bid**, and **complete purchases** through flows aligned with mainstream online auctions.

### Pillars

1. **Capture** — Mobile-first photography workflows (Android first; iOS later), with web support for batch review and editing.
2. **Understand (AI)** — Assist with **item recognition**, **attributes** (brand, era, category), and **inviting, accurate descriptions**; human review before publish remains central to trust.
3. **Catalog** — Structured inventory per sale, **hard cap of 255 items**, support for **single-item listings** and **grouped lots** where product rules allow.
4. **Reach** — Tools and channels to **advertise sales** to buyers (SEO, shareable links, notifications, and optional paid promotion—exact mix TBD).
5. **Transact** — **Auction** with eBay-like familiarity: timed end, bid increments, optional proxy/max bids, anti-sniping extensions (policy TBD), clear **winner obligations** and **pickup/shipping** rules.

### Platform scope

| Surface | Intent |
|---------|--------|
| **Web** | Full seller and buyer journeys; catalog review; admin and support views. |
| **Android** | Primary capture device for sellers; buyer bidding and notifications. |
| **Apple (iOS)** | Parity with Android after core flows stabilize on web + Android. |

---

## Target users

| Segment | Needs |
|---------|--------|
| **Individual sellers** | Downsizing, moving, estate leftovers; need speed and low cognitive load. |
| **Small businesses / flippers** | Repeat listings; care about throughput and consistent item data. |
| **Buyers** | Deal discovery, trust, simple bidding, and clear pickup/shipping terms. |

---

## Differentiation (intended)

| Area | Direction |
|------|-----------|
| **AI-assisted listing** | Stronger default titles/descriptions and structured attributes vs. manual-only competitors. |
| **Bounded catalog size** | **255 items** keeps sales **focused** and may simplify operations, search, and support. |
| **Modern multi-platform** | Web + native mobile from the roadmap, not as an afterthought. |
| **Transparent auction rules** | Borrow proven patterns (e.g., eBay-like bidding) while tailoring pickup/settlement to physical goods. |

---

## Out of scope (for early vision — subject to change)

- Full **white-label auctioneer ERP** (a la some BidStream-style stacks) unless we explicitly pivot B2B.
- **Unlimited** inventory per sale (we standardize on **≤255**).
- **Guaranteed** AI accuracy — AI is **assistive**; sellers confirm details before publish.

---

## Success measures (initial)

- **Seller:** time from first photo to published catalog; sell-through rate; repeat sellers.
- **Buyer:** registration-to-bid conversion; bid participation; post-sale completion rate.
- **Platform:** dispute rate; NPS or CSAT; cost to serve per sale.

---

## Risks and compliance (non-exhaustive)

- **Prohibited and regulated items** — Every marketplace needs clear policies (compare industry “do not sell” lists).
- **Payment and settlement** — Escrow, chargebacks, and local regulations vary by region.
- **AI claims** — Descriptions must not **misrepresent** condition or authenticity; disclosures and seller attestation may be required.

---

## References (external)

- MaxSold seller-managed overview: https://maxsold.com/sm  
- MaxSold fees (verify current terms before any commercial use): https://maxsold.com/fees  
- Executor: https://www.goexecutor.com/  
- CTBIDS: https://www.ctbids.com/  
- AuctionZip: https://www.auctionzip.com/  
- BidStream: https://www.thebidstream.com/  

---

## Document status

**Living document.** Competitive offerings and fee models change; revisit this vision when scoping MVP, pricing, and regional launch.
