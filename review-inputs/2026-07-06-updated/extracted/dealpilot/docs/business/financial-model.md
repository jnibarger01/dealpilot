# DealPilot — Financial Model (FY1–FY5)
Status: Approved · Owner: CEO/Finance · This document is the narrative model at full depth; the live spreadsheet (`/models/dealpilot-model-v3.xlsx`) carries monthly granularity and is the operating artifact. All figures $K unless noted. FY1 begins at seed close. Canonical numbers here are authoritative for the whole repo (reconciliation table §12).

## 1. Key Assumptions (drivers — change these, everything flows)

### 1.1 Growth & retention drivers

| Driver | FY1 | FY2 | FY3 | FY4 | FY5 | Provenance |
|---|---|---|---|---|---|---|
| Paying prosumer seats (EOY) | 380 | 1,450 | 3,900 | 8,200 | 14,500 | bottoms-up funnel §1.2 |
| Team accounts (EOY, 5-seat avg) | 6 | 45 | 160 | 420 | 900 | PQL conversion `sales.md` §2 |
| Enterprise logos (EOY) | 1 | 7 | 24 | 58 | 118 | pilot playbook math §1.3 |
| Prosumer ARPA ($K/yr incl. credits) | 3.4 | 3.9 | 4.2 | 4.4 | 4.6 | plan mix + overage §2.2 |
| Team ARPA ($K/yr) | 23.4 | 24.6 | 26.0 | 27.0 | 28.0 | $1,950/mo base + overage |
| Enterprise ACV ($K) | 55 | 72 | 88 | 100 | 110 | ramped platform+credits |
| Prosumer gross churn (mo) | 2.6% | 2.2% | 1.9% | 1.7% | 1.6% | benchmarked prosumer SaaS, haircut for newness |
| Team/ent logo churn (yr) | — | 10% | 8% | 7% | 6% | assumed; unproven until FY2 |
| NRR blended | 98% | 106% | 112% | 116% | 118% | seat + credit-pool expansion |
| Headcount (EOY) | 11 | 23 | 48 | 88 | 148 | `../operations/hiring.md` |

**Honesty column:** churn and NRR are the two least-evidenced assumptions in this model (no cohort history exists pre-launch). Both carry bear-case stress in §8; NRR < 100% sustained through FY2 is a business-model falsifier, not a tuning problem.

### 1.2 Prosumer funnel assumptions (drives seat counts)

| Stage | FY1 | FY2 | Basis |
|---|---|---|---|
| Signups/mo (exit rate) | 700 | 2,400 | launch KPIs `../roadmap/v1.md` §3, then SEO/creator compounding |
| Signup → activated (first verified memo) | 40% | 44% | activation target, PRD goal G1 |
| Activated → paid (90-day) | 11% | 13% | design-partner conversion observed 40% is not generalizable; stranger conversion modeled conservatively |
| Paid seats added/mo (exit) | ~31 net FY1 exit → | ~120 net FY2 exit | after churn |

### 1.3 Usage & consumption assumptions (drives COGS and overage)

| Driver | FY1 | FY3 | FY5 |
|---|---|---|---|
| Verified memos / paying seat / mo (blended) | 5.5 | 6.0 | 6.3 |
| Credits / standard memo (blended RE+CIM mix) | 11 | 11 | 9 (efficiency + shallow-mode mix) |
| Free-tier shallow memos / mo (EOY rate) | 350 | 2,800 | 9,000 |
| All-in COGS / standard paid memo ($) | 11.00 | 6.00 | 4.00 |
| **Marginal COGS / credit ($)** | **0.90** | **0.58** | **0.45** |
| Free shallow-memo COGS ($) | 2.50 | 1.40 | 0.90 |

Marginal COGS/credit is the number the pricing floor watches (credit sale price ≥ 2.2× marginal COGS at every tier — `pricing.md`; lowest tier-effective price is Team at $3.25/credit vs floor $1.98 FY1: compliant with room). Full COGS decomposition: §10.

## 2. Revenue Build

### 2.1 Formula
`ARR = prosumer seats×ARPA + team accounts×ARPA + Σ enterprise ACV` · overage (credit purchases beyond plan) modeled at 18–24% of subscription revenue, embedded in ARPA. Recognized revenue lags ARR (ratable recognition, mid-year cohort weighting ≈ 0.55–0.60 of EOY ARR in high-growth years).

### 2.2 Annual build ($K)

| $K | FY1 | FY2 | FY3 | FY4 | FY5 |
|---|---|---|---|---|---|
| Prosumer subs + credits | 520 | 2,050 | 5,600 | 11,900 | 22,500 |
| Team | 60 | 480 | 1,900 | 5,200 | 11,000 |
| Enterprise | 25 | 290 | 1,500 | 4,900 | 12,500 |
| **ARR (EOY)** | **605** | **2,820** | **9,000** | **22,000** | **46,000** |
| YoY growth | — | 366% | 219% | 144% | 109% |
| Recognized revenue | 340 | 1,750 | 6,100 | 15,600 | 34,200 |

Worked example (FY3 prosumer): 3,900 EOY seats, ~2,650 average seats × $4.2K ARPA ≈ $11.1M run-rate mid-build → $5.6M EOY-weighted line reflects intra-year ramp; the spreadsheet carries the monthly curve.

### 2.3 FY1–FY2 quarterly ARR bridge ($K EOY per quarter)

| | FY1Q1 | Q2 | Q3 | Q4 | FY2Q1 | Q2 | Q3 | Q4 |
|---|---|---|---|---|---|---|---|---|
| ARR | 18 | 85 | 280 | 605 | 940 | 1,380 | 2,010 | 2,820 |
| Note | beta, paid-intent | beta→launch | launch qtr (`../roadmap/v1.md`) | first Team accts | | pilot #1–3 close | **mo-18 checkpoint: ≥$1.0M ✓ else downshift §4.3** | A-gate window opens |

## 3. Income Statement (recognized basis)

| $K | FY1 | FY2 | FY3 | FY4 | FY5 |
|---|---|---|---|---|---|
| Revenue | 340 | 1,750 | 6,100 | 15,600 | 34,200 |
| COGS (inference, evidence fees, infra, HITL sampling, support, free-tier subsidy) | 116 | 490 | 1,464 | 3,432 | 6,840 |
| **Gross profit** | **224** | **1,260** | **4,636** | **12,168** | **27,360** |
| GM% | 66% | 72% | 76% | 78% | 80% |
| R&D | 1,750 | 2,900 | 4,800 | 7,900 | 12,400 |
| S&M | 620 | 1,650 | 3,900 | 7,600 | 12,800 |
| G&A | 480 | 900 | 1,750 | 3,100 | 5,200 |
| **Opex** | **2,850** | **5,450** | **10,450** | **18,600** | **30,400** |
| **EBITDA** | **(2,626)** | **(4,190)** | **(5,814)** | **(6,432)** | **(3,040)** |
| EBITDA margin | — | — | −95% | −41% | −9% |

### 3.1 Opex composition (people vs non-people, $K)

| | FY1 | FY2 | FY5 |
|---|---|---|---|
| People (fully loaded, §6.2) | 2,180 | 4,340 | 24,900 |
| Non-people R&D (tooling, eval infra, golden-corpus labeling, model experimentation budget) | 290 | 480 | 1,900 |
| Non-people S&M (launch campaign, creators, *State of Seller Claims*, events) | 240 | 420 | 2,400 |
| Non-people G&A (legal/counsel incl. perimeter review, Drata+auditor, insurance incl. E&O/AI, finance stack) | 140 | 210 | 1,200 |

FY1 non-people G&A detail: counsel $55K (formation, ToS/privacy, perimeter memo), compliance tooling+audit $30K, insurance $28K, finance/HR stack $12K, misc $15K.

### 3.2 Path to profitability
EBITDA breakeven modeled FY6 Q2 at ~$60M ARR; the FY5 margin bend (−41%→−9%) is GM expansion + S&M efficiency (payback improves as PQL motion matures), not headcount starvation. Rule of 40 crosses in FY5 (109% growth − 9% margin = 100).

## 4. Cash Flow & Runway

### 4.1 Annual ($K)

| $K | FY1 | FY2 | FY3 | FY4 | FY5 |
|---|---|---|---|---|---|
| Operating CF (≈EBITDA ± WC; deferred revenue is a tailwind at this growth) | (2,450) | (3,850) | (5,300) | (5,700) | (2,100) |
| Capex | (40) | (80) | (150) | (250) | (350) |
| Financing | 4,000 seed | 15,000 A | — | 35,000 B | — |
| **Ending cash** | **1,510** | **12,580** | **7,130** | **36,180** | **33,730** |

### 4.2 FY1 monthly burn profile (gross, $K/mo)
Mo 1–3: ~145 (7 heads, corpus labeling spend) → mo 4–6: ~185 (beta, 9 heads) → mo 7–9: ~225 (launch quarter: +campaign $80K spread) → mo 10–12: ~250 (11 heads, volume COGS). Seed lasts **24 months standalone** at the gated ramp; every hire past #7 unlocks on a milestone, not a date (`../operations/hiring.md` §3 trigger rule applies from hire #8).

### 4.3 Downshift trigger (pre-agreed with board, written here so it cannot be renegotiated mid-panic)
**If mo-18 ARR < $1.0M:** hiring freezes at 14 heads; non-people S&M cut 60%; model-experimentation budget cut 50% (eval infra protected — quality measurement is the last thing we starve); runway extends to 30 mo; the quarter is spent diagnosing the failed hypothesis (H1 pricing vs H2 habit, `../roadmap/mvp.md` §6) before any re-acceleration. Reversal requires two consecutive quarters back on the base curve.

## 5. Balance Sheet (EOY summary, $K)

| $K | FY1 | FY2 | FY3 | FY4 | FY5 |
|---|---|---|---|---|---|
| Cash | 1,510 | 12,580 | 7,130 | 36,180 | 33,730 |
| AR (enterprise net-30/60 grows this) | 30 | 220 | 850 | 2,300 | 5,100 |
| Other assets | 60 | 140 | 320 | 600 | 1,000 |
| Deferred revenue (annual prepay + enterprise upfront platform fees) | 190 | 780 | 2,400 | 6,100 | 12,900 |
| Other liabilities | 120 | 310 | 700 | 1,400 | 2,600 |
| Equity (net) | 1,290 | 11,850 | 5,200 | 31,580 | 24,330 |

Policy notes: enterprise annual platform fees invoiced upfront and recognized ratably (`pricing.md`); committed credits drawn monthly with quarterly true-up; deferred revenue is the cheapest financing we have — annual-plan incentives (2 months free) exist for cash reasons as much as retention.

## 6. Hiring Plan

### 6.1 EOY headcount by function

| Function | FY1 | FY2 | FY3 | FY4 | FY5 |
|---|---|---|---|---|---|
| Engineering (incl. ML/verification; incl. both founders) | 6 | 12 | 24 | 42 | 66 |
| Product & Design | 1 | 3 | 6 | 10 | 15 |
| GTM (sales, growth, marketing, CS) | 1 | 4 | 11 | 25 | 48 |
| Data/Evidence ops (source adapters, corpus, **HITL reviewers**) | 2 | 3 | 5 | 7 | 12 |
| G&A (finance, people, security/compliance) | 1 | 1 | 2 | 4 | 7 |
| **Total** | **11** | **23** | **48** | **88** | **148** |

First 11 (canonical sequence in `../operations/hiring.md` §2): 2 founders, 3 platform/full-stack engineers, 1 ML/verification engineer, 1 founding designer, 1 evidence & data lead, 1 founding GTM, 1 verification reviewer, 1 ops/chief-of-staff. Reviewer scaling is volume-indexed (1 : ~900 memos/mo at ≥70% auto-verification), so Data/Evidence ops grows with usage, not calendar.

### 6.2 Loaded-cost assumptions
Fully loaded = cash + 14% (benefits/taxes) + $9K/head/yr (tools, equipment, travel). FY1 average loaded cost ≈ $198K/head (senior-heavy founding team, bands in `../operations/hiring.md` §7); drifts to ≈ $185K by FY3 as mix broadens. Annual comp inflation 4% modeled. Equity is excluded from EBITDA lines above (no SBC illusion games at this stage; the spreadsheet carries an SBC memo line for diligence).

## 7. Fundraising Plan & Milestones

| Round | Size | Post | Timing | Gate to raise |
|---|---|---|---|---|
| Seed | $4.0M | $16M | Now | this plan |
| Series A | $15M | $60–75M | Mo 22–26 | ARR ≥ $1.8M, NRR ≥ 105%, 6+ enterprise logos or 1.5K paid seats, verification GM ≥ 72%, SOC 2 I+II track, auditor-checkable accuracy report |
| Series B | $35M | $180–250M | Mo 44–50 | ARR ≥ $12M growing >100%, enterprise NRR ≥ 120%, API GA with 3 embedded partners |

Dilution ledger and round mechanics: `../investor/cap-table.md` §7, `../investor/fundraising.md`. Investor dashboard (monthly): ARR & growth, NRR/GRR, verified-memo volume, auto-verification rate, verification GM, CAC payback by motion (measured, cohort-based), enterprise pipeline coverage (3.5×), cash months, $/memo trend.

## 8. Sensitivities & Scenarios

### 8.1 FY3 ARR under single-driver stress

| Scenario | Δ assumption | FY3 ARR | Cash effect |
|---|---|---|---|
| Base | — | $9.0M | — |
| Churn +50 bps/mo prosumer | 1.9%→2.4% | $7.6M | −$0.6M |
| COGS compression stalls (GM capped 68%) | price holds, free-tier depth cut first (pre-decided, R-3) | $8.1M | −$0.9M |
| Enterprise slips 2 quarters | logos 24→14 | $8.0M | −$0.4M |
| Activation misses (40%→32%) | funnel top intact | $7.4M | −$0.5M |
| **Bear (churn+COGS+enterprise)** | | **$6.1M** | −$1.9M; downshift posture, still A-fundable on quality metrics |
| **Deep bear** (external-review stress) | activation −40%, source fees ×2, enterprise cycle ×2, compression 50% slower | **$5.2M** | survives **only** via §4.3 downshift (cash-out ≈ mo 29 vs mo 24 without it — the argument for the trigger being automatic, not discretionary); A attempt rests on quality metrics + honest cohort story |

### 8.2 Three-scenario arc (ARR $M EOY)

| | FY1 | FY2 | FY3 | FY4 | FY5 |
|---|---|---|---|---|---|
| Bull (activation 48%, NRR +4 pts, enterprise ACV +15%) | 0.75 | 3.8 | 12.5 | 30 | 62 |
| **Base** | **0.60** | **2.8** | **9.0** | **22** | **46** |
| Bear (§8.1 stack) | 0.45 | 1.9 | 6.1 | 14 | 28 |

Driver ranking by FY3 ARR impact (tornado order): activation rate > prosumer churn > enterprise timing > ARPA/plan mix > COGS (COGS ranks last on *revenue* but first on *margin/cash* — which is why it owns risk slot R-3 and a weekly dashboard rather than a quarterly glance).

## 9. Unit Economics Detail

Methodology (stated because most models hide it): **LTV = 36-month-capped gross-profit contribution** with monthly churn decay — no perpetuity terms; CAC = fully loaded S&M ÷ new customers in cohort, by motion. FY2-basis figures:

| Motion | CAC | GP/mo | Payback | 36-mo LTV | LTV/CAC |
|---|---|---|---|---|---|
| Prosumer (PLG) | $1,100 | $187 | ~6 mo | ~$4.6K | **4.2** |
| Team | $6,500 | $1,420 | ~4.6 mo | ~$29K | **4.5** |
| Enterprise | $32,000 | $4,300 | ~7.5 mo | ~$118K | **3.7** |

Blended 3.5–4.5 across the plan horizon. FY1 actuals will measure worse than this table (founder selling time is unpriced; small-n cohorts are noisy) — the board metric is *measured cohort payback*, reported honestly from month 7, target < 12 mo blended by FY2 exit.

## 10. COGS Build & Compression Roadmap ($/standard paid memo)

| Component | FY1 | FY3 | FY5 | Compression lever |
|---|---|---|---|---|
| Extraction (small model, ~35 pp avg) | 1.60 | 0.85 | 0.50 | small-tier routing → open-weights batch at >5M pp/mo (`../architecture/ai-architecture.md` §7) |
| Evidence source fees | 3.10 | 1.75 | 1.30 | CAS dedupe + response cache (target 55% hit), volume renegotiation |
| Adjudication (frontier) | 3.40 | 1.90 | 1.10 | batch adjudication, per-claim-class routing, rubric pre-filters |
| Composition (frontier) | 1.00 | 0.60 | 0.40 | template constraint tightening |
| Embeddings/search | 0.30 | 0.15 | 0.08 | re-embed batching, pgvector→Qdrant economics |
| Infra/orchestration amortized | 0.70 | 0.35 | 0.22 | spot workers, right-sizing |
| HITL sampling amortized | 0.40 | 0.20 | 0.15 | auto-verification 60→70→75% |
| Support allocation | 0.50 | 0.20 | 0.25 | self-serve depth; enterprise support is priced, not absorbed |
| **All-in / memo** | **11.00** | **6.00** | **4.00** | |

Free-tier subsidy is modeled separately (shallow memos $2.50→$0.90; capped by design at 3/mo, watermarked). Total FY1 COGS reconciliation: ~9,900 paid memos × ~$9.4 marginal + free-tier subsidy ~$10K + fixed infra/support floor ~$13K ≈ **$116K** ✓ (ties to §3). Guardrails: any run > $9 hard-fails `BudgetExceeded` with credit auto-refund; $/memo daily average > $7 opens a ticket (`../architecture/observability.md` §6).

## 11. Model Governance

The spreadsheet is versioned (v3 current); assumption changes ship like code — PR-style change note (what, why, who), monthly actuals-vs-plan variance review (>15% variance on any driver gets a written explanation, not a silent re-forecast), re-forecast cadence quarterly, full re-underwrite at each round. Finance owner: ops/CoS (hire #11) under CEO until a finance lead exists (FY3). The same discipline we demand of rubric changes applies to forecast changes: history is never overwritten, re-forecasts append.

## 12. Canonical Numbers Registry (single source of truth)

Rules: (1) any doc that disagrees with this table is wrong and gets fixed toward it; (2) shorthand is legal **only** in the listed form with its label; (3) rows change via PR with a change note (§11 governance).

| # | Canonical value | Allowed shorthand | Where used | Owner | Updated |
|---|---|---|---|---|---|
| C1 | ARR EOY: $0.6 / 2.8 / 9.0 / 22 / 46 M | “$46M by Y5” | README, `executive-summary.md`, `../investor/pitch-deck.md` | CEO | 2026-07-06 |
| C2 | Seed $4.0M @ $16M post; A $15M mo 22–26 @ $60–75M; B $35M mo 44–50 | — | `fundraising.md`, `../investor/cap-table.md` | CEO | 2026-07-06 |
| C3 | Blended GM 66%→80%; segment slices (74/78/82%) allowed **only** labeled “segment slice” | segment slices per `business-plan.md` §4 | §3, `business-plan.md`, `pricing.md` | Finance | 2026-07-06 |
| C4 | All-in COGS/standard memo $11→$4; marginal COGS/credit $0.90→$0.45 | “range $6–14 observed” only with “by complexity” label | §1.3, §10, `pricing.md`, `../architecture/ai-architecture.md` §7 | Finance + Head of AI | 2026-07-06 |
| C5 | **LTV method: 36-month-capped GP contribution, monthly churn decay, no perpetuity** | none — the `ARPA×GM÷churn` form is banned in docs | §9, `business-plan.md` §4, `../investor/due-diligence.md` | Finance | 2026-07-06 |
| C6 | CAC by motion, fully loaded (FY2-basis): $1,100 / $6,500 / $32,000 | “$350” = self-serve **channel** CAC, must carry the label | §9, `business-plan.md`, `../investor/pitch-deck.md` S9 | GTM | 2026-07-06 |
| C7 | Payback (FY2-basis): ~6 / ~5 / ~7.5 mo; board metric = measured cohort payback, target <12 blended | “<12 mo blended” | §9, `sales.md` (≤14 mo hiring gate is the *sales-pod* gate, distinct) | GTM | 2026-07-06 |
| C8 | LTV/CAC (FY2-basis): 4.2 / 4.5 / 3.7; blended band 3.5–4.5 | “≈3.5–4.5 blended” | §9, `business-plan.md`, `executive-summary.md` | Finance | 2026-07-06 |
| C9 | Pricing: $149 / $449 / $1,950(5 seats) / from $60K; credits 30/120/600; standard deal 8–15 credits | “standard deal ≈ 10 credits” (buyer-facing anchor) | `pricing.md`, `business-plan.md`, `../investor/pitch-deck.md` S7 | CEO | 2026-07-06 |
| C10 | Headcount EOY 11/23/48/88/148 | “first 11” | §6, `../operations/hiring.md` | CEO | 2026-07-06 |
| C11 | Downshift: mo-18 ARR < $1.0M → freeze at 14 heads (automatic) | — | §4.3, `fundraising.md`, `../roadmap/v1.md` §6 | CEO + Board | 2026-07-06 |
| C12 | A-gates: ARR ≥$1.8M, NRR ≥105%, 6+ logos or 1.5K seats, verification GM ≥72%, SOC 2 I+II | — | §7, `../roadmap/enterprise.md` §7, `../investor/*` | CEO | 2026-07-06 |
| C13 | ARPA trajectories: prosumer $3.4→$4.6K; Team $23.4→$28K; Ent ACV $55→$110K | steady-state figures only with year label | §1.1, `business-plan.md` §4 | Finance | 2026-07-06 |

Registry maintenance: any new number that appears in ≥2 docs gets a row before the second doc merges. Provenance: rows C5–C8, C13 added after external review M4 (`review-response.md` RR-13) caught methodology drift between this model and the business plan.
