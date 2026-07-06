# DealPilot — Pricing, Packaging & Billing
Status: Approved · Owner: Product + Finance

## 1. Packaging Principles

1. Seats price the **workflow**; credits price the **verification work** (aligns price with COGS and value).
2. The free tier demonstrates the product but never grants the trust asset: free analyses are watermarked **UNVERIFIED**. Verification is the paywall.
3. Upgrade paths are consumption-triggered, not feature-crippled: hitting credit limits or inviting collaborators are the two upsell moments.
4. Enterprise price = platform fee + committed credits + compliance surface (SSO, audit export, private connectors, SLA) — never per-memo à la carte, which caps expansion.

## 2. Tiers

| | Free | Analyst $149/mo | Professional $449/mo | Team $1,950/mo | Enterprise from $60K/yr |
|---|---|---|---|---|---|
| Seats | 1 | 1 | 1 | 5 pooled (+$290/extra) | Custom + SCIM |
| Shallow analyses | 3/mo | Unlimited | Unlimited | Unlimited | Unlimited |
| Verification credits incl. | 0 | 30 | 120 | 600 | Committed volume |
| Deep verification | — | ✓ | ✓ + priority queue | ✓ + priority | ✓ + dedicated capacity |
| Deal pipeline inbox | — | ✓ | ✓ | ✓ shared | ✓ |
| Memo export (PDF + verifiable ledger link) | Watermarked | ✓ | ✓ | ✓ + templates | ✓ + white-label |
| Collaboration/review workflow | — | — | Comments | Roles + approvals | Approval chains + attestations |
| API access | — | — | Sandbox | Standard | Full + SLA |
| Private evidence connectors | — | — | — | — | ✓ |
| Audit export / SIEM feed | — | — | — | Basic | ✓ |
| Support | Community | Email | Email 24h | Slack channel | CSM + 99.9% SLA |

Annual = 2 months free. Pause plan $29/mo (ledger + pipeline retained, no verification).

## 3. Credits

- 1 credit ≈ one evidence-collection+adjudication unit. Standard SFR deal ≈ 8–10 credits; standard SMB CIM ≈ 12–15; complex/commercial 20–40.
- Overage packs: 100 @ $0.90 · 500 @ $0.70 · 2,500 @ $0.55 · enterprise committed @ $0.40–0.45.
- Guardrails: pre-run credit estimate shown; hard budget caps per user/org; auto-recharge opt-in with monthly ceiling. No surprise bills — billing incidents destroy exactly the trust we sell.
- COGS mapping and margin floor: credit price ≥ 2.2× modeled marginal COGS at each tier; reviewed monthly (finance runbook).

## 4. Billing Architecture (Stripe)

- **Stripe Billing** for subscriptions (products/prices per tier, monthly+annual), **usage-based metering** via Stripe Meters for credit overage, **Stripe Tax** for US sales tax/VAT, **Customer Portal** for self-serve plan changes, **Stripe Invoicing** for enterprise (net-30/60, PO fields, ACH/wire).
- Internal `billing-service` owns: entitlement state machine (source of truth = our DB, Stripe events reconcile), credit ledger (append-only, per-org, event-sourced like everything else), dunning flow (3 retries → 7-day grace with verification disabled, workspace read-only, never data deletion), proration rules.
- Webhook handling: idempotent consumers keyed on Stripe event id; reconciliation job diffs Stripe subscriptions vs entitlements nightly and alerts on drift.
- Enterprise contracts: annual platform fee invoiced upfront (deferred-revenue schedule), committed credits drawn down monthly with true-up quarterly; ramp schedules supported (e.g., 60/80/100% over 3 quarters).
- Marketplace (Phase 3): **Stripe Connect** (separate charges & transfers) for expert payouts; platform holds funds until task acceptance; 1099-K handled by Stripe.

## 5. Pricing Experiments Backlog

1. Analyst $129 vs $149 (elasticity test at signup, geo-split) — decision metric: 90-day net revenue/visitor.
2. Credit-inclusive "unlimited standard verifications" Pro tier at $549 — watch COGS tail risk; cap at p95 usage.
3. Per-deal one-shot purchase ($59) for non-subscribers — acquisition tool; measure conversion to subscription within 60 days (target 18%).
4. Enterprise platform-fee floor $60K vs $48K — win-rate vs ACV tradeoff, 2-quarter test.

## 6. Discounting Policy

Self-serve: none beyond annual. Sales: max 15% AE / 25% VP-approved / anything more = CEO + must trade for case study, multi-year, or committed credits. All discounts logged with reason codes; quarterly leakage review.
