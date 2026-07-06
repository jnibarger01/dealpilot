# DealPilot — Privacy Policy (Outline) & Data Protection Design
Status: Counsel-review draft outline · Owner: COO (DPO-equivalent until designated) · This is an internal outline for the public policy + the engineering commitments behind it. Not legal advice; outside counsel finalizes public text.

## 1. Roles & Scope

- **Controller**: DealPilot for account, billing, telemetry, and marketing data.
- **Processor**: DealPilot for **Customer Content** (uploaded deal documents, extracted claims, memos, evidence copies) — processed only on customer instruction per DPA.
- Coverage: web app, API/SDK/MCP, marketing site (separate, lighter policy section).

## 2. Data Inventory (categories → systems → basis)

| Category | Examples | Where | Legal basis (GDPR) |
|---|---|---|---|
| Account | name, email, org, role | PG (identity) | contract |
| Billing | plan, invoices, last4 (Stripe-held) | Stripe (+ ids in PG) | contract/legal obligation |
| **Customer Content** | deal docs, claims, memos, evidence artifacts | S3 CAS, PG, ledger | contract (processor) |
| Usage telemetry | feature events (no content) | self-hosted analytics | legitimate interest (+opt-out) |
| Logs/traces | ids, hashes, timings — **no content/PII** by policy | Loki/Tempo | legitimate interest |
| Support | tickets, correspondence | support tool | contract/legit. interest |
| Marketing | site analytics, newsletter | consent-gated | consent |

Third-party-person data inside deal documents (e.g., a seller's name in a CIM): customer is controller; we process as instructed; DPA obligates customer's lawful basis — stated plainly in the policy.

## 3. Purposes & Limits (the promises)

We process Customer Content **only** to deliver verification the customer requested. We do **not**: sell data; advertise on data; train models on Customer Content without **explicit opt-in** (off by default, org-level, revocable); allow cross-tenant use of any customer's content, ever (technical enforcement: `../architecture/security.md` §3). Employee access to content requires a customer-granted support window, is time-boxed, and is ledgered.

## 4. Retention Schedule

| Data | Default retention | Notes |
|---|---|---|
| Customer Content | life of subscription + 30 d grace, then deleted | org-configurable (min 30 d, max custom/enterprise); export always available first (`tos.md` §10) |
| Ledger events | duration of account + configurable archive | PII within payloads is field-encrypted → deletable via key destruction (§6) |
| Evidence CAS copies | tied to owning deals' retention | Object-Lock windows sized to retention config |
| Logs/traces | 30 d hot / 13 mo cold | content-free by design |
| Telemetry | 25 mo | aggregated thereafter |
| Billing records | 7 y | statutory |
| Backups | 35 d rolling | deletions propagate on cycle; documented in policy |

## 5. Data Subject Rights (GDPR/CCPA operationalized)

Access, rectification, erasure, portability, restriction, objection; CCPA right-to-know/delete/opt-out (we don't sell — stated). Intake: privacy@dealpilot.com + in-app; identity verification proportional; **SLA 30 d** (GDPR) / 45 d (CCPA), tracked in runbook RB-07 (`../operations/runbooks.md`). B2B nuance: content-related requests from non-customers route to the controlling customer per DPA, with our assistance duty stated.

## 6. Erasure vs. Immutable Ledger (the honest hard part)

Design (engineering commitment, `../architecture/security.md` §4): personal data inside ledger event payloads is **encrypted with per-subject keys before hashing** — the chain commits to ciphertext. Erasure = destroy the key (**crypto-shredding**): personal data becomes permanently unreadable while chain integrity (hashes, sequence) survives for audit. Residual hashes/ids are not reasonably re-identifiable post-shred; position disclosed transparently in the policy and DPA. Deletion certificate available on request.

## 7. Subprocessors (public list, 30-d advance change notice)

AWS (infra), Stripe (payments), WorkOS (identity), Temporal Cloud (orchestration), model providers (Anthropic, OpenAI — **zero-retention, no-training DPAs**), Grafana Cloud (telemetry, content-free), support/email vendors. Each: DPA + SCCs where applicable + security review on file (`../architecture/infrastructure.md` §12).

## 8. International Transfers

Primary processing US; EU customers: SCCs (Module 2/3) + UK IDTA addendum; transfer impact assessments on file; EU data residency (EU region deployment) is on the enterprise roadmap — sold only when real (`../roadmap/enterprise.md`).

## 9. AI-Specific Disclosures (plain-language section in the policy)

1. Automated analysis: deals are analyzed by AI systems; every factual output carries evidence citations or is marked UNKNOWN.
2. **Human review availability**: users can request human review of any memo (and enterprise flows include it) — relevant to GDPR Art. 22 posture; our outputs are decision *support*, the human decides.
3. Model providers process content under zero-retention agreements; list published.
4. No training on Customer Content without opt-in; opt-in scope described precisely (what, for what, revocation effect).
5. Limits stated: VERIFIED = evidence per published rubric at a point in time, not a guarantee of truth (mirrors `tos.md` §2).

## 10. Security, Breach & Contact

Security summary cross-ref (`../architecture/security.md`); breach notification: without undue delay, ≤ 72 h to authorities where GDPR applies, customer notice per DPA with facts, scope, mitigation (process: `../operations/incident-response.md` §6). Contacts: privacy@, security@, EU representative (appointed pre-EU-GTM), DPO designation decision at Series A (`compliance.md` §3).

## 11. Cookies & Site Telemetry

App: essential + first-party analytics only. Marketing site: consent banner where required; no third-party ad trackers (brand position, not just compliance — `../business/marketing.md`). Full cookie table in the public policy appendix.

## 12. Changes & Versioning

Policy is versioned and dated; material changes: 30-d email + in-app notice; archive of prior versions public. (We version our privacy policy like we version our API — same company, same habit.)
