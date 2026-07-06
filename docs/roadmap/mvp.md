# DealPilot — MVP Definition (Months 1–6)
Status: Approved · Owner: CEO + CTO jointly · Companions: `../product/prd.md` (requirements), `../product/roadmap.md` (timeline), `v1.md` (what comes next).

## 1. MVP Thesis (what this release must prove)

One sentence: **an individual RE investor will pay monthly for verification that refuses to guess.** Everything in scope serves that proof; everything else waits. Two sub-hypotheses: (H1) refusal-first output *increases* trust and willingness-to-pay vs fluent-but-unverified alternatives; (H2) the close-the-unknowns loop creates weekly habit. The MVP is an experiment with a P&L, not a small product.

## 2. In Scope (walking skeleton mo 1–3 → private beta mo 4–6)

| Area | MVP scope |
|---|---|
| Wedge | US residential-investment RE, **one metro market** initially (evidence-source depth beats breadth for the proof) |
| Ingest | listing URL + PDF upload (≤ 50 pages); single deal at a time |
| Claims | top-12 RE claim types (price, NOI/rent, sqft, taxes, liens, year built, occupancy, HOA, zoning, flood, permits, comps-basis) — covering ~85% of decision weight per corpus analysis |
| Evidence | 3 source adapters: county records/assessor (tier A), MLS-adjacent commercial feed (tier B), one rental-comp source (tier B); **fallback map per blocking claim type** (`../architecture/evidence-fallback-map.md` — the actual matrix) — no blocking type may depend on a single source without a documented manual-evidence path |
| Adjudication | full status vocabulary + rubric v1; auto-verification target ≥ 60% (v1 raises to 70%) |
| Valuation | range + drivers **with REFUSED state live from day one** (the doctrine ships in the MVP or it never truly ships) |
| Memo | cited memo + status glyph UI + close-the-unknowns worklist (flows F1, F3 from `../product/ux.md`) |
| Ledger | hash-chained events + export + **OSS offline verifier v0** (public repo at beta — trust artifact is launch-blocking, not post-launch polish) |
| Billing | Stripe: Analyst plan + credit consumption + top-ups (Free tier gated behind v1 — beta is paid-intent only) |
| HITL | reviewer queue (internal), attestation events |
| Distribution | 25 design partners, hand-onboarded |

## 3. Explicitly Out of Scope (written down so nobody relitigates at 11 pm)

SMB/CIM wedge (v1) · public API/SDK/MCP (v1 alpha) · Team plan, seats, RBAC beyond owner/member (v1) · multi-market evidence expansion (v1, source-by-source) · marketplace, lender features (Phase 2/3) · SOC 2 (program starts, cert is mo 9) · mobile apps (mobile-web memo reading only) · SSO/SCIM (enterprise phase) · custom rubrics · integrations (Zapier-class) · localization.

## 4. MVP Acceptance Criteria (gate to private-beta expansion; measured, not vibed)

1. **Pipeline:** 50 consecutive real deals through ingest→memo with zero fail-open events (fail-closed violations are launch-blocking S1s).
2. **Quality:** on golden-corpus RE subset — status accuracy ≥ 85% vs labels; **UNKNOWN precision ≥ 90%** (when we say we don't know, we're right that we don't); zero uncited factual sentences (checker enforced, sampled by hand ×200).
3. **Latency:** p95 < 15 min standard deal (v1 tightens to 10).
4. **Trust artifact:** an external design partner successfully verifies a tampered vs clean ledger export using only the public verifier README.
5. **Unit economics:** measured COGS/memo ≤ $14 with the routing table live ($11 target by v1).
6. **Design-partner signal:** ≥ 15 of 25 partners run ≥ 3 deals in a 30-day window; ≥ 10 convert to paid-intent (card on file for launch pricing).
7. **External challenge:** an independent technical reviewer (not us, not a design partner) red-teams **50 real deals on raw outputs** — status accuracy within claimed bands, zero fabricated citations, **zero false VERIFIED on blocking claims** (any occurrence → RCA + launch-gate review), UNKNOWN precision holds; the report goes in the data room unedited (`../investor/due-diligence.md` §4).

## 5. Cut Lines (pre-ranked — if the schedule slips, cut from the top)

1. Rental-comp source (2 adapters suffice for proof) → 2. PDF ingest (URL-only beta) → 3. Top-up purchases (manual credit grants) → 4. Memo PDF export (web view only) → 5. Second claim-type tranche (ship 8 of 12). **Never cut** (the anti-cut list): REFUSED state, citation checker, ledger + verifier, UNKNOWN UX. If we're tempted to cut those, we've stopped building this company and should say so out loud.

## 6. Success / Kill / Pivot Criteria (pre-committed at kickoff, board-visible)

- **Success (proceed to v1 launch):** §4 gates green + ≥ $8K MRR-equivalent committed from beta cohort by end of mo 6 + ≥ 25% of active partners export or forward a memo (sharing behavior is the willingness-to-pay tell for refusal-first output).
- **Yellow (extend beta ≤ 60 days, one iteration):** quality gates green but conversion < 40% of engaged partners → diagnose which hypothesis failed (H1 pricing/packaging vs H2 habit loop) via exit interviews before touching the product.
- **Kill/pivot trigger:** UNKNOWN-heavy memos measurably *reduce* willingness-to-pay in ≥ 2 structured cohort tests (H1 false at the core) → the honest conclusion is that this market wants fluency over rigor; we do **not** respond by loosening the doctrine — we take the finding to the board with pivot options (different buyer with liability exposure: lenders/insurers first instead of prosumer). Pre-deciding this prevents the slow-motion doctrine erosion that would otherwise masquerade as "iteration."

## 7. MVP Team & Budget Envelope

Hires #3–7 per `../operations/hiring.md` §2 (5 builders + founders); infra + model + source budget ≤ $18K/mo during beta (tracked on the cost board, `../architecture/observability.md` §7); design-partner program cost (onboarding time, credits granted) budgeted as CAC-equivalent and reported as such — free usage is spend, and we account for it like adults.
