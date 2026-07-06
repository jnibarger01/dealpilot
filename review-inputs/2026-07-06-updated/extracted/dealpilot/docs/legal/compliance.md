# DealPilot — Compliance Program
Status: Approved · Owner: COO (Compliance Lead at Series A) · Companions: `privacy.md`, `tos.md`, `../architecture/security.md`.

## 1. Posture & Phased Roadmap

Compliance is sequenced to sales reality: prosumer wedge needs privacy hygiene; Team plan needs SOC 2 Type I; enterprise needs Type II + procurement pack. We do not buy certifications before they unblock revenue, and we never claim one we don't hold.

| When | Milestone | Unblocks |
|---|---|---|
| Mo 0–3 | Policy register v1, DPAs with all subprocessors, privacy/ToS live | launch |
| Mo 3–6 | Drata instrumented, controls automated, tabletop #1 | audit readiness |
| **Mo 9** | **SOC 2 Type I** | Team plan credibility, early enterprise pilots |
| Mo 12 | GDPR/CCPA fully operational (DSAR drill passed), pen test #1 | EU prosumer, CA |
| **Mo 18** | **SOC 2 Type II** (12-mo observation started mo 6) | enterprise GA (`../roadmap/enterprise.md`) |
| Y3 | ISO 27001 evaluation (only if ≥3 deals blocked without it); EU AI Act conformance check | international enterprise |

## 2. SOC 2 (Security + Availability + Confidentiality criteria)

Control philosophy: **the ledger is our evidence engine.** Access grants, privileged actions, approvals, deploys, and overrides are already immutable events — auditor sampling becomes queries (`../architecture/security.md` §12). Mapping highlights:

| TSC area | Our control (already built, not bolt-on) |
|---|---|
| Logical access | WorkOS SSO+MFA, JIT elevation, quarterly reviews generated from ledger |
| Change mgmt | GitOps-only deploys, dual-control classes, signed images, CI gates (`../engineering/ci-cd.md`) |
| Risk mgmt | living risk register with owners (`../business/risk-register.md`), quarterly review |
| Monitoring | SLOs + integrity alarms (`../architecture/observability.md`), continuous ledger verifier |
| Availability | DR RTO 4 h/RPO 15 min, quarterly drills (`../architecture/infrastructure.md` §9) |
| Confidentiality | per-org keys, RLS backstop, content-free logs |

Tooling: Drata (procurement decision `../architecture/infrastructure.md` §11), budget $25–35K/yr + auditor $20–30K. Owner: COO; engineering liaison: Head of Platform.

## 3. GDPR

- **RoPA** maintained (processing activities per `privacy.md` §2).
- **DPIA** completed for the verification pipeline (automated analysis of documents containing third-party personal data — the one genuinely DPIA-worthy activity); refreshed on material pipeline changes.
- Art. 22 posture: outputs are decision support; human review available and ledgered — documented in DPIA and policy (`privacy.md` §9).
- DPO: not mandatory at current scale/activity (documented analysis, counsel-confirmed); designation decision revisited at Series A or on EU enterprise traction. EU representative appointed before EU GTM push.
- SCCs + TIAs on file for transfers; deletion via crypto-shred design (`privacy.md` §6) — position paper on immutability-vs-erasure kept counsel-reviewed.

## 4. CCPA/CPRA

Service-provider contract terms in DPA (no sale/share — true and stated); right-to-know/delete wired into the same DSAR runbook (RB-07); "Do Not Sell or Share" link not required for our model but privacy page states the position plainly; annual data-handling training for anyone with content access.

## 5. HIPAA — Not Applicable (with tripwire)

We do not process PHI and are not a covered entity or business associate; ToS prohibits uploading PHI. **Reassessment tripwire**: a healthcare-M&A vertical (facility acquisitions with patient data in diligence rooms) would change this — that vertical is explicitly deferred until we choose to build a BAA-ready enclave (board decision, costed separately). Until then: detection heuristics flag likely-PHI uploads for rejection.

## 6. Financial-Regulatory Perimeter (the existential fence)

Position, maintained with annual outside-counsel review + on any product change touching it:

1. **Not an investment adviser** (Advisers Act / state equivalents): no personalized recommendations, no "buy/sell/pass" outputs, no compensation tied to transaction outcomes. Composer templates structurally lack an advice slot (`../architecture/threat-model.md` §5 abuse case); output linter flags advice-language ("you should acquire…") as a release blocker.
2. **Not a consumer reporting agency (FCRA)**: no consumer-eligibility outputs; ToS §3(a) prohibition; enterprise contracts repeat it; sales trained to disqualify these use cases (it's in the sales playbook's disqualification list, `../business/sales.md`).
3. **Not USPAP appraisal**: "valuation range," never "appraised value"; disclaimer per `tos.md` §2.2; marketing banned-words list enforced (`../business/marketing.md` — "marketing must pass the doctrine").
4. **Not a broker-dealer**: no transaction facilitation, no success fees (marketplace Phase 3 pays experts for *analysis time*, not deal outcomes — structured deliberately; counsel re-review before marketplace GA).
5. **Badge & marketplace perimeter (Phase 3 pre-conditions)**: any "Verified by DealPilot" badge attests **process completion under a named rubric version** — never quality, endorsement, or outcome; badge license terms prohibit "endorsed/recommended by DealPilot" phrasing and require the signed technical attestation (register R-51); **who paid for a verification is itself a disclosed provenance fact** on the memo/badge (seller-paid is labeled seller-paid — the anti-capture rule made visible); no expert task assignment without a ledgered conflict disclosure (expert attests no interest in the transaction). Counsel opinion required before any badge GA covering endorsement/advertising liability, in addition to the broker-dealer review above.

Every employee-facing version: *we sell verified research, never advice, never eligibility, never appraisals.* Violations are S1-class incidents.

## 7. AI Regulation

- **EU AI Act**: current classification analysis = limited-risk/transparency-tier (decision-support with human oversight; not in Annex III high-risk categories as scoped — creditworthiness exclusion is why FCRA-adjacent use is banned, §6.2). Obligations tracked: AI-interaction transparency, output marking. Re-classified on any product scope change; conformance check Y3 with EU enterprise push.
- **US**: state AI-disclosure laws tracked (register below); FTC truth-in-AI posture — our marketing claims are eval-backed (Verification Quality Report, `../architecture/ai-architecture.md` §13) which is both ethics and Section-5 hygiene.
- **NIST AI RMF** mapping maintained (Govern/Map/Measure/Manage → our eval program, risk register, HITL, drift monitoring) — increasingly requested in enterprise security reviews; ours is real because the underlying machinery is.

## 8. Policy & Vendor Register

| Policy (v1 by mo 3) | Owner | Review |
|---|---|---|
| InfoSec, Access Control, SDLC/Change, Incident Response, BC/DR, Vendor Mgmt, Data Retention & Classification, Acceptable Use (internal), AI Use & Model Governance, Whistleblower | named individuals | annual + on incident |

Vendor register (with DPA/SOC2/exit-plan status per vendor): maintained in Drata, sourced from `../architecture/infrastructure.md` §12; new vendor = register entry before production use, no exceptions.

## 9. Training & Audit Calendar

Onboarding: security + privacy + **perimeter training** (§6 — everyone can recite the fence) within week 1; annual refreshers; phishing simulations quarterly. Calendar: Q-ly access reviews, Q-ly risk-register review, Q-ly tabletop (rotating `../architecture/threat-model.md` scenarios), semi-annual DSAR drill, annual pen test, annual policy review, annual counsel perimeter review, SOC 2 audit windows per §1. Compliance status is a standing board-pack section (`../business/fundraising.md` reporting cadence).
