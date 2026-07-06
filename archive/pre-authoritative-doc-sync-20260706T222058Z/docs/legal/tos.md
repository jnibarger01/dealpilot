# DealPilot — Terms of Service (Outline)
Status: Counsel-review draft outline · Owner: COO · Internal outline; outside counsel finalizes public text. The disclaimer architecture in §2–3 is load-bearing for the regulatory perimeter (`compliance.md` §6) — changes require counsel + CEO sign-off.

## 1. Agreement, Accounts, Plans

Parties, acceptance (click-through self-serve; MSA supersedes for enterprise §11); account responsibilities (accurate info, credential security, org admin authority over members); plan definitions incorporate the pricing page by reference (`../business/pricing.md`); beta features flagged as-is.

## 2. Nature of the Service (the critical section — plain language, unmissable placement)

1. **Decision support, not advice.** DealPilot provides research assistance and evidence verification. Outputs are **not** investment, legal, tax, accounting, or lending advice, and **not** a recommendation to transact. No fiduciary or advisory relationship is created.
2. **Not an appraisal.** Valuation outputs are analytical estimates, not appraisals under USPAP or any jurisdiction's appraisal law, and may not be used where a certified appraisal is required.
3. **What statuses mean.** VERIFIED/CORROBORATED/REPORTED/CONTRADICTED/UNKNOWN are defined terms (definitions incorporated from published rubric docs): they describe **evidence support under our rubric at a point in time**, not guarantees of truth, completeness, or future condition. Sources can be wrong, stale, or incomplete; we surface provenance so users can judge.
4. **UNKNOWN and REFUSED are features**: the service will decline to output figures it cannot support; this is not a defect.
5. **User responsibility.** Decisions, and verification of anything material to them through professional channels, remain the user's.

## 3. Acceptable Use

Prohibited: (a) using outputs to make or market **consumer credit eligibility decisions** (FCRA perimeter) — the service is not a consumer reporting agency and outputs are not consumer reports; (b) representing outputs as certified appraisals or as securities offering materials/marketing; (c) removing citation/watermark/provenance markings or misrepresenting tampered exports as DealPilot outputs (verification hooks: `../architecture/threat-model.md` §5); (d) scraping, benchmarking-for-resale, or bulk extraction beyond plan limits; (e) uploading content you lack rights to process; (f) attempting to defeat sandboxing, injection defenses, or tenant isolation (violation = immediate suspension); (g) reselling outputs as-a-service without a partner agreement. Enforcement ladder: warn → suspend → terminate; egregious integrity attacks skip to terminate.

## 4. Customer Content & License

Customer owns Customer Content and the memos generated for them. Customer grants us a limited, non-exclusive license to process content **solely to provide the service** (mirrors `privacy.md` §3); no training without opt-in; feedback license standard. We retain all rights in the platform, rubrics, prompts, models' orchestration, and aggregate learnings that contain no Customer Content.

## 5. Evidence & Third-Party Sources

Evidence excerpts appear under license/fair-use with provenance; customers may not redistribute source content beyond memo context; source availability may change (we disclose source coverage; loss of a source is handled per §8 service changes — Risk R-2 posture).

## 6. Credits & Billing

Credits: consumed per run by published schedule; **unused subscription credits roll 12 months then expire**; purchased top-ups expire 12 months; consumed credits non-refundable (failed runs auto-refund per policy — `BudgetExceeded`/system-fault runs are on us). Subscriptions renew automatically; cancel anytime effective end of period; **pause plan** ($29/mo) preserves data + read access. Dunning: failed payment → grace 10 d → verification disabled (read/export never disabled for paid-through data) → data retention per `privacy.md` §4. Taxes via Stripe Tax; price changes: 30-d notice, never mid-term.

## 7. Warranties & Disclaimers

Mutual authority warranties; our service warranty limited to material conformance with documentation; otherwise **AS IS / AS AVAILABLE**, no implied warranties (merchantability, fitness, non-infringement) to the extent permitted; **no warranty that any status is error-free or that evidence sources are accurate** — the remedy architecture is transparency (ledger, provenance, re-runs), stated as such.

## 8. Service Changes

We may modify features with notice for material reductions (30 d); rubric versions are published and memos pin the version used (`../architecture/ai-architecture.md` §2) — historical memos remain interpretable under their rubric.

## 9. Liability & Indemnity

Cap: **12 months' fees paid**; excluded: indirect/consequential/lost-profits; carve-outs from cap (customer's misuse under §3, either party's IP infringement indemnity, confidentiality breach) per market norms. Customer indemnifies for content it had no right to upload and for prohibited-use claims; we indemnify for third-party IP claims against the unmodified service. **No liability for decisions made using outputs** — ties to §2 (counsel to harden per jurisdiction).

## 10. Term, Termination, Data Export

Either party may terminate per plan terms; for cause with cure period (30 d, none for §3(f)). Post-termination: **30-day export window** (memos, artifacts, full ledger export — the exit story is a trust feature: `../business/marketing.md`), then deletion per `privacy.md` §4. Sections surviving: 2, 3 (residuals), 4 (ownership), 7, 9, 12.

## 11. Enterprise Deltas (MSA framework)

Order forms; negotiated SLA (99.9% + credits schedule), support tiers, DPA + subprocessor terms, security exhibit (SOC 2 reports under NDA), custom retention/residency where offered, audit rights (annual, notice, non-disruptive), insurance minimums (E&O incl. tech/AI coverage — procurement note for our own policy at launch).

## 12. General

Governing law Delaware; disputes: informal 30 d → binding arbitration (AAA) with **individual opt-out window** (30 d) and small-claims carve-out; class waiver where enforceable; notices; assignment (customer consent except M&A); force majeure; entire agreement; severability. Changes to ToS: 30-d notice, continued use = acceptance, material changes emailed.
