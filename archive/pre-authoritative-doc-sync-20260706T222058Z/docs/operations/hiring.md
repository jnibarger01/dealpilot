# DealPilot — Hiring Plan & Talent Operations
Status: Approved · Owner: CEO · Headcount plan reconciles to `../business/financial-model.md` (EOY: 11 / 23 / 48 / 88 / 148).

## 1. Philosophy

Hire people who find the doctrine *relieving*, not constraining — engineers who've shipped confident-but-wrong systems and hated it. Small senior core over large junior sprawl through Series A. Every hire must raise the team's median on at least one axis (craft, judgment, ownership). No brilliant jerks: a doctrine company run on trust cannot metabolize them, at any skill level.

## 2. The First 11 (Year 1 sequence; founders = #1–2)

| # | Role | Month | Why this order |
|---|---|---|---|
| 3 | Founding Engineer — Platform (TS, event-sourcing) | 1 | ledger + pipeline spine is the company |
| 4 | Founding Engineer — ML/Verification (Py) | 1 | adjudication quality is the product |
| 5 | Founding Engineer — Full-stack/Product | 2 | activation flow F1 (`../product/ux.md`) needs an owner |
| 6 | Founding Designer (product, systems-minded) | 3 | uncertainty-first UX is novel design work, not skinning |
| 7 | Evidence & Data Lead (source contracts + corpus ops) | 4 | R-2 mitigation is a job, not a hope; owns golden corpora |
| 8 | Founding Engineer — Platform #2 | 5 | API + billing surface |
| 9 | Founding GTM (growth PM profile, PLG-literate) | 6 | launch owner; founders can't split-focus at launch |
| 10 | Verification Reviewer / AI-Quality Analyst | 7 | HITL queues (`../architecture/ai-architecture.md` §11) staffed before launch |
| 11 | Ops / Chief of Staff (finance-literate) | 9 | billing ops, compliance program legwork (Drata), board pack |

Explicitly deferred: sales hire (founder-led until enterprise pilot #3 — `../business/sales.md` §5), security FTE (mo 12 per `../architecture/security.md` §14), support (founders + reviewer absorb until v1).

## 3. Year 2 (11 → 23)

+4 engineers (incl. first infra-focused SRE-profile), +1 designer, +2 reviewers (review throughput scales with memo volume — modeled ratio 1 reviewer : ~900 memos/mo at target auto-verification), +1 AE + +1 SDR (post-pilot-playbook proof), +1 CS/onboarding, +1 security engineer, +1 finance/ops. Trigger-based, not calendar-based: each req unlocks on a metric (e.g., AE #1 unlocks at 3 closed pilots; SRE at first SLO-budget exhaustion event).

## 4. Hiring Loop (structured, same bar every time)

1. **Screen** (30 min, hiring manager): motivation + trajectory; explicit perimeter/doctrine preview — self-selection starts here.
2. **Craft interview** (role-specific, 60–90 min): engineers do a *paid* work-sample (4 h async, real-shaped problem from our domain — e.g., "implement + test one Claim invariant"; never free spec work, never LeetCode).
3. **Doctrine interview** (60 min, the signature round): candidate is handed a *wrong but confident* memo and must find the failure, argue with a founder defending it, and propose the systemic fix. We're testing epistemic backbone — will this person mark UNKNOWN under pressure to ship?
4. **Team fit** (values, not vibes: structured questions against the six values in `../business/executive-summary.md`).
5. Debrief within 24 h; written scorecards before discussion (anti-anchoring); any strong-no with articulated reasoning can block — false negatives cost less than false positives at this stage.
References: 3 minimum, at least one *not* on the candidate's list ("who was your toughest peer? may we call them?"), calls done by founders through hire #15.

## 5. Sourcing & Diversity

Channels ranked by observed quality: (1) design-partner and OSS-verifier community (people who already believe), (2) second-degree founder network with named-person asks, (3) targeted outreach to engineers at companies whose postmortems showed integrity culture, (4) selective agencies for #7 and exec roles only. Diversity: structured loop + work-samples are the substrate; sourcing rule = no shortlist advances with a homogeneous top-3 until we've genuinely worked two additional channels; report demographics honestly to the board even while small (n is small; trends still form).

## 6. Onboarding (first 2 weeks, checklist-driven)

Day 1: ship a real change to prod through the full pipeline (`../engineering/ci-cd.md` §10). Week 1: glossary quiz (`../engineering/coding-standards.md` §3), perimeter training (`../legal/compliance.md` §9), read exec-summary + PRD + this repo's architecture core, shadow 10 human-review cases. Week 2: own one runbook (read, then run its drill in staging), first on-call shadow, 30/60/90 written with manager (30 = context + small ships; 60 = owns a surface; 90 = raised the median somewhere visible). Buddy assigned; buddy load capped at 1.

## 7. Compensation Philosophy & Bands (seed stage; refreshed at A)

Cash at 50–60th percentile of Pave/Carta benchmarks for stage-adjusted market; equity at 75th — we pay ownership because we demand ownership. Location: national band, single tier (remote-first, SF/KC-agnostic; ±0 geo adjustment — simplicity beats optimization at 11 people). Transparent internal bands from day 1 (levels L3–L6 pre-A):

| Role | Cash | Equity |
|---|---|---|
| Founding Engineer (#3–5) | $165–195K | 0.75–1.5% |
| Founding Designer | $150–180K | 0.5–1.0% |
| Evidence & Data Lead | $150–175K | 0.4–0.8% |
| Founding GTM | $140–170K + variable | 0.4–0.8% |
| Reviewer/Analyst | $85–110K | 0.1–0.25% |
| Ops/CoS | $120–145K | 0.2–0.4% |

Grants per `../investor/cap-table.md` §5 (4/1/monthly, 10-y exercise window ≥2 y tenure — we advertise this; it's a real differentiator). Annual comp review; no negotiation-based raises (band moves are systemic, not squeaky-wheel).

## 8. Performance & Departures

Quarterly written feedback (lightweight: keep/start/stop + one growth bet); no stack ranking at this size. Underperformance: named gap, 30-day supported plan, honest call — slow decisions are the expensive kind. Departures: 2-week knowledge-transfer checklist (runbooks re-owned, ledger access revoked day-of per `../architecture/security.md` §2), exit interview synthesized to the board pack. Regretted-attrition target: < 10%/yr; every regretted loss gets a written postmortem like an incident, because it is one.
