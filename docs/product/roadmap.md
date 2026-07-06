# DealPilot — Company & Product Roadmap
Status: Approved · Owner: CEO/Head of Product · Phase deep-specs: `../roadmap/mvp.md`, `../roadmap/v1.md`, `../roadmap/enterprise.md`. Roadmap is milestone-gated, not date-worshipping; dates below are planning anchors.

## 30 Days
- Incorporate, seed close mechanics, PIIA/vesting signed, banking ×2.
- Golden corpora v0: 80 RE deals + 40 CIMs hand-labeled (Evidence Ops).
- Architecture spikes closed with ADRs: event store, Temporal, model routing (see `../architecture/system-design.md` §9).
- Walking skeleton: URL→ingest→extract→ledger event→stub memo, deployed to staging with CI.
- Sign top-3 evidence-source contracts; adapter interface frozen v0.
- 25 design partners recruited (12 RE / 10 searcher / 3 corp dev), interview cadence set.

## 90 Days
- MVP internal-complete per `../roadmap/mvp.md`: P0 FRs 1–7, 10 for RE vertical; SMB extraction alpha.
- Deterministic citation checker + offline ledger verifier v0 (open-sourced repo scaffold).
- Red-team corpus v1 (hostile docs) wired into CI.
- Private beta: 25 design partners live; weekly teardown reviews.
- Pricing live end-to-end in test mode; SOC 2 tooling instrumented.

## 6 Months
- **Public launch** (marketing `§5` playbook): RE + SMB CIM verticals GA.
- Metrics gates: activation ≥30% (path to 40), auto-verification ≥60% (path to 70), p95 <12 min (path to 10).
- Pipeline inbox (FR-11) beta; Team plan beta.
- First accuracy report published (self-audited, third-party audit scheduled).
- Hiring at 9–10; founder-led enterprise discovery: 15 corp-dev conversations logged.

## 12 Months
- V1 complete per `../roadmap/v1.md`: collaboration/approvals (FR-8/9), memo templates, credit system polish, coverage map.
- $600K+ ARR, 380+ paid seats, 6 Team accounts, 1 lighthouse enterprise pilot→contract.
- SOC 2 Type I; pen test #1; accuracy report v2 third-party audited.
- API alpha with 3 design partners (MCP server deferred to post-Series-A — `../business/review-response.md` RR-9).
- Series A prep pack refreshed from live model.

## 24 Months
- Enterprise GA per `../roadmap/enterprise.md`: SSO/SCIM, private connectors, approval chains, audit export/SIEM.
- $1.8M+ ARR; 6+ enterprise logos; NRR ≥105%; verification GM ≥72%. **Series A closes.**
- SOC 2 Type II; Evidence Graph v2 (cross-deal fact reuse cutting COGS ~30%).
- Underwriting API GA; first "Verified by DealPilot" marketplace partner.
- Team 20–24.

## 5 Years
- **Yr 3:** Lender vertical (compliance-gated), $9M ARR, 48 people; marketplace beta (expert tasks) in 2 metros; Series B.
- **Yr 4:** Marketplace GA with 20–25% take; benchmarks/data products (opt-in); UK/CA data expansion; $22M ARR.
- **Yr 5:** "DealPilot Verified" as recognizable standard in wedge markets; API = 20%+ of revenue; outcome-calibrated risk scores v1 (trained on consented decision-outcome pairs); $46M ARR, 148 people; category leadership defensible in analyst coverage.

## Standing Gates (apply at every phase)
1. No vertical opens without golden corpus + counsel review.
2. No motion scales before payback proof (`../business/business-plan.md` §5).
3. No feature ships that can produce an unattributed assertion — architecture makes this nearly impossible; process catches the rest.
4. Roadmap review monthly; kill-criteria honored (e.g., searcher wedge economics reviewed mo 9, risk R-43).
