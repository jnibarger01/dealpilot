# DealPilot — Coding Standards
Status: Approved · Owner: CTO · Applies to all repos · Enforced by CI, not vibes.

## 1. Languages & Toolchain

- **TypeScript** (services, web, SDK): `strict: true`, no `any` (lint error; `unknown` + narrowing), Node LTS, pnpm + Turborepo monorepo.
- **Python** (workers, ML): 3.12, uv-managed, `mypy --strict` on `dealpilot_workers/*`, ruff (lint+format).
- Formatters are law: Prettier / ruff-format; zero style debate in review — if the formatter allows it, it's allowed; if a human argues style, we encode it in config or drop it.

## 2. Repository Layout (monorepo)

```
/apps        web, api-gateway, billing, deal-svc, ingestion
/workers     extractor, collector, adjudicator, valuation, composer (py)
/packages    domain-core, contracts (schemas), sdk-ts, ui-kit, config
/prompts     versioned prompt registry (ai-architecture §5)
/policies    OPA/Cedar authz policies + tests
/adr         ADRs + rfc-template.md
/infra       terraform, helm (dp-service chart)
/tools       codegen, fixtures, golden-corpus tooling
```

**Import boundaries enforced by lint** (eslint-plugin-boundaries / import-linter):
- `domain-core` imports nothing from infra/apps (pure: entities, aggregates, invariants, policies).
- SQL exists only in `*/infra/repos/**` (repository pattern, `../architecture/system-design.md` §4) — a query outside is a build failure.
- Workers depend on `contracts` types only, never on service internals.

## 3. Ubiquitous Language

The glossary (README + `/packages/domain-core/GLOSSARY.md`) is normative. `VERIFIED/CORROBORATED/REPORTED/CONTRADICTED/UNKNOWN` are the only status words in code, UI, and docs — never "score", "confidence level", "checked". `REFUSED` is a valuation outcome, not an error. Renaming a domain term = RFC. New engineers are quizzed on the glossary in onboarding week 1 (yes, really — shared language is how nine bounded contexts stay coherent).

## 4. Error Handling

- Domain layer: **typed Results** (`Result<T, DomainError>` / Python `Result` union) — invariant violations are values, not exceptions; exhaustively handled (compiler-checked).
- Application layer: map domain errors → RFC 7807 problem responses (`api.md` §2); never leak stack traces or internal IDs outward.
- **Fail-closed defaults**: any unhandled path in verification code resolves to `UNKNOWN`/`REFUSED` + ledger event, never silent continue. `catch {}` (empty) is a lint error. Every `catch` either handles meaningfully, converts to typed error, or rethrows with context.
- Timeouts/budgets on every external call (no unbounded awaits); retries only via Temporal or the shared retry util (jittered, capped) — no hand-rolled loops.

## 5. Concurrency & State

Services are stateless (12-factor); anything cross-request lives in PG/Redis with explicit TTL. Workers: idempotent by activity-id (safe replays); no shared mutable module state. Ledger appends only via repositories under the workflow's single-writer identity (ADR-013) — direct inserts are revoked at the DB grant level, not just convention.

## 6. Git, Branching, Versioning

Trunk-based: short-lived branches (< 2 days), small PRs (target < 400 changed lines; > 800 requires pre-agreed exception), **Conventional Commits** (`feat|fix|perf|refactor|docs|test|chore(scope): ...`) feeding automated **SemVer** releases via changesets (public API/SDK versioning policy in `api.md` §9). `main` is always releasable; a red main is stop-the-line for the merger. No long-lived feature branches — flags over branches (`ci-cd.md` §6).

## 7. Code Review

One approval required; two for `domain-core`, `/prompts`, `/policies`, ledger/repo code, and anything security-tagged (dual-control mirrors `../architecture/security.md` §12). Reviewer checklist (PR template, checked honestly or not at all):
1. **Invariants**: does this touch an aggregate? Are its table-listed invariants (`../architecture/system-design.md` §2.3) still enforced + tested?
2. **Fail-closed**: every new failure path lands in a safe state?
3. Tests: behavior-level, not implementation-mirroring; mutation-sensitive on core.
4. Security: input validated at edge, authz re-checked, nothing loggable-sensitive logged, threat-model delta if new surface.
5. Telemetry: metrics/trace spans/runbook link for new operational surface (`../architecture/observability.md` §9).
6. Contracts: schema changes additive? Consumer impact stated?
7. Docs: ADR/RFC if architectural; glossary if new terms.
Review SLA: first response < 4 business hours. Authors keep PRs reviewable; reviewers keep feedback kind and specific — comment on code, never coders.

## 8. Documentation Standards

Public functions/endpoints: doc comments with example. Every service: `README` (purpose, owner, runbook link, dashboard link) — the "new service PR" checklist blocks without it. Decisions: ADR (immutable once accepted; superseded, never edited). Cross-context changes: RFC first (72 h window, `../architecture/system-design.md` §9). Prompts: header block with owner, eval baseline, change rationale.

## 9. Dependency Policy

New dependency = PR line item: why, alternatives considered, maintenance signal (release cadence, bus factor), license (allowlist Apache-2.0/MIT/BSD-3; copyleft prohibited in shipped code — OSS strategy in `../business/marketing.md` §9). Prefer stdlib/platform > small lib > framework. Renovate keeps pins fresh (3-day cool-down, `../architecture/security.md` §7); unmaintained deps get an exit issue the day we notice.

## 10. Performance & Cost Discipline

Hot paths (extraction, citation checker, projectors) carry benchmark tests with budgets (`tdd.md` §12); model-calling code declares token budgets in the call site (reviewable); N+1 and unbounded-fan-out are review checklist items on any read-model or adapter change. "It's fast on my laptop" is not evidence — link the k6/bench run.

## 11. AI-Assisted Development

Assistants are welcome; accountability isn't transferable. The author owns every line as if hand-written: it must pass the same tests, review, and mutation gates, and the author must be able to explain it in review. Generated code that no one can explain is deleted on sight. Never paste customer data, secrets, or prompt-registry contents into external tools outside approved, DPA-covered ones.
