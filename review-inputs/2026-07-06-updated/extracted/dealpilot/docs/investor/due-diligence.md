# DealPilot — Due Diligence Package
Status: Maintained continuously (not assembled under duress) · Owner: CEO/COO · Principle: the data room is built the way we build memos — every claim backed, gaps marked openly. An investor diligencing a verification company will test whether *we* survive verification.

## 1. Data Room Index (folder structure, permission-tiered)

```
/01-corporate        charter, bylaws, board consents, cap table + option ledger,
                     IP assignments (all founders/contractors — PIIA), 83(b)s, good standing
/02-financial        model (xlsx mirror of financial-model.md), actuals vs plan monthly,
                     bank statements, burn/runway sheet, revenue by cohort, credit-usage data
/03-product          PRD, roadmap, personas, demo videos, design-partner LOIs + interview notes,
                     activation/retention dashboards (read-only links)
/04-technology       architecture docs (this repo's /architecture), ADR log, eval methodology +
                     latest Verification Quality Report, golden-corpus datasheet, OSS verifier repo
/05-security         SOC 2 status/reports (under NDA), pen-test summary + remediation log,
                     threat model, incident history (incl. near-misses — yes, really), policies
/06-legal            ToS/Privacy/DPA templates, counsel perimeter memo (§6 compliance.md),
                     subprocessor register, trademark filings, open-source license audit
/07-commercial       pipeline snapshot, pilot agreements, pricing history, churn/expansion detail,
                     source-provider contracts (redacted rates)
/08-team             org chart, hiring plan, comp philosophy + bands, key-person insurance status
```

Access tiers: T1 (post-first-meeting: 01 summary, 03, 04 public parts) → T2 (term-sheet stage: all, financial detail) → T3 (counsel-only: contracts). Every access is logged; the log is shared with the lead on request — a small flex that lands.

## 2. Diligence Checklist (what serious leads will ask; our state)

| Item | State | Notes |
|---|---|---|
| Clean cap table, no dead equity | ✅ | `cap-table.md`; 83(b)s filed, PIIA universal |
| IP chain of title | ✅ | all code under company; OSS inbound licenses audited (allowlist only) |
| Model-provider dependency memo | ✅ | two-provider policy + eval deltas (`../architecture/ai-architecture.md` §7) |
| Evidence-source contracts & concentration | ⚠️ open risk | R-2 on register; per-source exit plans; top source = ~30% of tier-A volume — mitigation roadmap in memo |
| Regulatory perimeter opinion | ✅ | outside-counsel memo, refreshed annually (`../legal/compliance.md` §6) |
| Security posture | ✅ trajectory | SOC 2 Type I mo 9 (dated plan), pen test scheduled; controls live |
| Eval integrity (can they audit our accuracy claims?) | ✅ | methodology doc + reproducible harness on golden corpus; investor's technical advisor can re-run it |
| Customer references | ✅ | 8 design partners opted in to reference calls |
| Litigation/claims | none | — |
| Related-party transactions | none | — |

## 3. Hard-Question FAQ (answers we give verbatim — pre-agreed, honest)

**"What if OpenAI/Anthropic ships this natively?"** They monetize generation horizontally; adjudication-with-liability is a vertical trust business requiring evidence contracts, rubric IP, audit substrate, and a refusal-first UX that suppresses engagement metrics platforms optimize. We're their customer via a routing layer — if one ships "verified answers" (risk R-4), our counter is depth (deal-type rubrics), the ledger standard, and source relationships. We'd rather compete on rigor than fluency.

**"Your COGS is model-provider rent. What at scale?"** Today $11/memo, target $4 (routing to small models for extraction, evidence caching, batch adjudication). Credit price floor ≥2.2× COGS is a standing pricing rule; the $/memo dashboard is reviewed weekly and is in the board pack. If compression stalls (R-3), price holds and we sacrifice free-tier depth first — pre-decided.

**"Isn't UNKNOWN-heavy output a churn machine?"** Activation data says the opposite for our ICP: buyers churn from *wrong*, not from *honest*. UNKNOWNs convert into the close-the-unknowns worklist — our stickiest surface. We track "UNKNOWN resolution rate" as a retention leading indicator. If we're wrong about this, the model breaks and we'll see it in cohort week 4 — kill criteria are written down (`../roadmap/mvp.md` §6).

**"What does VERIFIED mean legally?"** A defined term: evidence support under a published, versioned rubric at a point in time — not a warranty of truth (`../legal/tos.md` §2.3). We are not an appraiser, adviser, or CRA, and the product structurally can't emit advice. Counsel memo in /06.

**"Two founders, no revenue — why $16M post?"** Priced against: working end-to-end system (not a deck), 320-deal labeled corpus (expensive to replicate), 25 committed design partners, and a defined 24-month proof plan with self-imposed kill criteria. If the milestones read as under-priced risk to you, we'd rather hear it now — we optimized for a partner who buys the discipline.

**"Key-person risk?"** Real. Mitigations: unusually complete written doctrine (this repo — the company runs on documents, not tribal memory), cross-training from hire #1, key-person insurance at close, and a hiring plan where #3–6 are senior enough to carry.

**"What kills this company?"** Ranked honestly: R-1 a public verification failure (mitigated by refusal-first design + incident doctrine of radical disclosure), R-2 evidence-source revocation, R-3 COGS trap, R-4 platform bundling. Register with mitigations: `../business/risk-register.md`. We'd rather you hear the failure modes from us with countermeasures attached.

**"Why won't CoStar/data incumbents do this?"** Their revenue is sell-side-and-buy-side data licensing; adjudicating claims *against* listings their customers publish is channel conflict. They're acquirers, not competitors — which we neither optimize for nor ignore.

**"Marketplace (Phase 3) feels like a different company."** It's sequenced behind API traction and gated (board decision, counsel re-review for broker-dealer perimeter). Cut it from the model and Y5 ARR drops ~$6M; the core still clears venture math. It's upside, not load-bearing.

## 4. Technical Diligence Protocol (we volunteer this)

We offer the investor's technical advisor: (1) architecture walkthrough with the CTO against this repo; (2) **reproduce our accuracy claims** — run the eval harness on the golden corpus themselves; (3) tamper test — modify any exported ledger byte, watch the OSS verifier catch it; (4) code-review sampling of `domain-core` invariant tests; (5) on-call/incident history raw. A verification company that fears verification is a tell — we lead with it.

## 5. Reverse Diligence (questions we ask leads)

Fund reserves for A/B follow-on; track record with fail-closed/compliance-heavy products (patience profile); references from two founders whose companies *struggled*; who joins the board and their operating cadence; house view on AI-provider concentration risk. We're pricing partnership, not just capital (`fundraising.md` §5).
