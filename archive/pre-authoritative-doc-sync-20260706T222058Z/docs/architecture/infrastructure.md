# DealPilot — Infrastructure & Procurement
Status: Approved · Owner: Head of Platform · Companions: `system-design.md`, `security.md`, `observability.md`.

## 1. Environment Topology

| Env | Purpose | Data | Access |
|---|---|---|---|
| `dev` (local) | Laptop development | Synthetic + golden corpus | Engineer |
| `preview` | Ephemeral per-PR frontends | Synthetic | Team |
| `staging` | Full stack, prod-shaped | Synthetic + scrubbed goldens (never customer data) | Team |
| `prod` | Customers | Customer data | Least-privilege, JIT elevated access, all access ledgered |

Separate AWS accounts per env under an Organization (blast-radius isolation); shared `security` and `logging` accounts receive CloudTrail/Config from all.

## 2. Cloud Selection (Procurement)

| Criterion (weight) | AWS | GCP | Azure |
|---|---|---|---|
| Managed primitives we need: Postgres, Kafka, OpenSearch, Object Lock (30%) | ★★★ RDS/MSK/OpenSearch/S3 Object Lock all first-party | ★★☆ no first-party Kafka (Confluent), object retention weaker | ★★☆ Event Hubs ≠ Kafka semantics |
| Enterprise buyer expectations (20%) | ★★★ | ★★☆ | ★★★ (but our buyers skew AWS) |
| Compliance surface, artifacts (15%) | ★★★ | ★★★ | ★★★ |
| Startup credits & cost (15%) | ★★☆ ($100K Activate) | ★★★ (credits often richer) | ★★☆ |
| Team familiarity (10%) | ★★★ | ★★☆ | ★☆☆ |
| Vendor-independence of our design (10%) | Kubernetes + OTel + Postgres/Kafka keep us portable everywhere | — | — |

**Decision: AWS** (us-east-1 primary, us-west-2 DR). Portability hedge: everything runs on Kubernetes + open interfaces (Postgres wire, Kafka protocol, S3 API); no Lambda-shaped business logic. Revisit trigger: a strategic enterprise segment mandates another cloud (then read-only deployment first).

## 3. Compute & Orchestration

**EKS** (not ECS): Temporal workers, Argo CD GitOps, and network policies are first-class on K8s; hiring pool larger. Cost of K8s complexity accepted and contained: platform team owns it; product engineers ship via templated Helm charts (`dp-service` chart: HPA, PDB, probes, OTel, NetworkPolicy baked in). Node groups: `general` (on-demand, services), `workers` (spot, 70/30 spot/on-demand, verification workers are checkpointable via Temporal so spot reclaim is safe), `gpu` (none in v1 — models are API-consumed; revisit if self-hosting, ADR-015 placeholder).

## 4. Networking

- VPC per env; services in private subnets; only ALB/NAT public.
- **Egress control is a security control, not plumbing** (see `ai-architecture.md` §6): verification workers reach the internet only through an egress proxy with a per-source-adapter allowlist. A prompt-injected worker cannot exfiltrate to arbitrary hosts. Deny-by-default; adapter onboarding adds domains via PR.
- Service-to-service: mTLS via mesh-lite (Linkerd) + NetworkPolicies; no flat trust (see `security.md` §2).
- Enterprise Phase: AWS PrivateLink endpoints for customer-side private connectivity (`../roadmap/enterprise.md`).

## 5. Data Stores (managed, boring on purpose)

| Store | Service | Config highlights |
|---|---|---|
| System of record + event ledger | RDS Postgres 16 (→ Aurora at scale trigger) | Multi-AZ, PgBouncer, org-hash partitions, PITR |
| Event backbone | MSK (Kafka) | 3 AZ, per-org key partitioning |
| Evidence CAS | S3 + **Object Lock (compliance mode)** | sha256 keys, versioning, lifecycle to IA/Glacier |
| Cache/queues-lite | ElastiCache Redis | cluster mode, no durable truth ever |
| Search | OpenSearch | read-model projections only (rebuildable) |
| Embeddings | pgvector → Qdrant (ADR-010) | migration trigger: >50M vectors or recall p95 misses |

Rule: **Redis and OpenSearch are rebuildable caches.** Loss of either is degradation, not data loss; quarterly rebuild drill proves it.

## 6. IaC & GitOps

Terraform (modules per account/env), PR-based plan/apply with Atlantis; drift detection nightly. App deployment via Argo CD (Git is the deploy state; rollback = revert). **Prompts and rubrics deploy through the same GitOps path** — a prompt is production config with a hash recorded in ledger events (`ai-architecture.md` §5). No console-clicking in prod; break-glass role exists, is alarmed, and every use is ledgered + reviewed.

## 7. Local Development

`make dev` brings up docker-compose: Postgres, Redis, Kafka (redpanda), OpenSearch, Temporal dev server, LocalStack (S3), and the **model stub server** replaying recorded fixture responses (deterministic, free, offline). Golden corpus subset (20 deals) seeds a working pipeline in <10 min on a laptop. Secrets: none required locally (stubs); real-provider mode uses per-dev scoped keys with $ caps. Contract: if it passes locally it passes CI — same containers, same versions (Renovate keeps them pinned+fresh).

## 8. Offline Mode

Three deliberate tiers:
1. **Verify offline (GA at launch):** ledger exports + the OSS offline verifier run with zero network — auditors/counterparties verify hash chains and citations air-gapped. This is the trust product.
2. **Read offline:** memo exports (PDF/HTML bundle with embedded evidence excerpts + hashes) are self-contained.
3. **Run offline (roadmap, enterprise Y3 evaluation):** full pipeline air-gapped requires self-hosted models; costed as a separate SKU only if ≥3 enterprise commits fund it. Until then we say no clearly.

## 9. Disaster Recovery

Targets: **RPO 15 min / RTO 4 h** (prod).
- Postgres PITR + cross-region snapshot copies (15-min WAL shipping); S3 CRR for CAS; Kafka is redeliverable from outbox (DB is truth).
- DR runbook (`../operations/runbooks.md` RB-11/RB-13): restore order = Postgres → verify **ledger chain integrity end-to-end** → CAS reconcile (every event's evidence hash resolves) → rebuild read models → resume Temporal.
- **A restore that fails chain verification is treated as failed** — integrity beats availability (doctrine).
- Drills: quarterly full restore in staging with timed RTO; results in board ops report. Region-loss game day annually.

## 10. Cost Optimization

Unit economics are an engineering SLO: **$/memo live dashboard** (model tokens, source fees, compute per run) reviewed weekly (guards Risk R-3, the COGS trap; targets $11→$4 per `../business/financial-model.md`).
Levers ranked by impact: (1) model routing — right-size model per task, the dominant cost (`ai-architecture.md` §7); (2) evidence caching — CAS dedupe + source-response cache with TTL honoring source ToS; (3) spot for workers (~65% compute savings on the biggest pool); (4) prompt/token budgets enforced per run with hard caps; (5) S3 lifecycle tiering; (6) Savings Plans post-Series A (commit only after 6 mo of stable baseline); (7) per-tenant concurrency caps prevent noisy-neighbor cost spikes.
Guardrails: budgets + anomaly alerts per account; any single verification run > $9 hard-fails with `BudgetExceeded` (fail-closed, refund credit).

## 11. Procurement — Vendor Comparisons & Decisions

**LLM providers** (routing detail in `ai-architecture.md` §7):

| Need | Options weighed | Decision | Revisit trigger |
|---|---|---|---|
| Frontier reasoning (adjudication, composition) | Anthropic / OpenAI / Google | **Two-provider policy: Anthropic primary, OpenAI secondary**, abstraction layer + weekly cross-provider eval | Eval delta >3 pts or price/perf shift; R-7 model deprecation |
| High-volume extraction | Same vendors' small tiers + open-weights (Llama-class via Bedrock/Together) | Small hosted tier now; open-weights pilot when volume >5M pages/mo | COGS math |
| Zero-retention & DPA | — | Contractual requirement for all; no training on our traffic | non-negotiable |

**Embeddings:** OpenAI `text-embedding-3-large` vs Cohere embed-v3 vs open (bge/gte). Decision: hosted (OpenAI) now for ops simplicity; **store raw text + model-versioned vectors** so re-embedding is a batch job, not a migration crisis. Revisit at pgvector→Qdrant move.

**Vector DB:** pgvector (chosen, ADR-010) vs Qdrant vs Pinecone vs Weaviate. pgvector wins v1 (one fewer system, transactional with read models). Qdrant is the named successor (OSS, self-hostable — matters for offline-mode roadmap). Pinecone rejected: proprietary lock-in conflicts with air-gap story.

**Monitoring:** Datadog vs Grafana Cloud (LGTM) vs New Relic. Decision: **OTel-first instrumentation (vendor-neutral) + Grafana Cloud** now — ~⅓ Datadog cost at our scale, and OTel means switching is config. Revisit at Series A if ops toil > $ saved. (Full stack in `observability.md`.)

**Identity:** WorkOS vs Auth0 vs Clerk vs build-on-Cognito. **WorkOS** (ADR-008): SSO/SCIM/Directory Sync are exactly the enterprise checklist; per-connection pricing aligns cost with enterprise revenue. Auth0 strong but pricier at seat scale; Cognito rejected (DX tax on core team).

**Compliance automation:** Vanta vs Drata — **Drata** (deeper AWS/GitHub evidence pulls at time of eval; either acceptable, decide on demo + price, budget $25–35K/yr; `../legal/compliance.md`).

**Payments:** Stripe (decided, `../business/pricing.md`) — Billing, Meters, Tax, Connect for marketplace Phase 3.

## 12. Vendor Risk Management

Every critical vendor gets: DPA + zero-retention where AI-related, SOC 2 report on file, exit plan documented (what breaks, migration cost, time), and an annual review. **Two-provider policy** for anything on the verification critical path (LLMs, evidence sources per class). Single points of accepted concentration: AWS, Stripe, Temporal Cloud (each with a written "if we had to leave" memo; Temporal self-host is the documented fallback). Vendor register lives in `../legal/compliance.md` §8 with owners.
