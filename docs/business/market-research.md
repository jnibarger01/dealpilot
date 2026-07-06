# DealPilot — Market Research
Status: Approved · Owner: CEO/Head of Product · Method notes inline; all figures are planning estimates with stated logic, not audited data.

## 1. Market Sizing

### 1.1 TAM — $47B (US-anchored, global upside excluded from model)

Top-down: US spend on transaction diligence, valuation, and buy-side decision support delivered as professional services.

| Component | Logic | Est. annual spend |
|---|---|---|
| SMB M&A diligence & QoE | ~10K completed lower-middle-market deals + ~50K micro-acquisitions × $8–60K blended buy-side diligence; plus ~10x evaluated-but-not-closed spend | $9B |
| RE investment analysis & appraisal | ~6M annual US residential/commercial investment-relevant transactions; appraisal + inspection + analyst spend share | $18B |
| Corp dev / mid-market M&A analyst labor | ~40K corp-dev & PE analysts × $180K loaded × 60% time on screening/diligence | $4.3B |
| Lender/credit underwriting ops (SMB + CRE) | Underwriting labor addressable by decision software | $7B |
| Procurement/vendor diligence (later phase) | Third-party risk & vendor evaluation software+services | $8.7B |
| **TAM** | | **≈ $47B** |

Bottom-up cross-check: ~2.5M US professional-grade buyers/analysts (RE investors ≥3 deals/yr, active searchers, corp dev, credit analysts) × $3–20K/yr software-replaceable spend → $30–50B band. Consistent.

### 1.2 SAM — $6.2B

What DealPilot's Phase 1–2 product can serve: software-delivered underwriting for (a) US residential RE investors, (b) SMB acquisition entrepreneurs, (c) mid-market corp dev / family office teams.

| Segment | Population | Realistic ACV | SAM |
|---|---|---|---|
| Active RE investors (5+ underwrites/yr) | ~1.1M | $1.8–5.4K | $3.3B |
| Serious ETA searchers / micro-PE buyers | ~45K active at any time | $5.4K | $240M |
| SMB brokers/advisors (buy-side prep) | ~60K | $5.4K | $325M |
| Corp dev / family office / independent sponsors | ~18K teams | $60–150K | $1.6B |
| Lender credit desks (SMB/CRE, Phase 2) | ~4K institutions | $180K | $720M |
| **SAM** | | | **≈ $6.2B** |

### 1.3 SOM — $180M by Year 5 (~3% of SAM)

Derivation from the operating plan (see `financial-model.md`): Y5 ARR target $46M represents ~0.75% SAM penetration — deliberately conservative vs. the $180M ceiling implied by achievable share in the two wedge segments (4–6% of active searchers, 1.5% of active RE investors, 120 enterprise logos).

## 2. Customer Segments & Jobs To Be Done

| Segment | JTBD (primary) | Today's alternative | Willingness to pay driver |
|---|---|---|---|
| RE investor (1–50 units) | "When a property hits my inbox, tell me within an hour whether the numbers survive contact with reality, so I can offer before competitors." | Spreadsheet + gut + Zillow; occasional appraisal | Speed-to-offer; avoided bad buys ($30–150K downside each) |
| ETA searcher | "When I get a CIM, separate seller fiction from fact so I only spend broker calls and QoE dollars on real deals." | Manual CIM teardown, 4–8 hrs each × 200/yr | Time; QoE spend triage ($15–40K each) |
| Corp dev analyst | "When leadership asks 'should we look at this?', produce a defensible screen memo with sources by tomorrow's meeting." | Analyst weekends + PitchBook | Analyst leverage; audit trail for IC |
| Family office / sponsor | "Underwrite across asset classes with one consistent, LP-defensible methodology." | Fragmented consultants | Consistency; LP reporting |
| Lender credit desk (Phase 2) | "Verify borrower-supplied claims automatically; document the file for examiners." | Manual verification, checklists | Compliance cost; loss rates |

Full personas with day-in-the-life detail: `../product/personas.md`.

## 3. Competitive Landscape

| Player class | Examples | What they do | Why they don't do our job |
|---|---|---|---|
| Deal-sourcing/search AI | Grata, Cyndx, various "AI deal finder" startups | Find targets | Discovery, not evaluation; no verification claim |
| Data platforms | CoStar, PitchBook, ATTOM, Crexi | Sell records | Inputs to us (and partners); no synthesis, no claim-level verification of *seller* documents |
| RE analysis tools | DealCheck, PropStream, Mashvisor, REI calculators | Calculators on user-entered numbers | Garbage-in tolerated; no evidence, no audit |
| SMB marketplaces | BizBuySell, Flippa (w/ basic vetting), Baton | Listings + light vetting | Seller-aligned incentives; vetting is marketing, not underwriting |
| QoE / diligence services | Regional CPA firms, Guardian, DueDilio marketplace | Human diligence | Our Phase-3 marketplace supply, not competitors; 100x our cost/latency |
| Generic AI assistants | ChatGPT, Claude, Copilot in-workflow | Summarize anything | No provenance guarantee; fluency-optimized; can't sell "audit-grade" without rebuilding architecture — this is the key structural gap |
| Doc-AI diligence (upmarket) | Hebbia, Harvey-adjacent M&A tools | Enterprise doc Q&A for megadeals | $100K+ enterprise-only; Q&A ≠ underwriting; we own the long tail and the verdict layer |

**Most dangerous future competitor:** a data incumbent (CoStar-class) adding a verification layer, or a doc-AI player moving downmarket. Mitigations: Evidence Graph head start, prosumer distribution they lack, and category branding (risk register R-3, R-7).

## 4. SWOT

| | Helpful | Harmful |
|---|---|---|
| **Internal** | **S:** Verification-native architecture (18-mo replication cost); founder depth in audit/fail-closed systems; wedge users with weekly pain; software margins on a services budget | **W:** Evidence coverage gaps at launch (long-tail counties, private financials); two-vertical focus strains a small team; brand unknown; verification COGS pressure early |
| **External** | **O:** $10T SMB ownership transfer; AI-trust backlash rewards our positioning; data-API maturation; lender/regtech pull in Phase 2; expert marketplace flywheel | **T:** Foundation-model platforms verticalizing; data providers raising API prices or restricting terms; state appraisal/valuation regulation creep; a public verification failure damaging category trust |

## 5. Porter's Five Forces

| Force | Level | Notes |
|---|---|---|
| Threat of new entrants | **Med-High** | Prompt-level clones trivial; *credible* verification infra + evidence corpus is the barrier. We must make the difference legible (public conformance tests, verifiable ledger exports). |
| Supplier power (data + model providers) | **Med-High** | Concentrated data sources (county aggregators, financial data) and 2–3 frontier-model vendors. Mitigate: multi-source adapters, multi-model routing, cached/derived evidence rights negotiated in contracts. |
| Buyer power | **Med** prosumer / **Med-High** enterprise | Prosumers price-sensitive but pain is acute and per-deal ROI obvious; enterprise will demand security review, SLAs, discounts. |
| Substitutes | **Med** | Human diligence (slow/expensive), doing nothing (the real incumbent), generic AI (untrusted). Our marketing target is "doing nothing." |
| Rivalry | **Low today → High in 36 mo** | Category is unnamed; land-grab window ≈ 2–3 years. |

## 6. Blue Ocean Analysis

Industry competes on: listing volume, data breadth, summary fluency, report polish. We **eliminate** unverified synthesis; **reduce** report length and turnaround (weeks→minutes); **raise** provenance, contradiction detection, and auditability from zero to headline; **create** claim-status vocabulary, verifiable ledger exports, decision approval attestations, and an unknowns-first UX. Strategy canvas: incumbents cluster on "more data, prettier output"; DealPilot alone occupies "provable output" — an axis buyers with money at stake will pay a premium to be on.

## 7. Industry Trends (with implications)

1. **AI-trust bifurcation** — market splitting into fluent-generic and verified-vertical; procurement checklists starting to ask "how do you prevent hallucination?" → our RFP answer is architectural, not policy.
2. **SMB ownership transfer wave** — boomer retirements put ~$10T of business value in motion → structurally growing buyer population for 15+ years.
3. **Institutionalization of small assets** — SFR funds, micro-PE, franchise roll-ups importing IC-style process to small deals → demand for consistent, defensible memos.
4. **Data access consolidation** — aggregators tightening API terms → build multi-source redundancy and user-supplied-evidence paths early (risk R-4).
5. **Agentic-workflow standardization (MCP et al.)** — verification exposed as tools/servers lets DealPilot become the underwriting layer *inside* other agents → Phase-3 API strategy.
6. **Regulatory attention to AI in credit/housing decisions** — CFPB/FTC scrutiny of algorithmic decisions → stay decision-*support*, human-approved; avoid consumer-credit adverse-action territory until purpose-built (see §8).

## 8. Regulatory Landscape (summary; full analysis in `../legal/compliance.md`)

| Regime | Applies? | Posture |
|---|---|---|
| Investment Advisers Act / broker-dealer | No, by design | We provide software analysis of user-directed deals, no personalized securities advice, no compensation tied to transactions. Guardrails in ToS + product copy; counsel review at each vertical expansion. |
| State appraisal law (USPAP) | Avoid | Never market outputs as "appraisals"; language: "valuation estimate range." No use where a licensed appraisal is legally required. |
| FCRA | Avoid v1 | No consumer reports, no tenant/employment screening, no consumer-credit eligibility use. Enterprise lender phase gets dedicated FCRA counsel + product mode before launch. |
| ECOA / fair-lending (Phase 2 lenders) | Future | Lender deployments: model documentation, adverse-impact testing, human decisioning retained. |
| GDPR / CCPA-CPRA | Yes | DPAs, DSR tooling, retention schedules — engineered, not promised. |
| SOC 2 | Market requirement | Type I mo 9, Type II mo 18. |
| Data-source ToS / scraping law | Yes, daily | Licensed APIs preferred; adapter-level ToS registry; no circumvention; provenance records double as compliance records. |
| AI disclosure (state AI acts, FTC) | Yes | Clear AI-generated labeling, capability/limitation disclosures — MVD makes this easy and true. |
