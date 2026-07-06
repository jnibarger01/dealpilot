# DealPilot — Enterprise Phase (Months 12–24)
Status: Approved · Owner: CEO (motion) + CTO (readiness) · Predecessor gate: `v1.md` §6 · Successor: Series A gates + Phase 2 (`../product/roadmap.md`).

## 1. Phase Thesis

Prosumer proved the product; enterprise proves the **price**. Corp-dev teams (Dana, P3) and multi-seat investor shops buy three things prosumers don't pay full freight for: control (RBAC, SSO, custom rubrics), auditability at org scale (the ledger becomes a compliance asset, not a curiosity), and accountability (SLAs, support, a throat to choke). Same doctrine, enterprise wrapper — we sell what we already are, not a fork.

## 2. Product Scope (readiness ladder — each unlocks deals, sequenced by pipeline evidence)

| Tranche | Capability | Unblocks |
|---|---|---|
| E1 (mo 12–15) | **Team plan GA** ($1,950/mo, 5 pooled seats, 600 credits), org RBAC (roles per `../architecture/security.md` §3), shared pipelines, usage admin dashboard | multi-seat shops, land-and-expand base |
| E2 (mo 14–17) | **SSO/SAML + SCIM** (WorkOS path pays off — ADR-008), audit-log export (ledger views scoped for customer compliance teams), retention controls per org | IT sign-off at 500+ employee buyers |
| E3 (mo 15–18) | **Custom rubric parameters** (tighten thresholds, source preferences — within doctrine floor: no org may configure below baseline rigor; configurable *stricter*, never looser), memo templates, priority run queues | corp-dev fit; the doctrine-floor rule is non-negotiable and in the order form |
| E4 (mo 16–20) | **API GA** + signed webhooks at scale, PrivateLink connectivity (`../architecture/infrastructure.md` §4), IP allowlisting | integration into buyers' deal systems |
| E5 (mo 18–24) | SOC 2 **Type II** (mo 18), trust portal, DPA/MSA self-serve pack, EU data-residency *evaluation* (build only on ≥3 blocked deals — `../legal/privacy.md` §8) | procurement fast-lane |

## 3. Procurement Pack (assembled once, reused every deal — `../business/sales.md` stage 3 accelerant)

Security questionnaire pre-fills (SIG Lite + CAIQ maintained quarterly) · SOC 2 reports under click-through NDA · architecture one-pager + threat-model summary · `../legal/compliance.md` §6 perimeter memo (procurement's lawyer will ask; answering first wins weeks) · insurance certificates (E&O incl. AI/tech, cyber) · reference customers by segment · **the live demo that closes**: tamper a ledger export in front of their security team, watch the verifier catch it. Target: security review median ≤ 3 weeks (measured per deal, reported in pipeline reviews).

## 4. Pilot Playbook (paid, scoped, honest — from `../business/sales.md` §4)

$7.5K / 6 weeks / success criteria co-signed at kickoff (typically: N real deals through verification, quality sampled jointly against *their* analyst baseline, time-saved measurement, one integration proof). Pilot ends with a mutual scorecard — including what missed. Conversion target ≥ 60% pilot→annual; a pilot we can't scope honestly is a deal we disqualify (sales discipline is doctrine wearing a different shirt). Enterprise pricing from `../business/pricing.md`: from $60K/yr (seats + credit pool + SLA tier); discounts per approval ladder (15% AE / 25% CEO), never on rigor, only on price.

## 5. SLAs & Support Tiers

| Tier | Included | Targets |
|---|---|---|
| Team | standard support | 99.9% platform SLO (shared), support first-response < 8 bh |
| Enterprise | named CSM, priority queues | 99.9% contractual + service credits schedule, P1 response < 1 h, run p95 < 10 min committed, quarterly business reviews w/ verification-quality report per org |

Service credits are automatic (computed from the same SLO dashboards — `../architecture/observability.md` §2; customers shouldn't have to catch us, that's the brand). Support org: CSM #1 at 6 enterprise logos; until then founders + CoS run QBRs personally (unscalable on purpose — the feedback is the point).

## 6. GTM Motion & Targets (mo 12–24)

Founder-led sales → AE #1 on pilot #3 closed, SDR #1 mo 15+ (`../business/sales.md` §5 ramp: $600K→$750K quota). Pipeline sources: PLG-qualified teams (PQL triggers from `../business/sales.md` §2 — 3+ seats same domain, API-alpha usage, ledger-export frequency), *State of Seller Claims* inbound, design-partner referrals into corp-dev. Targets: **6+ enterprise logos or 1,500 seats**, enterprise ≥ 35% of new ARR by mo 24, NRR ≥ 105% (expansion via seats + credit-pool growth), logo churn < 8% annual.

## 7. Series A Gates (this phase's report card — `../business/fundraising.md` §4)

≈ **$1.8M ARR** (mo 22–26 window) · NRR ≥ 105% · 6+ enterprise logos **or** 1.5K seats · verification gross margin ≥ 72% · SOC 2 Type I + II · auto-verification ≥ 70% sustained · the A-narrative doc current (`../investor/fundraising.md` §8). Gates tracked on page 1 of every board pack from mo 12 — no surprises in either direction.

## 8. Phase 2 Preview (unlocked by this phase; scoped in `../product/roadmap.md`)

**Lender/credit motion (Chris, P4):** verification-as-underwriting-input for private lenders — pilots only after counsel re-review of the FCRA/ECOA fence for the *lender's* use case (their compliance, our contract language; `../legal/compliance.md` §6.2 discipline extends into their workflow). **Underwriting API as product line:** GA API revenue target 20%+ of new ARR by Y4; MCP distribution compounds here as agent stacks consume verification as a primitive. **Marketplace (Elena, P5)** stays gated behind API traction + board decision + broker-dealer perimeter re-review — sequenced, not assumed.

## 9. Risks Specific to This Phase (register cross-refs)

Enterprise pull arriving *before* E2/E5 readiness → sell the roadmap honestly, never claim certs early (R-1-adjacent trust discipline; also literally illegal to fake SOC 2). Prosumer neglect while chasing logos → the sequencing rule (`../business/business-plan.md` §6) caps enterprise eng allocation at 40% until NRR proof. Custom-rubric scope creep toward "just loosen it for this client" → doctrine floor (E3) is contractual and technical; the day we waive it for a logo is the day the moat starts draining — the no is pre-written, board-backed, and in the order form template.
