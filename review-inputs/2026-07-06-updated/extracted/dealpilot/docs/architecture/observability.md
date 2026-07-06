# DealPilot — Observability
Status: Approved · Owner: Head of Platform · Stack: OTel-first → Grafana Cloud (LGTM: Loki/Grafana/Tempo/Mimir) per `infrastructure.md` §11.

## 1. Philosophy

Two nervous systems, equal rank: **infra health** (is it up, is it fast) and **verification quality** (is it *right*). A green infra dashboard with a drifting UNKNOWN-rate is an outage. Quality signals are engineered, alarmed, and on-call-owned like latency.

## 2. SLOs (customer-visible, error-budgeted)

| SLO | Target | Window | Budget policy |
|---|---|---|---|
| Verification run p95 latency (standard deal) | < 10 min | 28 d | burn-rate alerts 2%/1h page, 5%/6h page |
| API read p95 | < 300 ms | 28 d | same |
| API availability | 99.9% | 28 d | budget exhausted → feature freeze, reliability sprint |
| Projector lag p95 | < 2 s | 7 d | ticket at 5 s, page at 30 s |
| Webhook delivery (first attempt) | 99% < 30 s | 7 d | ticket |
| Citation-check pass rate (pre-recompose) | ≥ 92% | 7 d | quality review trigger below |
| Auto-verification rate (claims resolved without human) | ≥ 70% (v1) | 28 d | product KPI, alarmed on –5 pt drift |

Internal SLIs additionally tracked: extraction ms/page, adjudication p95/claim, $/memo (see §7), source-adapter success rate per source.

## 3. Metrics

OTel metrics from every service/worker via the `dp-service` chart defaults. Naming: `dp_<context>_<thing>_<unit>`. Cardinality discipline: org_id only on aggregable counters (top-N tenant views), never on histograms; claim-type and source-id are bounded label sets. RED per endpoint + USE per node group; Temporal server + per-task-queue depth/age exported (queue age is the earliest pipeline-stall signal → runbook RB-01).

## 4. Logging

Structured JSON (pino / structlog), levels enforced, **no PII and no document content in logs** (lint + log-scrubber middleware + CI grep of fixtures; evidence text lives in CAS, logs carry hashes and IDs only). Every log line carries `trace_id`, `org_id`, `run_id` where applicable. Retention: 30 d hot (Loki), 13 mo cold (S3), security/audit-relevant events are *also* ledger events (the ledger, not logs, is the audit system — logs are for debugging). Access to prod logs is itself logged.

## 5. Tracing

OTel traces end-to-end: gateway → service → Temporal workflow → each activity (extract/collect/adjudicate/compose/check) → model calls (provider, model, tokens, latency as span attrs) → ledger append. **`trace_id` is written into ledger events** — from any memo you can pull the exact distributed trace that produced it; from any trace you can find its immutable record. Sampling: 100% of verification runs (they're the product; volume is modest), 10% tail-based on read traffic.

## 6. Alerting

Page vs ticket discipline: pages are *customer-impacting or integrity-relevant only*; everything else is a ticket with an owner. On-call: single rotation (platform) until mo 12, then platform + AI-quality rotations. Escalation + SEV mapping in `../operations/incident-response.md`.

| Alert (selection) | Threshold | Route |
|---|---|---|
| SLO burn (any §2) | policy above | page |
| **Ledger chain verification failure** (continuous verifier job) | any | **page, auto-SEV-1** |
| Cross-tenant probe failure | any | page, SEV-1 |
| UNKNOWN-rate drift | ±5 pt vs 28-d baseline, 3 h sustained | page (quality on-call) |
| Citation pass < 88% | 1 h | page (quality) |
| Source adapter failures | > 20% for a tier-A source, 30 min | page → RB-03 |
| Model provider p95 > 3× baseline or error > 5% | 15 min | page → RB-02 (routing failover) |
| $/memo > $7 daily avg | daily | ticket → weekly cost review (R-3) |
| Temporal queue age > 5 min | 10 min | page → RB-01 |
| Stripe webhook backlog > 100 | 15 min | ticket → RB-09 |
| Anomaly tripwire volume spike (ai-arch §6.6) | 3× baseline | ticket (security) |

## 7. Verification-Quality & Cost Dashboards

- **Quality board** (weekly review meeting, Head of AI chairs): status distribution trends by claim type; UNKNOWN precision/recall vs golden set (nightly eval run in staging); auto-verification rate; human-review queue depth + overturn rate (how often reviewers flip the machine — rising overturns = rubric debt); contradiction detection on canary set; injection-corpus pass rate; per-model eval scores (two-provider comparison).
- **Cost board**: $/memo decomposed (model tokens by task, source fees, compute — broken out **per claim class and per source**, so credit calibration runs on measured distributions, not averages); per-plan gross margin proxy; top-10 org cost outliers. This board *is* the R-3 (COGS trap) tripwire, reviewed in the same weekly meeting — quality and cost trade off explicitly, in one room.
- **Drift alarms** (§6) are the automated edge of this board; the meeting is the human edge.

## 8. Synthetic & Continuous Checks

- Synthetic verification run (canary deal) every 15 min per env → exercises full pipeline, feeds latency SLO.
- **Continuous ledger verifier**: independent job re-walks recent chain segments hourly + full weekly; uses the OSS verifier build (not pipeline code — ADR-012) so it double-checks us with the public's tool.
- CAS reconciler: sampled events → evidence hash resolves in S3 (daily).
- Read-model consistency sampler: projector output vs event replay (daily sample).

## 9. Dashboards-as-Code & Hygiene

Grafana dashboards/alerts in git (grafanalib/terraform) — reviewable, revertible, env-promoted like code. Every new service PR must add: RED dashboard row, at least one alert with a runbook link, and a log-scrubber test. Quarterly alert audit: anything that fired > 10× without action gets fixed or deleted (alert fatigue is an outage risk).

## 10. Data Ethics of Observability

We instrument the system, not the customers' deals: no analytics on deal *content*; product analytics (PostHog, self-hosted) on interaction events only, honoring org-level opt-out; sales/CS see usage aggregates, never memo text without explicit customer grant (support-access flow, ledgered). This line is contractual (`../legal/privacy.md`) and technical (separate analytics pipeline with schema allowlist).
