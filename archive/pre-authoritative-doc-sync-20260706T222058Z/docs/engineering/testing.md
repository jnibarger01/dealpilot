# DealPilot — Quality Gates & Testing Program
Status: Approved · Owner: CTO · Companion: `tdd.md` (how tests are written), `ci-cd.md` (where they run). This doc is the *process* layer: definitions, gates, targets, triage.

## 1. Definition of Ready (a story may enter a sprint when…)

1. Problem + user value stated in one sentence; persona named.
2. Acceptance criteria written, testable, numbered (FR-x.y style).
3. Doctrine check: does it touch statuses, evidence, valuation, ledger, or money? → invariants impact noted; RFC/threat-model delta filed if surface changes.
4. Dependencies identified (contracts, sources, other teams); none blocking.
5. Estimable (≤ 3 days ideal; larger → split).
6. Telemetry expectations named (what metric proves it works in prod?).

## 2. Definition of Done (a story is done when…)

1. All ACs pass via named tests (`@ac` annotations, `tdd.md` §15).
2. Coverage/mutation gates green; no ratchet regression.
3. Reviewed per `coding-standards.md` §7 (incl. dual-review classes).
4. Deployed to staging; synthetics green; feature-flagged if risky.
5. Dashboards/alerts/runbook updated for new operational surface.
6. Docs updated (API reference, glossary, ADR if architectural).
7. Demo'd (async video fine) — if you can't demo it, it isn't done.

## 3. Quality Gates (merge → release ladder)

| Gate | Blocks | Criteria (source of numbers) |
|---|---|---|
| G1 Merge | PR | full §2 pipeline of `ci-cd.md` green; review complete |
| G2 Staging soak | prod promote | 2 h synthetics green; no new error signatures |
| G3 Release train (weekly cut for SDK/API/changelog) | public release | AC traceability matrix complete; OpenAPI diff reviewed; changelog human-written |
| G4 Quality gate (prompts/models/rubrics) | promotion past canary | eval suite ≥ baselines; citation pass ≥ 92%; injection corpus 100%; UNKNOWN drift within bands (`../architecture/observability.md` §2) |
| G5 Launch gates (per release phase) | GA milestones | `../roadmap/mvp.md` / `../roadmap/v1.md` exit criteria |

Any gate may be overridden only by CTO with a ledgered risk-acceptance note (expires in 30 days — accepted risks don't get to become permanent silently).

## 4. QA Model

No separate QA team; **quality is engineering's job, verified by machines and sampled by humans**: engineers own tests; the weekly quality review (Head of AI) samples ≥ 50 production memos with reviewer rubric; support-reported defects loop into golden corpora within 72 h (every real-world miss becomes a permanent regression test). Exploratory testing: monthly "break it" hour, whole team, prizes for the best fail-open discovery (there should never be one).

## 5. Load & Capacity Targets (authoritative table; k6 per `tdd.md` §8)

| Scenario | Target | Frequency |
|---|---|---|
| Read API sustained | 300 RPS, p95 < 300 ms, err < 0.1% | nightly |
| Verification concurrency | 500 concurrent runs, queue-age p95 < 60 s | nightly (stubbed) |
| Spike | 5× baseline for 10 min, no 5xx > 0.5%, autoscale < 3 min | weekly |
| Soak | 24 h @ 40% peak — zero leak/lag growth | weekly |
| Webhook fan-out | 50/s, first-attempt 99% < 30 s | weekly |
| Capacity headroom rule | prod peak must be < 50% of last passed load test | continuous check |

Targets re-baselined each quarter against growth model (`../business/financial-model.md` volumes ×3 safety factor).

## 6. Chaos Program

Weekly automated scenarios in staging + quarterly prod game-days (announced, guarded): the scenario catalog and pass criteria live in `tdd.md` §9; **each scenario must map to a runbook** (`../operations/runbooks.md`) and each game-day produces a scored report (detection time, correct runbook found, mitigation time). New failure mode discovered anywhere (incident, chaos, pen test) → catalog entry within a week.

## 7. Accessibility & Compatibility Gates

WCAG 2.1 AA (design gates in `../product/ux.md` §7): axe-core in CI on every UI route (zero criticals), manual screen-reader pass per release train on core flows (ingest → memo → evidence), keyboard-complete verification review flow (reviewers live in this UI all day). Browser support: last 2 evergreen versions + Safari; mobile-web smoke on memo reading (Rachel reads memos on-site — `../product/personas.md`).

## 8. Performance Review Cadence

Bench suite (`tdd.md` §12) trends reviewed monthly; any budget within 20% of ceiling gets a perf ticket *before* it breaches. Annual architecture perf review against scale triggers (`../architecture/system-design.md` §8).

## 9. Bug Triage & Defect SLAs

Single intake (support, monitoring, internal) → daily 15-min triage (rotating owner):

| Sev | Definition | Fix SLA |
|---|---|---|
| S1 | Integrity/trust: wrong VERIFIED, chain failure, cross-tenant, money wrong | Incident process now (`../operations/incident-response.md`); fix < 48 h |
| S2 | Core flow broken for a cohort; no workaround | < 1 week |
| S3 | Degraded w/ workaround | < 1 month |
| S4 | Cosmetic/minor | backlog, batched |

**Any S1 rooted in a missing test class → retro adds the class to `tdd.md` in the same week** (the plan is living or it's dead). Escaped-defect rate (prod bugs per release) is a tracked KPI with a downward target.

## 10. Test Environment Hygiene

Staging is prod-shaped (same charts, same versions, synthetic data only — scanner-enforced), reset weekly from IaC; ephemeral PR previews for frontends; golden corpora refreshed on version bumps only (deliberate, baselined). One rule above all: **an environment that lies to you is worse than none** — divergences from prod are tracked as tickets, not tolerated as folklore.
