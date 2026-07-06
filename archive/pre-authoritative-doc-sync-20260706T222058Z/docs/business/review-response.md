# DealPilot — External Review Disposition (2026-07-06)
Status: Closed · Owner: CEO/CTO · Source: external agent review, overall score 58/100, "would not invest at $16M post on docs alone."

Method: every finding was **verified against the repo before disposition** (the reviewer gets the same treatment our memos give sellers). Dispositions: **ACCEPTED** (doc changed this pass), **PARTIAL** (part accepted, part rejected with rationale), **ALREADY-TRACKED** (finding restates an existing gate/risk — cited), **REJECTED** (with a falsifiable revisit trigger where honest).

## 0. Verification of the review's own evidence

| Reviewer claim | Repo check | Result |
|---|---|---|
| Product emits "Pursue / Pass / Cannot evaluate" verdicts | `../product/prd.md` FR-6 said exactly this (session-1 doc), directly contradicting `../legal/compliance.md` §6.1 ("no buy/sell/pass outputs") written later | **SUBSTANTIATED — real cross-doc contradiction, the review's best catch** |
| Marketing claims "hallucination-free" / "structurally incapable of making it up" | `executive-summary.md` one-liner + elevator pitch, `marketing.md` trust pillar | **SUBSTANTIATED** |
| "Chat too early" | Chat appears only as non-goal #8 in `../product/prd.md` ("chat is an accessory, P2") | Overstated — already a non-goal |
| Seasonality, credit-confusion, reviewer-cost risks missing | Register rows 6, 19, 53 | Already tracked |

Reviewer accuracy verdict: high on the substantive catches, mild overreach on two. Findings graded accordingly below.

## 1. Dispositions

**RR-1 — Evidence-source dependency (reviewer P0).** ALREADY-TRACKED (R-2, top of register; MVP already one-metro; RB-03 outage runbook + drills exist) **+ ACCEPTED sharpener**: fallback map per blocking claim type is now an MVP requirement — no blocking type may depend on a single source without a documented manual-evidence path (`../roadmap/mvp.md` §2).

**RR-2 — "Users pay for refusals" unproven (P0).** ALREADY-TRACKED — this is verbatim the MVP kill criterion (`../roadmap/mvp.md` §6, hypothesis H1). **+ ACCEPTED instrumentation**: export/forward behavior added as a success gate (≥25% of active partners share a memo) — sharing refusal-heavy output is the strongest willingness-to-pay tell available pre-scale.

**RR-3 — Architecture overbuilt for seed (P0).** **ACCEPTED in substance.** New `../architecture/system-design.md` §10 defines the MVP profile (modular monolith + Temporal Cloud + Postgres-for-everything + S3 + Stripe) with measured graduation triggers for Kafka, OpenSearch, mesh, OPA, and service splits. Two pushbacks: **Temporal stays** (the workflow genuinely is long-running/retried/human-signaled; a hand-rolled job runner is the code we'd write worst) and **EKS-lite stays** (single small cluster; an ECS→EKS migration later costs more than thin EKS now). The reviewer's core point — the docs read as build-it-all-now — was correct and is now structurally false.

**RR-4 — Milestone stacking on $4M (P0).** PARTIAL. The gate ladder already sequences (mvp → v1 → enterprise; SOC 2 II and API GA sit in the enterprise tranche behind revenue proof, `../roadmap/enterprise.md` §2). **ACCEPTED**: the SMB wedge is now metric-gated, not calendar-gated (`../roadmap/v1.md`), and the deep-bear case (RR-11) documents what breaks if stacking fails. Seed-gate breadth itself is retained deliberately: those are Series-A market-clearing gates, and the downshift trigger is the pre-committed answer to missing them — the honest alternative to narrower gates is a smaller company, which is exactly what §4.3 produces on a miss.

**RR-5 — COGS credibility (P0).** PARTIAL. Per-claim-class and per-source cost instrumentation from day one: **ACCEPTED** (`../architecture/observability.md` §7 now explicit). Replacing credits with claim-class pricing: **REJECTED** — the reviewer's own risk #17 (credit confusion) argues against a more complex pricing surface; instead, credits-per-deal-type get **calibrated from measured distributions** (same data, simpler buyer contract).

**RR-6 — Regulatory perimeter fragile (P0).** **ACCEPTED — the critical finding.** The PRD verdict band was a genuine session-to-session contradiction with the compliance perimeter. Fixed across five docs: `../product/prd.md` FR-6 now specifies an **evidence band** (Substantiated / Substantiated with open items / Material contradictions / Cannot evaluate — describes evidence state, never action); Dana's user story reworded; `../product/ux.md` verdict language → evidence-band language; the exec-summary/pitch tagline "decides whether they're worth buying" → "finds out what's actually true about them" (perimeter-safe, still has teeth). Counsel review of every output template was already policy (`../legal/compliance.md` §6); the templates now match the policy.

**RR-7 — Evidence-Graph moat vs privacy limits (P1).** PARTIAL/ALREADY-SPECIFIED. The reusable-asset boundary already exists precisely (`../architecture/ai-architecture.md` §8: public-facts-only global cache; `../legal/privacy.md` §3/§9: opt-in for anything trained). **ACCEPTED action** (contract-side, not doc-side): the four reusable classes — public facts, source-reliability metadata, anonymized aggregates, consented outcome data — get named in the DPA template at next counsel pass so the moat story and the data-rights story are the same story in writing.

**RR-8 — "VERIFIED is a dangerous word" (P0).** PARTIAL. Renaming to SOURCE-SUPPORTED: **REJECTED for now** — the vocabulary is load-bearing across product, API enums (`../engineering/api.md` §9 commits status semantics within a major version), and brand; and the ToS already defines VERIFIED as evidence-support-at-a-time, not truth. **Falsifiable revisit trigger** (so this is a decision, not a dodge): if the external red-team (RR-10) measures false-VERIFIED > 1%, or the first VI-class incident roots in status misreading, a rename RFC opens within a week. **ACCEPTED now**: user-facing VERIFIED always carries the evidence as-of date (`../architecture/ai-architecture.md` §2.2), and "hallucination-free"/absolute-accuracy claims are banned marketing vocabulary (`../business/marketing.md`) — the overclaim was real and is gone.

**RR-9 — Chat/API/MCP too early.** PARTIAL. Chat: already a non-goal (reviewer overstated). API alpha **stays** — design-partner-keys-only, and the Phase-3 API thesis needs spec feedback before GA freeze. MCP: **ACCEPTED, deferred to post-Series-A** (`../roadmap/v1.md`) — distribution upside doesn't beat launch-quarter focus.

**RR-10 — Corpus provenance unproven; external red-team required.** **ACCEPTED fully.** New MVP acceptance gate 7: independent reviewer, 50 real deals, **raw outputs**, report to the data room unedited (`../roadmap/mvp.md` §4). New `../architecture/ai-architecture.md` §13.6: corpus datasheets under external review, annual red-team, raw-output reporting policy. This was the review's second-best catch — internal evals were grading our own homework with our own key.

**RR-11 — Model a harsher case.** **ACCEPTED.** Deep-bear row added (`../business/financial-model.md` §8.1): activation −40%, source fees ×2, enterprise cycle ×2, compression 50% slower → FY3 ≈ $5.2M ARR; the company survives **only** via the automatic mo-18 downshift (cash-out ≈ mo 29 vs mo 24 without it). The stress test's real output is confirmation that the downshift trigger must stay automatic, not discretionary.

**RR-12 — Reviewer's top-20 risks.** Mapped: #1→R-2, #5→R-3, #6→R-53, #16→R-6, #17→R-19, #3→R-1, #20→fixed via RR-8; the remainder correspond to existing register entries or to dispositions above. No genuinely novel register entry required; register likelihoods unchanged pending MVP data.

## 2. What the review restated vs. what it found

Several P0s are the repo's own gates reflected back (RR-1, RR-2, RR-11's premise) — fair as emphasis, not new information; a reviewer confirming the kill criteria are the right kill criteria is useful signal, cheaply bought. The two findings that changed documents materially: the **perimeter contradiction** (RR-6) and the **staging gap** (RR-3), with RR-10's external-eval gate close behind. Score commentary: 58/100 for a pre-revenue docs-only company is roughly the score the repo assigns itself (`../investor/due-diligence.md` §3 answers "why $16M post" with milestones, not certainty); the number we're accountable to is the MVP acceptance table, not the review's rubric.

## 3. Applied-diff index (this pass)

`../product/prd.md` (FR-6 evidence band, story 5) · `../product/ux.md` (3 verdict→evidence-band edits) · `executive-summary.md` (tagline, hallucination-free, elevator) · `../investor/pitch-deck.md` (tagline) · `marketing.md` (trust pillar, banned absolutes) · `../roadmap/v1.md` (SMB metric gate, MCP deferral) · `../roadmap/mvp.md` (fallback map, gate 7 external red-team, share-rate success signal) · `financial-model.md` (deep-bear row) · `../architecture/ai-architecture.md` (as-of stamps, §13.6) · `../architecture/observability.md` (per-claim-class/source cost breakout) · `../architecture/system-design.md` (§10 build staging) · this file.
