# DealPilot — Security Architecture
Status: Approved · Owner: Security Lead (CTO until mo 12 hire) · Companions: `threat-model.md`, `ai-architecture.md` §6, `../legal/compliance.md`.

## 1. Principles

Fail closed; least privilege; assume breach; **every privileged action is a ledger event** (the audit chain is the product's own spine — we secure ourselves with the thing we sell); boring cryptography only; security controls must be testable in CI or they don't exist.

## 2. Zero Trust Model

- **No network trust.** Service identity via mTLS (Linkerd mesh) + K8s NetworkPolicies default-deny; being "inside the VPC" grants nothing.
- **Human access**: SSO (WorkOS/Okta) + hardware-key MFA mandatory; no shared accounts; prod access is JIT-elevated (max 4 h grants via access broker), reason-required, ledgered, and reviewed weekly. No standing SSH; exec via audited `kubectl` plugin only.
- **Machine access**: workload identity (IRSA) — no long-lived AWS keys anywhere; third-party keys scoped + vaulted (§5).
- **Data plane**: every request re-authorized at the service (OPA/Cedar policy check) even after gateway authz — defense in depth (`system-design.md` §6).
- Break-glass: sealed role, dual-control, alarms on use, mandatory postmortem.

## 3. Authentication & Authorization

AuthN: OIDC (WorkOS), short-lived JWTs (15 min access / rotating refresh), API keys org-scoped + prefix-identifiable (`dpk_live_…`), stored hashed (argon2id), last-used tracking, inactivity expiry 90 d. AuthZ: RBAC roles (Owner, Admin, Analyst, Reviewer, Viewer, Billing) with an org-level permission matrix (in `/policies`, tested); ABAC-ready attributes (resource sensitivity, deal ownership). Tenant isolation: org_id enforced at three layers — JWT claim → policy check → **Postgres RLS as the last-resort backstop** (queries physically cannot cross orgs even on app bugs); isolation tested by a standing cross-tenant probe suite in CI (T-4).

## 4. Encryption

- Transit: TLS 1.3 everywhere (external + mesh mTLS internal).
- At rest: KMS envelope encryption; **per-org data keys** for evidence artifacts and memo content (crypto-shredding enabler — destroy the key, satisfy deletion without breaking the hash chain; `../legal/privacy.md` §6).
- Field-level: PII fields in ledger payloads encrypted with per-subject derived keys before hashing enters the chain (the chain commits to ciphertext — deletion-compatible immutability).
- Hashing: sha256 for content addressing/chain; argon2id for secrets; no homemade constructions, ever.

## 5. Secrets Management

AWS Secrets Manager as truth → External Secrets Operator syncs to K8s (no secrets in git, images, or plaintext env files; CI uses OIDC federation, zero long-lived CI creds). Local dev needs no real secrets (model stubs, `infrastructure.md` §7). Detection: gitleaks pre-commit + CI + org-wide scanning; any leak = rotate first, investigate second.

## 6. Key Rotation Schedule

| Key | Rotation | Method |
|---|---|---|
| JWT signing | 90 d | JWKS dual-publish, zero-downtime |
| Org data keys (KMS) | annual | re-wrap (envelope), no data rewrite |
| API keys (customer) | customer-driven + 90 d inactivity expiry | self-serve, overlap window |
| Webhook signing secrets | 180 d or on demand | dual-secret window |
| Third-party (LLM, Stripe, sources) | 90 d | vault-driven, runbook RB-08 |
| TLS | ACM-managed auto | — |

## 7. Supply Chain Security

Lockfiles committed; Renovate with 3-day cool-down on non-security bumps (upstream-compromise buffer); `npm`/`pip` audit gates; **SBOM (syft) per image, images signed (cosign), verified at admission**; GitHub Actions pinned to SHAs; third-party actions allowlisted; build provenance (SLSA-leaning) attached to releases. Dependency policy: license allowlist (Apache-2.0/MIT/BSD; no copyleft in core), new-dependency PRs need a justification line + owner. The OSS offline verifier is release-signed and reproducibly built — its integrity *is* the trust story.

## 8. Sandboxing

Document parsing (the hostile-input front door) runs in dedicated pods: no network (NetworkPolicy deny-all), read-only FS, seccomp/AppArmor profiles, gVisor runtime class, tight cpu/mem/time limits, non-root. Output is text+structure only; originals stay in CAS. Renderers (PDF preview) same posture. Any sandbox escape attempt signature → SEV-2 (`../operations/incident-response.md`).

## 9. Rate Limiting & Abuse Controls

Layers: per-IP (edge), per-key, per-org, per-endpoint-class; expensive endpoints (start run) additionally governed by **credits — the economic rate limit** — plus per-tenant Temporal concurrency caps (fairness + cost DoS defense, T-7). 429s carry `Retry-After`; limits by plan documented in `../engineering/api.md` §10. Signup abuse: email verification, disposable-domain blocking, velocity checks, free-tier device fingerprint dampening.

## 10. Fraud Prevention

Payment fraud: Stripe Radar + 3DS on risk signals; chargeback playbook (evidence = ledgered usage). Account fraud: stolen-key detection via geo/UA anomaly on API keys → step-up + key freeze. Output misuse (laundered credibility — passing off tampered memos): exports carry verification QR + chain hash; **any memo can be checked against our public verifier** — forgery is detectable by design. Marketplace (Phase 3): expert KYC via Stripe Identity, escrowed payouts, review-fraud heuristics.

## 11. OWASP Top-10 Mapping (abbrev.)

| Risk | Primary controls |
|---|---|
| A01 Broken access control | 3-layer authz + RLS backstop + cross-tenant probe suite |
| A02 Crypto failures | §4; KMS-only, TLS1.3, argon2id |
| A03 Injection | parameterized queries only (lint-enforced repo boundary), schema validation at every edge; *prompt* injection → `ai-architecture.md` §6 |
| A04 Insecure design | threat-model deltas required on RFCs (`threat-model.md` §8) |
| A05 Misconfig | IaC + policy-as-code (OPA on Terraform plans), drift detection |
| A06 Vulnerable components | §7 pipeline |
| A07 AuthN failures | WorkOS + MFA + short tokens |
| A08 Integrity failures | signed images, hash-chained ledger, signed webhooks |
| A09 Logging failures | `observability.md` §4; privileged actions ledgered |
| A10 SSRF | egress allowlist proxy for all worker traffic (`infrastructure.md` §4); URL fetch only via adapters |

## 12. Approval Workflows & Audit Chains

Sensitive operations (rubric change, prompt promote, override of claim status, data export, break-glass, refund > $500) require dual-control approvals; the approval, approver, and diff hash are ledger events. Quarterly access reviews are generated *from* the ledger (who did what with elevated rights) — audits become queries, not archaeology. This is the same machinery sold to customers; we are tenant zero.

## 13. Vulnerability Management & Testing

SLAs: Critical 48 h, High 7 d, Medium 30 d, Low 90 d (clock = triage). Pipeline: SAST (semgrep rulepack incl. custom domain rules), DAST (ZAP baseline on staging nightly), dependency + container scan per build, secrets scan, **adversarial-injection eval corpus in CI** (the AI-era SAST). External pen test annually + before first enterprise GA; findings tracked in risk register. Vulnerability disclosure policy + security.txt at launch; paid bug bounty at Series A (start private, HackerOne).

## 14. Security Program Roadmap

Mo 0–3 foundations (this doc implemented as CI-verifiable controls) → mo 6 formal policies + tabletop #1 → **mo 9 SOC 2 Type I** → mo 12 security hire #1 → pen test → **mo 18 SOC 2 Type II** → Series A: bounty, security team of 2, customer trust portal (`../roadmap/enterprise.md`). Control-to-criteria mapping lives in `../legal/compliance.md` §2.
