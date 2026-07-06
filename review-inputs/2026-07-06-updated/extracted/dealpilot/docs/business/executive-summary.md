# DealPilot — Executive Summary & Foundation
Status: Approved · Owner: CEO · Audience: Investors, leadership, all-hands

## 1. One-Liner

**Shopping assistants find things. DealPilot finds out what's actually true about them.** DealPilot is an AI underwriting platform that verifies every claim in a deal, quantifies risk and value with explicit uncertainty, and produces auditable decision memos — every sentence cited to evidence or marked UNKNOWN, by construction.

## 2. The Problem

High-stakes buyers — real estate investors, small-business acquirers, corporate development teams — make six-to-eight-figure decisions on top of **unverified seller claims**. The status quo:

1. **Diligence is manual and expensive.** $5K–$50K per transaction across attorneys, accountants, appraisers, and analyst hours; 2–8 weeks per deal.
2. **Evidence is fragmented.** County records, financial statements, market data, licenses, litigation history — dozens of sources, no unified evidence trail.
3. **Evaluation is inconsistent.** The same CIM gets three different verdicts from three analysts; nothing is repeatable or auditable.
4. **Generic AI made it worse.** LLM copilots summarize confidently and hallucinate freely. For a $2M acquisition, a fluent wrong answer is worse than no answer. Trust in AI output is the binding constraint — and nobody has built the trust layer.

The result: buyers evaluate too few deals, too slowly, with unpriced risk. Sellers with weak assets exploit the asymmetry.

## 3. The Solution

DealPilot ingests a deal (listing, CIM, financials, disclosures), then runs an **underwriting pipeline**:

`Ingest → Extract Claims → Collect Evidence → Verify & Adjudicate → Model Risk & Value → Compose Decision Memo → Human Approval`

Every extracted claim receives a status — **VERIFIED, CORROBORATED, REPORTED, CONTRADICTED, or UNKNOWN** — with provenance-stamped evidence stored in a content-addressed ledger. Valuations are ranges with named drivers, not point estimates. The final Decision Memo cites a claim ID for every assertion; a deterministic checker rejects any sentence that doesn't. Unknowns get their own mandatory section.

This is the **Manual Verifier Doctrine (MVD)**: the system is fail-closed. When evidence is missing, the answer is "unknown," never a guess.

## 4. Why Now

1. **Extraction is finally cheap and good.** Frontier-model document understanding crossed the reliability threshold for claim extraction (~2024–2025); costs fell >10x.
2. **Evidence APIs matured.** County records, business registries, financial data, permit databases, and litigation records are programmatically reachable.
3. **The trust crisis is the wedge.** The market has learned that generic AI hallucinates. A product whose brand is "provably didn't make it up" has a differentiation window that generalist assistants structurally cannot close (their economics reward fluency, not verification).
4. **Buyer-side demand is surging.** The ETA/search-fund movement, the silver-tsunami SMB ownership transfer (~$10T of US business value changing hands over 20 years), and institutionalized single-family investing all expand the population of professional-grade buyers without professional-grade tooling.

## 5. Vision

Every significant purchase decision on Earth is underwritten by software. DealPilot is the trust layer that underwriting runs on — the system of record for *why a decision was made and what the evidence was*.

## 6. Mission

Give every buyer the evidence discipline of an institutional underwriting desk: verified facts, quantified risk, honest uncertainty, and a defensible paper trail — in minutes, not weeks.

## 7. Company Values

1. **Evidence over eloquence.** A cited "unknown" beats an uncited paragraph. This is a product value and a cultural one; we run internal decisions the same way.
2. **Fail closed.** When a pipeline, a model, or a person can't verify, the output degrades to explicit uncertainty — never to silent confidence.
3. **Auditability is a feature, not overhead.** If it isn't in the ledger, it didn't happen.
4. **Ship v1s that actually work.** No demo-ware. A feature is done when its acceptance tests pass against adversarial inputs.
5. **The user owns the decision.** We inform judgment; we never replace it. Human approval gates are sacred.
6. **Respect the data.** Provenance, consent, and retention rules are enforced in code, not policy PDFs.

## 8. Market Thesis

Diligence and decision-support spend for US real estate investing, SMB M&A, and mid-market corp dev exceeds **$40B/yr**, almost entirely delivered as manual professional services. Software captures markets like this when (a) the core labor becomes automatable and (b) a trust mechanism makes automation acceptable. (a) arrived with LLM extraction. DealPilot is (b). The winner owns two compounding assets: the **Evidence Graph** (verified claims linked to sources and outcomes) and the **decision corpus** (what buyers decided and what happened next) — the raw material for risk models nobody else can train. Full sizing in `market-research.md`.

## 9. Founder Narrative

The founding team spent the last decade on two sides of the same problem: operating in high-volume transactional businesses where every day meant pricing risk on incomplete information, and building agent infrastructure where the hard problem was never generation — it was **verification, audit, and fail-closed control**. We built hash-chained flight recorders, approval gates, and verification pipelines for AI systems before it was fashionable, because we'd been burned by confident wrong answers in the real world. DealPilot is those two experiences fused: an underwriting desk's discipline, implemented as verifiable software.

## 10. Elevator Pitch (30 seconds)

"When you buy a business or an investment property, the seller hands you a document full of claims — revenue, rents, condition, comps. Today you either pay $20K and wait six weeks to check them, or you don't check them. DealPilot checks them in minutes. It extracts every claim, verifies each one against primary sources, tells you exactly what's confirmed, what's contradicted, and what's unknown, and gives you a valuation range with the receipts. It's an AI analyst that shows the receipts for every sentence — and says 'unknown' instead of guessing."

## 11. Investor Pitch (2 minutes)

Diligence is a $40B services market delivered by hand. We automate the analyst layer with an architecture whose entire premise is verification: separate extractor, collector, adjudicator, and composer services; a content-addressed evidence store; a hash-chained decision ledger; deterministic citation checking. This is not a prompt — it's infrastructure, and it takes 18+ months to replicate credibly.

We land with prosumers who feel the pain weekly — RE investors and SMB searchers underwriting dozens of deals per quarter at $149–$449/month plus verification credits — then expand into teams and enterprise corp-dev at $60K+ ACVs, and ultimately expose the Underwriting API so any marketplace or lender can embed claim verification. Unit economics work at the wedge (LTV/CAC ≈ 3.5–4, 78% gross margin at scale); the moat compounds through the Evidence Graph and outcome data.

We're raising $4M to reach $1.8M ARR in 24 months, prove verification unit economics, and land the first six enterprise logos — the Series A gate.

## 12. Positioning

| Axis | Shopping/search assistants | Data providers (CoStar, PitchBook, Grata) | Diligence services (QoE firms, appraisers) | **DealPilot** |
|---|---|---|---|---|
| Job | Find options | Supply raw data | Verify, slowly, per-deal | **Evaluate & verify, continuously** |
| Output | Links, summaries | Records | PDF report, weeks later | **Auditable decision memo, minutes** |
| Trust model | "Trust the model" | "Trust the database" | "Trust the firm" | **"Verify the ledger yourself"** |
| Unit | Free/ads | $10–40K/yr data seat | $5–50K/engagement | $1.8–60K+/yr, software margins |

Category we intend to name and own: **AI Underwriting** (subcategory of decision intelligence).

## 13. Competitive Moat (stack-ranked by durability)

1. **Evidence Graph.** Cross-deal corpus of verified claims, source reliability scores, and contradiction patterns. Every deal processed makes verification of the next deal cheaper and better — a data network effect with real switching costs.
2. **Outcome data.** Post-decision results (closed price, realized rents, earn-out outcomes) linked to pre-decision memos. Enables calibrated risk models. No competitor sees both sides.
3. **Verification infrastructure.** Adjudication rubrics, source adapters, provenance pipelines, deterministic checkers, hash-chained ledger. Incumbent assistants would have to rebuild their generation stack to match; bolting citations onto a fluent composer is detectably fake, and our brand will make it detectable.
4. **Audit-grade trust brand.** In markets with fiduciaries, lenders, and LPs, our thesis is that "show me the ledger" becomes a procurement requirement — one we get to define by being first with a checkable ledger.
5. **Workflow lock-in.** Deal pipelines, team review flows, approval attestations, and exported memos referenced in closings create high displacement cost.

## 14. Long-Term Strategy (condensed; detail in `../product/roadmap.md`)

- **Phase 1 (0–24 mo):** Own the prosumer underwriting wedge in RE + SMB acquisition. Prove MVD economics.
- **Phase 2 (24–48 mo):** Team & enterprise: corp dev, family offices, lenders' credit desks. SOC 2 II, private connectors, approval workflows.
- **Phase 3 (36–60 mo):** **Underwriting API + verification marketplace.** Third parties embed DealPilot claim verification; human experts plug into the pipeline for claims machines can't verify (unit walkthroughs, QoE), taking a marketplace rake. Non-load-bearing by design: the core plan clears venture math with Phase 3 removed (`../investor/due-diligence.md` §3).
- **Phase 4 (60+ mo):** Outcome-calibrated risk scores become an industry-standard rating: "DealPilot-verified" as the Carfax/LEED of transactions.

## 15. The Ask

$4.0M seed. 24-month plan, milestones and use of funds in `fundraising.md` and `../investor/fundraising.md`.
