# DealPilot — Product Requirements Document (v1)
Status: Approved · Owner: Head of Product · Scope: MVP → V1 (mo 0–14) · Personas detail in `personas.md`; phased specs in `../roadmap/`.

## 1. Problem Statement

Professional buyers evaluate deals built on unverified seller claims. Manual diligence is slow ($5–50K, 2–8 weeks); generic AI is fast but untrusted because it asserts without evidence. There is no tool that ingests a deal, verifies its claims against primary sources, and produces an auditable evidence memo with honest uncertainty.

## 2. Goals (product-level, 12 months)

| G# | Goal | Metric | Target |
|---|---|---|---|
| G1 | Buyers trust the output | % memos rated "would show my partner/IC" | ≥80% |
| G2 | Verification is real, not theater | Claim auto-verification rate on supported deal types | ≥70% |
| G3 | Speed changes behavior | p95 standard deal → memo | <10 min |
| G4 | Honest uncertainty is legible | % memos with populated UNKNOWN section user marks "useful" | ≥60% |
| G5 | Business works | Activation (verified memo ≤24h of signup) / paid conversion | 40% / 9% |

## 3. Personas (summary)

**P1 Investor Rachel** — RE investor, 12 units, underwrites ~30 deals/quarter nights-and-weekends. **P2 Searcher Sam** — full-time ETA searcher, 200 CIMs/yr, closes 1. **P3 Corp Dev Dana** — mid-market analyst, IC memos, needs sources or it's rejected. Full JTBD, pains, quotes: `personas.md`.

## 4. Functional Requirements

Priority: P0 = MVP gate · P1 = V1 · P2 = post-V1. Every FR ships with acceptance criteria (AC) that become automated tests where feasible (see `../engineering/testing.md`).

### FR-1 Deal Ingestion (P0)
Sources: listing URL, PDF/CIM upload (≤50MB, OCR fallback), structured manual entry, email-in (`deals@` pipeline inbox, P1).
**AC:** 1.1 Any supported input yields a Deal entity with source artifact stored content-addressed (SHA-256) in ≤60s. 1.2 Duplicate detection by artifact hash + entity match; duplicates link, never fork. 1.3 Unparseable input produces a specific, actionable error — never a silent empty deal. 1.4 Ingested artifacts are immutable; re-uploads version.

### FR-2 Claim Extraction (P0)
Extract atomic, typed claims (numeric, categorical, boolean, textual) with source spans.
**AC:** 2.1 Recall ≥90% on numeric claims vs golden corpus (per deal type); precision ≥95% span-accuracy. 2.2 Every claim stores: type, value, unit, source artifact hash, char/page span, extraction model+prompt version. 2.3 No claim exists without a source span — enforced at the schema level. 2.4 User can add/edit claims; user-added claims are provenance-tagged `user-asserted`.

### FR-3 Evidence Collection (P0)
Pluggable source adapters (county records, MLS-derived data, business registries, permits, market comps, financial data) gather evidence for each claim.
**AC:** 3.1 Every evidence item carries mandatory provenance: source id, retrieval timestamp, method (api/licensed/user-supplied), raw artifact hash, adapter version. 3.2 Adapter failures degrade to claim status UNKNOWN with a machine-readable reason — never to absence. 3.3 Collection is parallel; per-deal wall-clock ≤6 min p95 for standard deals. 3.4 Users can upload evidence against a specific claim (P0) with same provenance rules.

### FR-4 Verification & Adjudication (P0)
Assign each claim a status: **VERIFIED · CORROBORATED · REPORTED · CONTRADICTED · UNKNOWN** per the public rubric (ai-architecture §2).
**AC:** 4.1 100% of claims have a status; pipeline cannot complete otherwise (fail-closed). 4.2 Every non-UNKNOWN status cites ≥1 evidence item hash; CONTRADICTED cites both sides. 4.3 Adjudication is deterministic-first (exact/tolerance match rules) before any model judgment; model adjudications record rationale + confidence. 4.4 Rubric version recorded per claim; rubric changes re-open affected claims. 4.5 Status-change events are appended, never overwritten.

### FR-5 Risk & Valuation Engine (P0 RE, P0 SMB basic)
Per-vertical methods: RE = comps + income (cap rate/DSCR/cash-on-cash with sensitivity); SMB = SDE/EBITDA multiple ranges with adjustment ledger.
**AC:** 5.1 Output is a **range** with named drivers and per-driver sensitivity (tornado data). 5.2 If inputs above materiality threshold are UNKNOWN/CONTRADICTED, engine refuses a range and emits "cannot value — blockers: [claims]" (fail-closed). 5.3 Every number in the valuation traces to claim IDs or explicit user assumptions listed in an Assumptions block. 5.4 Methods and formulas are user-visible (methodology panel).

### FR-6 Decision Memo (P0)
Composed memo: **evidence band** — Substantiated / Substantiated with open items / Material contradictions / Cannot evaluate — describing the state of the evidence, never recommending an action (perimeter rule `../legal/compliance.md` §6; “Pursue/Pass”-style verdicts are prohibited output vocabulary), plus evidence summary, contradiction call-outs, valuation, **Unknowns & how to close them**, appendix of all claims+statuses.

**Canonical definition — "decision memo":** an evidence memo used to support a *human* transaction decision. It describes claim support, contradictions, unknowns, and valuation assumptions; it does not recommend whether to transact. All docs inherit this definition.
**AC:** 6.1 Every assertive sentence carries ≥1 claim-ID citation; a deterministic checker blocks publication otherwise (zero tolerance). 6.2 UNKNOWN section is mandatory and cannot be suppressed. 6.3 Export: PDF + JSON + verifiable ledger bundle (offline-checkable, see FR-7). 6.4 Memo regeneration with identical inputs+versions is byte-stable in content (replayable).

### FR-7 Audit Ledger (P0)
Append-only, hash-chained event log of the entire run: artifacts, claims, evidence, adjudications, model/prompt versions, human actions.
**AC:** 7.1 Each event includes prev-hash; chain verifies with the open-source offline verifier. 7.2 Export bundle verifies with zero DealPilot dependencies (toolkit shares no code with pipeline). 7.3 Tampering any byte fails verification. 7.4 Ledger read access is org-scoped; retention per policy with legal-hold support.

### FR-8 Human Review & Approval (P0 basic, P1 workflow)
Reviewer roles; approve/annotate/override with mandatory reason; overrides recorded as first-class ledger events.
**AC:** 8.1 Deals above configurable thresholds require approval before "final" state. 8.2 Attestations are immutable and identity-bound. 8.3 An override never edits history — it appends.

### FR-9 Workspaces & Collaboration (P1)
Org/workspace model, shared pipeline, comments anchored to claims, roles (viewer/analyst/reviewer/admin).
**AC:** 9.1 RBAC enforced server-side on every read path (tests in CI). 9.2 Claim-anchored comments survive memo regeneration.

### FR-10 Billing & Credits (P0)
Per `../business/pricing.md`: subscriptions, credit ledger, estimates, caps.
**AC:** 10.1 Pre-run estimate within ±20% of actual for standard deals. 10.2 Hard caps halt spend mid-run gracefully (partial results + UNKNOWNs). 10.3 Credit ledger reconciles to billing events exactly.

### FR-11 Pipeline Inbox (P1)
Email-forward ingestion, auto-shallow-screen, daily digest.
**AC:** 11.1 Forwarded listing → screened card in ≤10 min. 11.2 Sender verification prevents cross-org injection.

### FR-12 Underwriting API alpha (P1) — read `../engineering/api.md`.

## 5. Representative User Stories (format: persona / story / AC ref)

1. Rachel: "Paste a listing URL, get told within minutes whether the rent claim survives county + market data." → FR-1,3,4 (AC 4.2)
2. Sam: "Upload a CIM and see every financial claim ranked by verification status so I know what to grill the broker on." → FR-2,4,6
3. Sam: "See exactly which unknowns a $15K QoE would close before I spend it." → FR-6 (Unknowns section maps to closure actions/costs)
4. Dana: "Export a memo where every sentence has a source my IC can click." → FR-6.1, FR-7
5. Dana: "Require my MD's sign-off before any memo is finalized for our investment committee." → FR-8
6. Rachel: "When the county data is stale, tell me it's stale — don't average it away." → FR-3.2, FR-4 (UNKNOWN semantics)
7. Admin: "Prove to our auditor nothing was edited after approval." → FR-7 offline verification
8. Any: "Cap this deal at 20 credits; stop and show me partials if it needs more." → FR-10.2

## 6. Non-Functional Requirements

| NFR | Requirement |
|---|---|
| Latency | p95 standard deal → memo <10 min; interactive reads p95 <300 ms |
| Availability | 99.9% app; pipeline degradation policy = queue + honest ETA, never silent drop |
| Integrity | Ledger tamper-evidence (FR-7); zero unattributed assertions (FR-6.1) |
| Isolation | Org-scoped everything; isolation test suite in CI |
| Privacy | PII detection at ingest; retention schedules engineered (`../legal/privacy.md`) |
| Accessibility | WCAG 2.1 AA for core flows in DoD |
| Cost | Per-run budget enforcement; org-level cost observability |

## 7. Success Metrics & Instrumentation

North star: **weekly verified memos per active org.** Supporting: activation rate (24h verified memo), claim auto-verification %, contradiction catch rate (validated by sampling), UNKNOWN-usefulness rating, time-to-decision delta (pilot studies), NRR, verification gross margin. Every metric definition is versioned in `/analytics/metrics.yml`; dashboards in `../architecture/observability.md`.

## 8. Dependencies

Evidence-source contracts (top 6 signed pre-MVP) · model-provider agreements (≥2) · Temporal cluster · Stripe · SOC 2 tooling · golden corpora (200 RE deals, 120 CIMs, hand-labeled — Evidence Ops owns).

## 9. Non-Goals (v1 — enforced in scope court)

1. Autonomous purchasing or offer submission. 2. Consumer credit / tenant / employment screening (FCRA territory). 3. Formal appraisals. 4. Deal *sourcing*/marketplace listings. 5. Escrow/payments between parties. 6. International data coverage. 7. Guarantees of outcome — ever. 8. Chat-first UX: the memo is the product; chat is an accessory (P2).

## 10. Release Criteria (MVP gate)

All P0 ACs automated & green · golden-corpus recall/precision gates met · red-team suite (hostile docs) passing · 25 design partners through ≥3 deals each with ≥80% "would show my partner" · security review signed (`../architecture/security.md` checklist) · pricing live end-to-end · incident runbooks rehearsed once.
