# DealPilot — Marketing, Brand & Community
Status: Approved · Owner: Head of Growth (founder interim)

## 1. Brand Strategy

- **Category to own:** *AI Underwriting.* We name it, define it, and write its standards (conformance spec, claim-status vocabulary) so competitors are measured on our axis.
- **Brand promise:** "Receipts, or it didn't happen."
- **Personality:** forensic, calm, slightly dry. An underwriter, not a hype-man. We never use "magic," "revolutionary," "hallucination-free," absolute-accuracy claims, or unverifiable superlatives — our marketing must pass our own doctrine (every landing-page stat carries a footnote/source; yes, really; it's the cheapest brand proof we own).
- **Visual identity:** ledger/monospace accents, evidence-stamp motifs, status colors (VERIFIED green, CONTRADICTED red, UNKNOWN amber) reused from product for instant recognition.

## 2. Messaging House

**Positioning statement:** For professional buyers who make high-stakes purchase decisions, DealPilot is the AI underwriting platform that verifies every claim against evidence — unlike assistants that summarize, or data tools that dump records, DealPilot tells you what's true, what's false, and what's unknown, with the receipts.

| Pillar | Message | Proof |
|---|---|---|
| Trust | "Every sentence cites evidence — or it doesn't ship" | MVD architecture page, offline-verifiable ledger export, published accuracy reports |
| Speed | "Six weeks of diligence in minutes" | Pilot time-study data, live teardown demos |
| Money | "One avoided bad deal pays for a decade" | Contradiction case studies with $ exposure |
| Honesty | "The only AI that says 'unknown'" | The UNKNOWN section itself — screenshot-able differentiation |

## 3. Website Copy (homepage skeleton)

- **H1:** Know what's true before you buy.
- **Sub:** DealPilot verifies every claim in a deal — rent rolls, revenue, comps, condition — against primary sources, and gives you a decision memo with the receipts.
- **CTA:** Verify your first deal free → (routes to upload/URL drop)
- Section 2: *How it works* — 5-step pipeline diagram (extract → collect → verify → value → memo).
- Section 3: *The Unknown section* — screenshot; copy: "Other AIs fill gaps with fluent guesses. DealPilot labels them UNKNOWN and tells you how to close them."
- Section 4: Live teardown gallery (anonymized real deals; contradictions highlighted).
- Section 5: Security/audit strip (SOC 2 badge when earned, ledger-export explainer).
- Footer disclosure: "DealPilot provides decision-support analysis, not investment, legal, or appraisal advice."

Landing pages per segment (RE investor, searcher/ETA, corp dev) with segment-native vocabulary (cap rate/DSCR vs SDE/QoE vs IC memo) and segment-specific teardown examples.

## 4. SEO & Content Strategy

- **Pillar 1 — Verification how-tos (BOFU):** "How to verify a rent roll," "Red flags in a CIM," "Seller's discretionary earnings: what sellers hide." Each ends in an interactive checker (mini-product).
- **Pillar 2 — Deal-teardown series (brand + links):** monthly public teardown of a live anonymized listing; distributed to newsletters/podcasts. This is our category-defining content.
- **Pillar 3 — Benchmarks (compounding):** annual "State of Seller Claims" report (aggregate, consented data): % of claims contradicted by category — press magnet, sales asset.
- **Programmatic (careful, high-quality only):** metro-level RE verification guides. No thin pages; each must independently deserve to rank.
- Targets: 40 pillar articles yr 1; organic = 30% of signups by mo 12; measured by verified-memo activations, not traffic.

## 5. Launch Campaign (mo 4–5, after private beta)

1. Wk −4: 25 beta users' teardowns collected as launch proof; 3 podcast recordings banked.
2. Wk 0: Launch post — "We verified 1,000 seller claims. 31% didn't survive." + live public teardown stream; Product Hunt; searchfund + REI community posts by beta users (not us).
3. Wk +1–4: teardown-a-day on X/LinkedIn; founder AMAs in 3 communities; referral-credit program on.
4. KPI: 2,000 signups, 300 activated (verified memo ≤24h), 90 paid in 45 days.

## 6. Community & Developer Relations

- **Buyer community:** private "Underwriters' Guild" (Slack/Discord) for paying users — deal-structure discussions, monthly expert AMAs, early feature access. Community is retention infrastructure, not a marketing checkbox; staffed from CS.
- **DevRel (mo 18+ with API):** docs-first culture (see `../engineering/api.md`), quickstarts for "verify a listing in 10 lines," sample apps, office hours (MCP server held until post-Series-A trust gates — `review-response.md` RR-9). DevRel goal: 100 external apps calling the API within 12 mo of GA.

## 7. Open Source Strategy

- **Open (Apache-2.0):** the **Ledger Verification Toolkit** — offline verifier for exported decision ledgers, claim-status schema, conformance test vectors. Rationale: our trust claim must be independently checkable; open-sourcing the *verifier* (never the *pipeline*) makes "audit us" real, seeds the standard, and costs competitors nothing they'd want.
- **Open (MIT):** SDKs, MCP server, source-adapter interface spec (so third parties can contribute evidence connectors under a contributor agreement + review gate).
- **Closed:** adjudication rubrics/models, Evidence Graph, valuation engines, orchestration.
- Governance: public spec repo with RFC process; we hold trademark on "DealPilot Verified"; badge licensing terms published.
- Community health metrics: external adapter contributions, verifier downloads, spec RFC participation.

## 8. Social & PR

Founder-led X/LinkedIn (teardowns, build-in-public on verification engineering — credibility with both buyer and dev audiences). PR beats: launch, State of Seller Claims report, SOC 2, Series A, first "badge" marketplace partner. No paid PR retainer before mo 12.
