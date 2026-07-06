# DealPilot — Capitalization Table & Equity Plan
Status: Maintained (Carta is source of truth; this doc is the narrative + planning model) · Owner: CEO · Reconciles to `../business/fundraising.md` dilution ledger (63% → 47% → 36%).

## 1. Founding Structure (incorporation)

Delaware C-corp. 10,000,000 authorized common at founding issuance:

| Holder | Shares | % | Vesting |
|---|---|---:|---|
| Founder 1 (CEO) | 4,500,000 | 45.0% | 4 y, 1 y cliff, monthly; double-trigger acceleration (50%) |
| Founder 2 (CTO) | 4,500,000 | 45.0% | same |
| Option pool (2026 Equity Incentive Plan) | 1,000,000 | 10.0% | board-administered |
| **Total** | **10,000,000** | **100%** | |

Hygiene (verified, in data room /01): 83(b) elections filed within 30 days; PIIA/IP assignment signed by both founders and every contractor; founder vesting applies to founders too — no exceptions clause; right of first refusal + co-sale in bylaws.

## 2. Seed Round (executed terms per plan)

**$4.0M priced equity at $16.0M post-money ($12.0M pre)** — Series Seed Preferred, standard NVCA docs: 1× non-participating liquidation preference, broad-based weighted-average anti-dilution, pro-rata rights for major investors (≥$500K), 1 board seat (lead) + 2 founders + 1 independent (seated by mo 12), no participating preferred, no full-ratchet, no tranches.

Round math (pool topped up **pre-money** to 12% post — investor-standard, dilution borne by existing holders):

| Holder | Shares | % post-seed |
|---|---:|---:|
| Founders (2) | 9,000,000 | **63.0%** |
| Option pool (topped to) | 1,714,286 | 12.0% |
| Seed investors | 3,571,429 | 25.0% |
| **Total** | **14,285,715** | **100%** |

Price/share ≈ $1.12. Pool detail: ~180,000 already granted to first hires pre-round (advisers 0.25–0.5%, founding engineers 0.75–1.5% — bands in `../operations/hiring.md` §7), remainder unissued.

**Why priced over SAFEs at this size:** $4M of stacked post-money SAFEs creates dilution opacity founders routinely regret; a priced round costs ~$25–40K more in legal, buys a clean board, fixed dilution, and signals operating maturity to the Series A market. (SAFEs acceptable only for a ≤$750K friends-and-family pre-close, MFN, capped — we didn't need it.)

## 3. Scenario: Series A (planning, not commitments)

Per `../business/fundraising.md`: **$15M at $60–75M post**, trigger ≈ $1.8M ARR (mo 22–26), gates as listed there. Modeled at $68M post (~22% new money) + pool refresh to ~13% post:

| Holder | % post-A (modeled) |
|---|---:|
| Founders | **≈47%** |
| Employee pool (granted + unissued) | ≈13% |
| Seed investors | ≈19% (pre pro-rata participation) |
| Series A | ≈22% |

Guardrail (standing, board-acknowledged): **founders + employees ≥ 50% through the A** — modeled at ≈60%, healthy margin. If market terms force below guardrail, the answer is raise less / later, not violate it.

## 4. Scenario: Series B (sketch)

$35M at mo 44–50 (`../business/financial-model.md` milestones), modeled 22–25% new + pool refresh → founders ≈ **36%**, employees ≈13–14%. Kept as a sanity band, not a plan — B terms get negotiated from strength or not at all.

## 5. Option Pool Policy

- Target unissued buffer: 12–18 months of hiring plan at all times; refresh at rounds (negotiated pre/post explicitly — we model pre-money refreshes and price rounds accordingly, no surprise founder dilution).
- Grants: 4 y / 1 y cliff / monthly; new-hire bands by level published internally (comp philosophy: `../operations/hiring.md` §7); refresh grants at years 2–3 for performers (boxcar schedule) — retention is cheaper than replacement.
- Exercise: 10-year post-termination exercise window for ≥2-year tenure (early-employee-friendly; costs us little, signals a lot); early exercise permitted with 83(b).
- 409A: refreshed annually + at material events; first at seed close.

## 6. Governance & Housekeeping

Board post-seed: 2 founders, 1 seed lead, 1 independent (target: operator with vertical-SaaS scaling experience; seated by mo 12). Protective provisions: standard NVCA list, nothing exotic (no investor veto on hiring/budget line items). Information rights: monthly KPI pack + quarterly financials (`fundraising.md` reporting cadence). Founder secondary: none at seed (signal discipline); revisit small (<5%) at a strong A — pre-agreed with lead to avoid later awkwardness.

## 7. Dilution Ledger (single source, mirrors fundraising.md)

| Stage | Founders | Employees (pool) | Investors |
|---|---:|---:|---:|
| Founding | 90.0% | 10.0% | — |
| Post-seed | **63.0%** | 12.0% | 25.0% |
| Post-A (modeled) | **≈47%** | ≈13% | ≈40% |
| Post-B (sketch) | **≈36%** | ≈13.5% | ≈50% |

Any doc in this repo citing ownership percentages must reconcile here; Carta governs actuals.
