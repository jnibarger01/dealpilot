# DealPilot — CI/CD & Release Strategy
Status: Approved · Owner: Head of Platform · Companions: `coding-standards.md` §6, `testing.md` (gates), `../architecture/infrastructure.md` §6.

## 1. Model

Trunk-based development, GitHub Actions CI, Argo CD GitOps delivery. `main` is always releasable; deploys are frequent, small, and boring. **Prompts, rubrics, and policies ride the same pipeline as code** — same review, same gates, same rollback (this is the single most important sentence in this document).

## 2. Pipeline Stages (per PR / merge)

```
lint+format → typecheck (tsc, mypy) → unit (+mutation on touched core paths)
→ contract (schemas, OpenAPI diff, conformance vectors)
→ integration (testcontainers, Temporal test env)
→ security (semgrep, gitleaks, dep+container scan, cross-tenant probes, injection corpus*)
→ build (turbo-cached) → SBOM + cosign sign
→ e2e smoke (5 golden deals)
→ auto-deploy staging → staging synthetics green
→ [gate] deploy prod (progressive)
```
\* injection corpus + full eval suite run when `/prompts`, `/policies`, rubric config, or model routing change — **eval regression beyond noise bands fails the build** (`../architecture/ai-architecture.md` §5, §13).

PR budget: < 15 min to merge-ready signal (parallelized; heavy suites nightly). Flaky tests are quarantined within 24 h with an owner and a fix-by date — a flaky gate is no gate.

## 3. Branch Protections

Required checks (all of §2's merge set), 1–2 reviews per `coding-standards.md` §7, linear history, no force-push, CODEOWNERS on `domain-core`, `/prompts`, `/policies`, `/infra`, ledger paths. Broken `main` = stop-the-line: merger fixes or reverts within 30 min; reverts need no review.

## 4. Versioning & Releases

Conventional Commits → changesets → **SemVer**: platform services deploy continuously (version = build metadata); **public surface (API, SDKs, OSS verifier, MCP server) follows strict SemVer** with human-readable changelogs. API breaking changes only via new version path with 12-month deprecation (`api.md` §9). OSS verifier releases: reproducible build + signed artifacts + conformance-vector tag pinning (its trust story is the release process).

## 5. Environments & Progressive Delivery

- **staging**: auto on merge; full synthetic traffic + nightly golden E2E.
- **prod**: auto-promoted after staging soak (2 h + green synthetics) — human gate only for flagged-risky changes (migrations, prompts, authz) → those require a named approver in the Argo UI (dual-control classes per `../architecture/security.md` §12).
- **Canary**: 5% traffic (Argo Rollouts) for services; 5% of *runs* for prompts/models/rubrics; auto-rollback on SLO burn or quality-metric trip (citation pass rate, UNKNOWN drift — `../architecture/observability.md` §6). Rollback = `git revert` + Argo sync; target < 10 min mitigation for any bad deploy.

## 6. Feature Flags

Unleash (self-hosted OSS) — flags over branches. Rules: every flag has an owner + expiry (30 d default; stale-flag report weekly); kill-switch flags for each external dependency class (model provider, source adapter, Stripe writes) — RB-02/RB-03 flip these; flags gate *behavior*, entitlements gate *plans* (never mix — entitlement logic lives in Billing).

## 7. Database Migrations

Expand → migrate → contract, always: additive DDL ships first, backfill jobs are resumable + rate-limited, destructive steps ship ≥ 1 release later behind a checklist. Migrations run as pre-deploy jobs with locks + timeouts; every migration has a tested `down` or a documented forward-fix. **Ledger tables are append-only at the grant level — there is no such thing as a ledger data migration**; event schema evolution = upcasters (versioned readers), never rewrites (`../architecture/system-design.md` §3). Migration PRs get the two-review treatment + staging rehearsal against a prod-sized snapshot.

## 8. Artifact & Pipeline Security

CI has zero long-lived cloud creds (OIDC federation); actions pinned to SHAs; runners: GitHub-hosted for public-safe jobs, self-hosted (isolated, ephemeral) for heavy/integration jobs; SBOM (syft) per image; cosign signing; **admission controller verifies signatures in prod** — an unsigned image cannot schedule. Provenance attached to releases (SLSA-leaning). Cache poisoning guard: caches keyed per-branch class, never shared from PRs into `main` builds.

## 9. Deploy Cadence & Metrics (DORA, board-reported quarterly)

Targets Y1: deploy frequency ≥ daily (median), lead time < 1 day, change-failure rate < 10%, MTTR < 1 h (deploy-caused). These are tracked from CI/Argo/incident data automatically — self-reported DORA is fiction.

## 10. Onboarding Hook

Day-1 engineer ships a real (small) change to prod through this whole pipeline — the pipeline *is* the onboarding doc (`../operations/hiring.md` §6). If day-1 shipping is scary, the pipeline is broken, not the hire.
