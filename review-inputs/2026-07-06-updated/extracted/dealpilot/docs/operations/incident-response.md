# DealPilot — Incident Response
Status: Approved · Owner: Head of Platform (program), CEO (VI-class doctrine) · Companions: `runbooks.md`, `../architecture/observability.md` §6, `../legal/privacy.md` §10.

## 1. Severity Levels

| Sev | Definition | Examples | Response |
|---|---|---|---|
| **SEV-1** | Trust/integrity or total outage | ledger chain failure (RB-06), cross-tenant exposure, systematic wrong-VERIFIED, platform down, data loss | page all-hands-relevant now; IC in 5 min; exec on bridge in 15 |
| **SEV-2** | Major degradation, cohort-level impact | pipeline paused > 1 h, dual-provider outage, billing errors visible, tier-A source down | page; IC in 15 min; status page if customer-visible |
| **SEV-3** | Partial degradation, workaround exists | webhook delays, one adapter down, elevated latency in-budget | ticket + owner same day |
| **SEV-4** | Minor | cosmetic, isolated | backlog |

**VI class (Verification Integrity)** — orthogonal tag on any sev where *the correctness of published outputs* is in question (wrong statuses shipped, chain break, rubric misfire in prod). VI incidents carry extra obligations (§6): affected-memo identification, customer notice, and a **public postmortem** by default. Rationale: we sell trust; hiding a trust incident converts a bad week into a dead company (Risk R-1's mitigation is disclosure discipline, decided *now*, calm, not mid-crisis).

## 2. Roles (assigned at declaration; hats, not titles)

- **Incident Commander (IC):** owns coordination + decisions; explicitly *not* hands-on-keyboard; anyone trained can IC (training in onboarding month 2).
- **Ops Lead:** drives technical mitigation via runbooks.
- **Comms Lead:** status page, customer notices, internal updates (templates §5) — nothing external ships without IC sign-off; VI-class also CEO sign-off.
- **Scribe:** timestamped log in the incident channel (feeds the postmortem; memory is a liar under adrenaline).
Solo-on-call reality pre-Series A: on-call person ICs and mitigates until second responder arrives (target < 15 min for SEV-1/2).

## 3. Process

**Declare early, downgrade cheerfully.** Any employee can declare (`/incident` bot: creates channel `#inc-YYYYMMDD-slug`, pages per sev, opens the log doc).
Timeline discipline: T+5 IC named + sev set → T+15 initial internal assessment posted → T+30 customer-visible? status page up (SEV-1/2) → hourly IC updates (even "no change") → mitigation → **verification step is mandatory** (for anything touching pipeline/ledger: synthetic run green + chain segment verify — an incident isn't over because the graph dipped) → resolution notice → handoff to postmortem owner within 24 h.
IC decision defaults under uncertainty: prefer **pausing verification over degraded verification** (fail-closed applies to operations, not just code); prefer over-notifying customers to under; preserve evidence before fixing (especially RB-06/security).

## 4. Escalation Matrix

| Trigger | Escalate to |
|---|---|
| Any SEV-1 | CTO + CEO immediately |
| VI class | CEO (doctrine owner) + counsel if external statements needed |
| Suspected security/tampering | security lead; do-not-touch evidence rule; `../architecture/threat-model.md` scenarios |
| Personal-data breach possible | privacy owner + counsel; 72 h GDPR clock discipline (`../legal/privacy.md` §10) |
| Money wrong (billing/credits) | COO; make-good policy authority |
| Press/social attention | CEO only speaks; everyone else routes |

## 5. Communication Templates (pre-approved skeletons; fill facts, never speculation)

**Status page (initial):** "We're investigating [symptom] affecting [surface] since [UTC time]. Verification runs [continue / are paused — new runs will queue]. Next update by [time]." *(Note the honesty pattern: if we paused on purpose, say so proudly — "we pause rather than guess" is on-brand even mid-incident.)*
**Status page (resolved):** "[Surface] recovered at [time]. Root cause category: [config/deploy/provider/etc.]. [N] runs were delayed; none produced unverified output. Postmortem: [link within 5 business days]."
**Enterprise direct notice (VI class):** facts known / affected memo IDs (from ledger query — this is why the ledger exists) / what statuses may be impacted / what we've re-verified / what we ask of them / named human + direct line.
**Internal update cadence:** IC posts hourly: *status / impact / actions in flight / next decision point / help needed.*

## 6. VI-Class Obligations (the doctrine under fire)

1. Identify blast radius **from the ledger** (query affected runs by rubric/prompt/model version window — this query is pre-written and drilled).
2. Re-verify affected memos; corrected memos ship as *new revisions* with a visible correction notice — originals remain (append, never mutate; same rule as claims).
3. Notify affected customers directly before any public statement.
4. **Public postmortem within 10 business days**, default-on (CEO can defer only with written reason to the board). We mark our own homework publicly; the OSS verifier means someone else eventually would anyway — better it's us, first, with fixes attached.
5. Register update: the incident maps to a risk (existing → likelihood re-scored; novel → new entry with owner).

## 7. Postmortems (blameless, useful, shipped)

Owner assigned at resolution; draft in 5 business days; review meeting ≤ 30 min. Template: timeline (from scribe log) / impact quantified (runs, customers, credits refunded) / root cause **as system conditions, never as a person** / what went well / where we got lucky (the underrated section) / action items — each with owner + date, tracked like product work, reviewed at the weekly ops meeting until closed. Rule from `../engineering/testing.md` §9: an S1 rooted in a missing test class adds that class to the TDD plan same week. Metrics: MTTD, MTTM, action-item closure rate (board pack, quarterly, honest).

## 8. On-Call

One platform rotation until mo 12, then platform + AI-quality rotations (`../architecture/observability.md` §6); week-long shifts, handoff doc Fridays; comp: flat weekly stipend + recovery time after rough nights (tracked, actually taken — martyrdom is an outage risk). Page hygiene reviewed monthly: any alert that paged without action gets fixed or demoted (alert fatigue kills response times more than any tooling gap). Founders stay in the rotation through Series A — the pager is the truest product-feedback channel we own.

## 9. Practice

Quarterly game days (chaos scenarios from `../engineering/testing.md` §6, scored: detection → correct runbook → mitigation time); annual full DR exercise (RB-11, timed against RTO); tabletop rotation includes one VI-class scenario per year with comms drafted for real (the hardest muscle is writing the honest paragraph under pressure — so we rehearse the writing, not just the fixing).
