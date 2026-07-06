# DealPilot — Business Plan
Status: Approved · Owner: CEO · Companion docs: `financial-model.md` (numbers), `pricing.md`, `sales.md`, `marketing.md`, `risk-register.md`

## 1. Business Model

Hybrid **seat subscription + usage** ("verification credits"), expanding into **enterprise contracts** and eventually an **API + expert marketplace**.

- Seats buy the workspace, memos, collaboration, ledger, and a monthly credit allowance.
- Credits meter deep verification runs (evidence collection against paid sources, heavy model passes, expert-marketplace tasks later). Credits align our COGS with revenue and let power users self-select into higher spend without plan friction.
- Enterprise adds SSO/SCIM, private evidence connectors, approval workflows, audit exports, SLAs, and volume credit pricing.

## 2. Revenue Streams

| Stream | Phase | Mechanics |
|---|---|---|
| Prosumer subscriptions (Analyst/Professional) | Now | Monthly/annual, self-serve, Stripe |
| Team plans | Mo 6+ | Pooled seats, shared pipelines, review workflows |
| Verification credit packs & overage | Now | Prepaid packs at tiered rates; auto-recharge |
| Enterprise contracts | Mo 12+ | Annual, invoiced, $60–250K ACV |
| Underwriting API | Mo 24+ | Usage-priced per verified memo/claim-check; partner rev-share |
| Expert marketplace rake | Mo 30+ | 20–25% take on human-verification tasks routed through platform |
| Data/benchmark products (opt-in, aggregated) | Yr 4+ | Market risk benchmarks; strict consent + aggregation rules |

## 3. Pricing (summary; full logic in `pricing.md`)

Analyst **$149**/user/mo (annual $1,490) · Professional **$449**/user/mo · Team **$1,950**/mo (5 pooled seats) · Enterprise **from $60K/yr**. Credits: included allowances 30/120/600 per month respectively; packs from $0.90/credit down to $0.45 at volume. A "standard deep verification" consumes 8–15 credits depending on evidence surface.

## 4. Unit Economics (targets; formulas stated)

Definitions: `LTV = ARPA × GrossMargin ÷ AnnualChurn` (simple form; cohort DCF model in financial-model.md). `CAC payback (mo) = CAC ÷ (ARPA × GM ÷ 12)`.

| Metric | Prosumer (blended An/Pro) | Team | Enterprise |
|---|---|---|---|
| ARPA (yr, incl. credits) | $3,900 | $28,000 | $95,000 |
| Gross margin | 74% (yr1) → 80% | 78% | 82% |
| Gross churn | 2.4%/mo → 1.6%/mo | 1.0%/mo | 8%/yr logo |
| NRR target | 105% | 115% | 125% |
| CAC (blended) | $350 self-serve · $1,100 blended | $6,500 | $32,000 |
| LTV | ≈ $13–19K | ≈ $150K | ≈ $600K+ |
| LTV/CAC | 3.5–4.5 | ~4 | ~4–5 |
| CAC payback | 4–5 mo | 8–10 mo | 12–14 mo |

**COGS honesty:** early verification COGS per standard memo ≈ $6–14 (model inference $2–5, paid evidence sources $2–7, compute/storage $1–2). Margin plan: cache + Evidence Graph reuse (−30% by mo 18), model routing to smaller models for extraction (−25%), negotiated data volume tiers (−20%). If COGS doesn't compress on schedule, credit prices flex before margins do (guardrail owned by CFO; risk R-9).

## 5. Go-To-Market

**Motion 1 — Product-led (mo 0–∞):** free tier = 3 shallow analyses/mo (no deep verification), watermark "Unverified — upgrade to verify." Activation goal: first *verified* memo within 24h of signup (target 40%). PLG loop: exported memos carry a verifiable ledger link → recipients (partners, lenders, brokers) become signups.

**Motion 2 — Community-led (mo 0–18):** RE-investor and ETA/searcher communities (podcasts, Searchfunder, BiggerPockets-class forums, Twitter/X micro-PE), teardown content ("we verified this live CIM; here's what was fiction"), operator webinars. Owner: founder + first growth hire.

**Motion 3 — Sales-assisted teams (mo 6–24):** inbound-qualified multi-seat prosumers → AE-managed Team upgrades; land-and-expand inside brokerages and sponsor groups.

**Motion 4 — Enterprise (mo 12+):** 2 AEs + founder selling to corp dev, family offices; security package (SOC 2 I, pen test, DPA) ready mo 9. POC playbook: 30-day pilot on 10 historical deals, success = memo quality sign-off + time-savings measurement.

**Motion 5 — Partnerships/API (mo 18+):** marketplaces and lenders embedding verification ("Verified by DealPilot" badge economics: partner pays per verified listing, we gain distribution + evidence).

Sequencing rule: no motion opens until the prior motion's payback is proven, except founder-led enterprise discovery which runs continuously for learning.

## 6. Customer Acquisition Plan (yr 1 targets)

| Channel | Budget share | CAC target | Notes |
|---|---|---|---|
| Content/SEO (verification teardowns, calculators-with-receipts) | 30% | $180 | Compounding; owns "how to verify a CIM/rent roll" queries |
| Community & podcast sponsorships | 25% | $320 | High-intent niches |
| Paid search (bottom-funnel only) | 15% | $500 cap | Kill if >$500 |
| Referral program (credits for invites) | 10% | $90 | Credits are cheap CAC currency |
| Memo-export viral loop | 0% (product) | ~$0 | Instrument attribution from day 1 |
| Events (searchfund/RE conferences) | 20% | $700 | Doubles as customer research |

## 7. Retention & Expansion System

1. **Habit anchor:** deal-pipeline inbox — users forward listings/CIMs to a personal `deals@` address; DealPilot pre-screens automatically. Daily-use surface, not per-deal tool.
2. **Value receipts:** monthly "risk avoided" report (contradictions caught, $ exposure flagged) — renewal ammunition.
3. **Expansion levers:** credit consumption → plan upsell; collaborator invites → Team; audit/approval needs → Enterprise.
4. **Churn countermeasures:** deal-flow seasonality pause plan (park at $29/mo, ledger retained) instead of cancel; churn-reason taxonomy reviewed weekly.

## 8. Network Effects & Marketplace Dynamics

- **Data NE (strong, compounding):** every verification enriches the Evidence Graph (source reliability priors, entity resolution, cached verified facts with TTL) → faster/cheaper/better verification for everyone. Defensibility grows superlinearly with deal volume.
- **Two-sided marketplace (Phase 3):** demand = claims machines can't verify (site walkthroughs, QoE, license checks); supply = vetted inspectors/CPAs/appraisers accepting structured tasks. Cold-start plan: seed supply with 3 partner firms per metro under SLAs before opening demand; take rate 20–25%; quality via double-blind scoring against later ground truth.
- **Standard-setting NE:** "DealPilot-verified" badge on listings raises seller conversion → sellers request verification → more evidence → stronger badge. Guard against seller capture: sellers pay for *process*, never for *outcome*; adjudication rubric is public.

## 9. Sales Strategy (detail in `sales.md`)

Founder-led → 2 AEs (mo 12) → AE pod + SE (mo 18). Enterprise sales cycle assumption 90–150 days; pipeline coverage 3.5x; POC-to-close 45%.

## 10. Risk Analysis (top 10 of 100; full ranked register in `risk-register.md`)

| # | Risk | Sev | Lik | Core mitigation |
|---|---|---|---|---|
| R-1 | Verification accuracy failure becomes public | 5 | 3 | Conformance suite, human-review sampling, publish accuracy stats, incident playbook |
| R-2 | Evidence-source access revoked/priced out | 5 | 3 | Multi-source adapters, contracts w/ derived-data rights, user-supplied-evidence path |
| R-3 | Frontier platform ships "verified answers" | 4 | 3 | Evidence Graph depth, vertical workflow, audit exports they won't build |
| R-4 | Verification COGS doesn't compress | 4 | 3 | Caching/graph reuse, routing, credit-price flex guardrail |
| R-5 | Prompt-injection via seller docs causes bad memo | 5 | 2 | Hostile-input architecture (ai-architecture §6), red-team CI |
| R-6 | Regulatory reclassification (advice/appraisal) | 4 | 2 | Language controls, counsel gates per vertical, human-approval design |
| R-7 | Data incumbent enters with bundled verification | 4 | 2 | Speed, prosumer distribution, partner rather than fight where possible |
| R-8 | Prosumer churn from deal-flow seasonality | 3 | 4 | Pause plan, pipeline-inbox habit, annual pricing |
| R-9 | Model-provider dependency (price/behavior shifts) | 4 | 3 | Multi-model routing, eval-gated swaps, cost alarms |
| R-10 | Trust cold-start: users don't believe the badge | 4 | 3 | Verifiable ledger exports, third-party conformance audits, public teardowns |
