# DealPilot — Risk Register (Top 100)
Status: Approved · Owner: CEO (register), functional owners per row · Review cadence: top 20 monthly at exec staff; full register quarterly with board.

**Scoring:** Sev 1–5 (5 = existential) · Lik 1–5 (5 = near-certain in 24 mo) · **Score = Sev×Lik** · MitCost L/M/H · StratImpact L/M/H. Sorted by Score, then Sev. Mitigations are one-line pointers; owning docs referenced where deeper treatment exists.

| # | Risk | Cat | Sev | Lik | Score | Mit$ | Strat | Mitigation |
|---|---|---|---|---|---|---|---|---|
| 1 | Public verification failure (memo asserts falsehood, customer loses money, it's publicized) | AI | 5 | 3 | 15 | M | H | Deterministic citation gate + human sampling + accuracy reports + incident playbook (`../architecture/ai-architecture.md`, `../operations/incident-response.md`) |
| 2 | Key evidence source revokes API/ToS or 10x prices | DATA | 5 | 3 | 15 | H | H | ≥2 adapters/claim-class, contracted derived-data rights, user-supplied-evidence path |
| 3 | Verification COGS fails to compress → margin trap | FIN | 4 | 4 | 16→listed here for Sev tiebreak | M | H | Graph caching, model routing, credit-price flex floor 2.2× COGS (`pricing.md`) |
| 4 | Frontier platform launches "cited/verified answers" feature | MKT | 4 | 4 | 16 | M | H | Vertical workflow depth, Evidence Graph, audit exports, speed; partner where possible |
| 5 | Prompt injection via hostile seller document corrupts adjudication | SEC | 5 | 3 | 15 | M | H | Hostile-input pipeline: no tools for extractors, instruction stripping, red-team CI (`../architecture/ai-architecture.md` §6, `../architecture/threat-model.md`) |
| 6 | Prosumer churn > model (deal-flow seasonality) | GTM | 3 | 5 | 15 | L | M | Pause plan, pipeline-inbox habit anchor, annual plans |
| 7 | Model provider deprecates/behavior-shifts a routed model mid-flight | DEP | 4 | 4 | 16 | L | M | Multi-model routing, eval-gated pinned versions, canary swaps |
| 8 | Trust cold-start: buyers don't believe claim statuses | MKT | 4 | 3 | 12 | M | H | Open-source offline ledger verifier, third-party accuracy audit, public teardowns |
| 9 | Series A market window closes / valuations compress | FIN | 4 | 3 | 12 | L | H | 24-mo runway, downshift triggers, venture-debt option post-metrics |
| 10 | Founder/key-person loss (verification architect) | OPS | 5 | 2 | 10 | M | H | Docs-as-infrastructure (this repo), bus-factor≥2 per system, key-person insurance |
| 11 | Claim-extraction recall gaps → memos miss material claims | AI | 4 | 3 | 12 | M | H | Golden-set recall gate ≥90% in CI, human sampling, user "add claim" affordance |
| 12 | Entity-resolution errors (wrong property/company matched) | AI | 5 | 2 | 10 | M | H | Deterministic ID matching first, confidence thresholds, UNKNOWN on ambiguity, user confirm step |
| 13 | Regulator deems output "appraisal" or "investment advice" | LEG | 4 | 3 | 12 | M | H | Language controls in product copy, counsel gate per vertical, human-approval design (`../legal/compliance.md`) |
| 14 | Data-provider incumbent bundles verification | MKT | 4 | 3 | 12 | H | H | Move fast in wedge, prosumer distribution, partnership BD track |
| 15 | Enterprise sales cycle 2× assumption | GTM | 3 | 4 | 12 | L | M | Paid pilots, pipeline coverage 3.5×, prosumer revenue floor |
| 16 | Evidence Graph poisoning (bad verified facts persist and propagate) | AI | 4 | 3 | 12 | M | H | Fact TTLs, provenance-weighted confidence, contradiction re-triggers re-verification |
| 17 | SOC 2 slips → enterprise deals stall | LEG | 3 | 4 | 12 | M | M | Compliance owner mo 3, Vanta-class tooling, evidence automation |
| 18 | Cloud region outage during customer deadline | DEP | 3 | 4 | 12 | M | L | Multi-AZ, RTO 4h / RPO 15m plan, status page (`../architecture/infrastructure.md` DR) |
| 19 | Credit-pricing confusion suppresses conversion | PRD | 3 | 4 | 12 | L | M | Pre-run estimates, caps, simplified "standard deal ≈ 10 credits" anchor |
| 20 | Hiring: can't attract verification-quality engineers at seed comp | OPS | 3 | 4 | 12 | M | M | Mission narrative, meaningful equity, open-source verifier as recruiting proof |
| 21 | Stripe/billing incident bills customers wrongly | DEP | 4 | 2 | 8 | L | M | Idempotent webhooks, nightly reconciliation, no-surprise-bill guardrails |
| 22 | LLM cost spike (provider pricing power) | DEP | 3 | 4 | 12 | L | M | Routing to open-weights fallbacks, caching, per-tenant cost alarms |
| 23 | Tenant data isolation defect | SEC | 5 | 2 | 10 | M | H | Row-level security + org-scoped keys, isolation tests in CI, pen tests |
| 24 | Marketplace supply quality (Phase 3) poisons brand | MKT | 4 | 3 | 12 | M | M | Vetted seed supply, double-blind scoring vs ground truth, SLAs |
| 25 | GTM over-rotation to enterprise starves PLG engine | GTM | 3 | 3 | 9 | L | M | Motion-gating rule (`business-plan.md` §5), separate budgets |
| 26 | Valuation-model miscalibration in a market regime shift | AI | 4 | 3 | 12 | M | H | Range outputs, driver attribution, backtests per quarter, regime flags |
| 27 | County/registry source data itself is wrong | DATA | 3 | 4 | 12 | L | M | Multi-source corroboration statuses, source-reliability priors, user dispute flow |
| 28 | Free-tier abuse (scraping our analyses at scale) | SEC | 2 | 5 | 10 | L | L | Rate limits, watermarking, no verification on free tier |
| 29 | OCR/parse failures on scanned CIMs → silent claim loss | AI | 4 | 3 | 12 | L | M | Parse-confidence surfaced, UNKNOWN on low confidence, manual-review queue |
| 30 | Seller adversarially formats documents to evade extraction | AI | 3 | 3 | 9 | M | M | Adversarial-format test corpus, anomaly detection ("suspiciously unextractable") flags to user |
| 31 | Key adapter breaks silently (source HTML/API drift) | DATA | 3 | 4 | 12 | L | M | Adapter contract tests nightly, freshness SLOs, auto-quarantine + UNKNOWN fallback |
| 32 | Runway math wrong (COGS underestimate) | FIN | 4 | 2 | 8 | L | H | Monthly unit-cost review, alarmed budgets, downshift triggers |
| 33 | Churn from "one bad memo" experiences | PRD | 3 | 3 | 9 | L | M | Confidence UX, feedback→re-verification loop, CS save play |
| 34 | Competitors copy claim-status vocabulary without rigor, muddying category | MKT | 3 | 4 | 12 | L | M | Conformance spec + trademark on badge; publish tests competitors fail |
| 35 | Legal: scraped-source claims trigger CFAA/ToS dispute | LEG | 4 | 2 | 8 | M | M | Licensed-API-first policy, adapter ToS registry, no circumvention rule in code review |
| 36 | Privacy: personal data in uploaded docs (sellers' PII) | LEG | 3 | 4 | 12 | M | M | PII detection/redaction at ingest, retention schedule, DSR tooling |
| 37 | Model refusals/instability break pipeline SLOs | DEP | 3 | 3 | 9 | L | L | Retry/fallback ladders, deterministic degradation to UNKNOWN |
| 38 | Enterprise security questionnaire latency loses deals | GTM | 2 | 4 | 8 | L | L | Prebuilt diligence pack, 5-day SLA, trust page |
| 39 | Founders' attention split across two verticals dilutes both | OPS | 3 | 3 | 9 | L | M | Shared pipeline core, vertical adapters only; kill-criteria review at mo 9 |
| 40 | IP: employee/contractor code without assignment | LEG | 3 | 2 | 6 | L | M | PIIA for all, contractor agreements, OSS license scanning |
| 41 | Search/rank quality of retrieval degrades adjudication | AI | 3 | 3 | 9 | M | M | Retrieval evals in CI, reranker, chunking by doc structure |
| 42 | DDoS/abuse on public teardown endpoints | SEC | 2 | 3 | 6 | L | L | CDN/WAF, rate limits |
| 43 | Wrong wedge: searchers too small a market to carry growth | MKT | 3 | 3 | 9 | L | H | Two-wedge design; quarterly cohort economics review with reallocation rule |
| 44 | Payment fraud / stolen cards on credit packs | FIN | 2 | 4 | 8 | L | L | Stripe Radar, velocity limits, manual review >$1K |
| 45 | Key data license non-assignable at acquisition (kills M&A optionality) | LEG | 3 | 2 | 6 | L | M | Assignment clauses negotiated up front |
| 46 | Observability gaps hide verification drift | OPS | 3 | 3 | 9 | M | M | Verification-quality dashboards, drift alarms (`../architecture/observability.md`) |
| 47 | Over-promising marketing violates our own doctrine, brand hit | MKT | 3 | 2 | 6 | L | M | Marketing claims require sources (policy in `marketing.md` §1) |
| 48 | On-call burnout in small team | OPS | 3 | 3 | 9 | L | M | Sane SLOs, error budgets, rotation ≥4 people by mo 9 |
| 49 | Secrets leak (source API keys in logs/repos) | SEC | 4 | 2 | 8 | L | M | Central secrets manager, scanners in CI, rotation runbook |
| 50 | GDPR data-transfer or DSR failure | LEG | 3 | 2 | 6 | M | M | DPA templates, SCCs, engineered deletion (`../legal/privacy.md`) |
| 51 | API partners misrepresent our verification (badge misuse) | MKT | 3 | 3 | 9 | L | M | Badge license terms, technical badge attestation (signed), audits |
| 52 | Long-tail deal types produce embarrassing memos | PRD | 3 | 4 | 12 | L | M | Supported-deal-type gating; out-of-scope → explicit "can't underwrite this yet" |
| 53 | Human-review sampling too costly at scale | FIN | 3 | 3 | 9 | M | M | Risk-based sampling, marketplace reviewers, active-learning targeting |
| 54 | Multi-tenant noisy neighbor degrades pipeline latency | DEP | 2 | 4 | 8 | M | L | Queue fairness, per-tenant concurrency caps, priority tiers |
| 55 | Team plan cannibalizes Pro seats | FIN | 2 | 3 | 6 | L | L | Pooled-credit design, monitor ARPA mix |
| 56 | Losing the "AI Underwriting" naming battle | MKT | 2 | 3 | 6 | M | M | Category content velocity, analyst briefings, spec publication |
| 57 | Board/investor pressure to ship autonomous decisions (drop HITL) | OPS | 4 | 2 | 8 | L | H | Values doc, approval-gate as brand asset, decline framing prepared |
| 58 | Open-sourced verifier reveals gameable checks | SEC | 3 | 2 | 6 | L | M | Verifier checks integrity, not detection heuristics; secrets stay server-side |
| 59 | Vendor lock-in (Temporal/cloud) raises exit costs | DEP | 2 | 3 | 6 | M | L | Abstraction at workflow boundaries, exportable event store |
| 60 | Currency/intl expansion complexity too early | FIN | 2 | 2 | 4 | L | L | US-only through A (plan-of-record) |
| 61 | Contradiction false-positives insult sellers, broker backlash | MKT | 3 | 3 | 9 | L | M | "CONTRADICTED" requires cited both-sides evidence; dispute workflow |
| 62 | Pipeline reruns produce different results (non-determinism) undermines audit | AI | 4 | 3 | 12 | M | H | Pinned models+prompts per run in ledger, replay keys, temperature 0 adjudication |
| 63 | Legal hold / discovery obligations on ledgers unplanned | LEG | 3 | 2 | 6 | L | L | Legal-hold feature in retention design |
| 64 | CS backlog degrades activation | GTM | 2 | 4 | 8 | L | L | Self-serve education, activation playbooks, hire CSM at 800 paid |
| 65 | Feature creep pre-PMF | PRD | 3 | 4 | 12 | L | M | PRD non-goals enforced; monthly scope court |
| 66 | Analytics privacy misconfig (PII in product analytics) | LEG | 3 | 2 | 6 | L | L | Server-side event allowlist, PII linting |
| 67 | Bank/treasury concentration risk | FIN | 3 | 2 | 6 | L | L | Two banks + sweep, per-2023 playbook |
| 68 | Prompt/rubric IP leaks via employee departure | SEC | 2 | 3 | 6 | L | M | Access tiering, NDAs, watermarked rubric copies |
| 69 | Marketplace worker classification (1099) exposure | LEG | 3 | 2 | 6 | M | M | Task-based marketplace design, counsel review pre-launch |
| 70 | Underwriting API misuse for prohibited use-cases (tenant screening) | LEG | 4 | 2 | 8 | L | H | Use-case allowlist, contractual restrictions, abuse monitoring |
| 71 | Cache staleness serves outdated "verified" facts | AI | 3 | 3 | 9 | L | M | Fact TTL by class, verified-at timestamps always displayed |
| 72 | Cloud cost runaway (unbounded pipelines) | FIN | 3 | 3 | 9 | L | L | Per-run budgets, circuit breakers, FinOps dashboards |
| 73 | Two fundraising docs drift from model (internal inconsistency in DD) | OPS | 2 | 3 | 6 | L | L | Canonical-numbers table in README; DD pack generated from model |
| 74 | Losing early design partners to acquisition/pivot | GTM | 2 | 3 | 6 | L | L | 8+ design partners, staggered verticals |
| 75 | Accessibility gaps block enterprise/legal requirements | PRD | 2 | 3 | 6 | L | L | WCAG 2.1 AA in DoD, audit pre-enterprise GA |
| 76 | Email deliverability (pipeline-inbox) issues | DEP | 2 | 3 | 6 | L | L | Dedicated sending domain, monitoring, fallback upload |
| 77 | Over-reliance on one growth channel (community) | GTM | 2 | 3 | 6 | L | M | Channel mix caps 40%, quarterly diversification review |
| 78 | Employee misuse of customer deal data | SEC | 4 | 1 | 4 | L | M | Least-privilege, access logging, deal-data access reviews |
| 79 | Model output includes copyrighted source text verbatim | LEG | 2 | 3 | 6 | L | L | Quote-length limits in composer, paraphrase policy, filters |
| 80 | Board composition conflicts (data-provider strategic) | OPS | 3 | 2 | 6 | L | M | Clean-terms policy (`fundraising.md` §5) |
| 81 | Latency SLO miss (p95 >10 min) suppresses habit formation | PRD | 3 | 3 | 9 | M | M | Parallel evidence collection, progressive memo rendering |
| 82 | Sales hires before playbook proven | GTM | 3 | 3 | 9 | L | M | Founder-led until 5 repeatable wins, gate in `sales.md` |
| 83 | Insurance gaps (E&O/tech liability) | LEG | 3 | 2 | 6 | L | L | E&O + cyber at launch, review limits annually |
| 84 | Data residency demands from enterprise (EU) pre-capability | GTM | 2 | 3 | 6 | M | L | Roadmap transparency, US-only honesty, EU at Series B |
| 85 | Internal metrics gaming (activation definition drift) | OPS | 2 | 3 | 6 | L | L | Metric definitions versioned in repo, analytics review board |
| 86 | Search engine algorithm shift kills SEO channel | GTM | 2 | 3 | 6 | L | L | Owned audiences (newsletter/community) as hedge |
| 87 | Third-party JS supply chain (marketing site) | SEC | 3 | 2 | 6 | L | L | CSP, SRI, minimal tags; app has zero third-party JS |
| 88 | Founder equity dispute / vesting gap | OPS | 4 | 1 | 4 | L | H | 4-yr vesting w/ 1-yr cliff both founders, signed day 0 |
| 89 | Benchmark/report data product angers customers (perceived data use) | MKT | 3 | 2 | 6 | L | M | Opt-in only, aggregation thresholds, contractual clarity |
| 90 | Queue poisoning (malformed doc crashes workers repeatedly) | SEC | 2 | 3 | 6 | L | L | DLQs, poison-pill detection, sandboxed parsers |
| 91 | Underestimating support cost of UNKNOWN explanations | PRD | 2 | 3 | 6 | L | L | "How to close this unknown" guidance auto-attached |
| 92 | Local-market data deserts make RE wedge uneven | DATA | 2 | 4 | 8 | M | M | Coverage map published in-product, expectations set pre-purchase |
| 93 | Enterprise pilot success criteria disputes | GTM | 2 | 3 | 6 | L | L | Signed success criteria template before pilot start |
| 94 | Technical debt from speed compromises verification core | OPS | 3 | 3 | 9 | M | M | Core = high-rigor zone (coverage/mutation gates), debt budget elsewhere |
| 95 | Regional bank/lender partner reputational event | MKT | 2 | 2 | 4 | L | L | Partner diligence, diversified logos |
| 96 | Patent troll targeting valuation/verification claims | LEG | 2 | 2 | 4 | M | L | Defensive publication of methods, patent counsel budget at A |
| 97 | Key conference/community bans vendor participation | GTM | 1 | 3 | 3 | L | L | Value-first participation, member-led advocacy |
| 98 | Time-zone concentration limits support coverage | OPS | 1 | 4 | 4 | L | L | Async-first support, EU hire mo 30 |
| 99 | Office/remote culture drift lowers velocity | OPS | 2 | 2 | 4 | L | L | Written-first culture (this repo is the culture), quarterly onsites |
| 100 | Name/trademark conflict on "DealPilot" in a target class | LEG | 2 | 2 | 4 | L | L | Clearance search + filing at incorporation; fallback names reserved |

**Standing review actions:** rows scoring ≥12 require a named owner, a tested mitigation (not just written), and a quarterly tabletop. New risks enter via any employee → triage in weekly staff.
