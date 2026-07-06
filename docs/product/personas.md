# DealPilot — Personas & Jobs To Be Done
Status: Approved · Owner: Product · Built from 42 discovery interviews (18 RE investors, 14 searchers, 7 corp dev, 3 lenders); refresh quarterly.

## P1 — "Investor Rachel" (wedge, PLG)

**Profile:** 38, owns 12 SFR/duplex units across two metros, W-2 job, underwrites nights/weekends. Tools: spreadsheet template, Zillow/Redfin, a PropStream trial she didn't renew, agent texts.
**Volume:** ~30 underwrites/quarter; offers on 4; closes 1–2/yr.
**JTBD:** *When a property hits my inbox, I need to know within the hour whether the seller's numbers survive contact with reality, so I can offer fast without buying a lie.*
**Pains (ranked):** (1) rent/expense claims she can't check without hours of county-site archaeology; (2) fear of the one bad buy that erases three good ones; (3) analysis paralysis from conflicting data sources.
**Gains that convert:** contradiction catches with dollar exposure ("seller claims $2,100 rent; county + comp evidence supports $1,650–1,750 — $5,400/yr gap"); speed-to-offer; a memo she can send her lender/partner.
**Quote:** "I don't need another calculator. I need to know if the inputs are lies."
**Willingness to pay:** $99–199/mo readily; credits fine if estimated up front.
**Success metric for us:** she forwards listings to the pipeline inbox by week 3.

## P2 — "Searcher Sam" (wedge, PLG→Team)

**Profile:** 31, full-time self-funded searcher, 14 months in, reviews 15–20 CIMs/month, has burned $28K on QoE for two deals that died.
**JTBD:** *When I receive a CIM, I need to separate seller fiction from fact before I spend calls, LOIs, or QoE dollars, so my limited runway goes only to real deals.*
**Pains:** (1) SDE "adjustments" that evaporate under scrutiny; (2) 4–8 hrs per CIM teardown; (3) knowing which unknowns are worth $15K to close.
**Gains:** claim-ranked CIM teardown in minutes; UNKNOWN section as a literal QoE shopping list; broker-question generator from CONTRADICTED/REPORTED claims.
**Quote:** "Every CIM is a mystery novel where the butler is EBITDA add-backs."
**WTP:** $300–500/mo without blinking (compares to one hour of his lawyer).
**Team path:** searchers share deals with investors/advisors → seat expansion.

## P3 — "Corp Dev Dana" (enterprise)

**Profile:** 29, senior analyst at a $400M-revenue acquirer, 3-person corp dev team, screens ~80 targets/yr for 2–3 acquisitions.
**JTBD:** *When leadership flags a target Friday afternoon, I need an IC-defensible screen memo with sources by Monday, so I stop spending weekends on deals we'll pass on anyway.*
**Pains:** (1) memo assembly labor; (2) IC members who reject anything unsourced; (3) inconsistent methodology across analysts; (4) audit questions a year later ("why did we pass?").
**Gains:** memo templates matching their IC format; approval workflow with attestations; the ledger as institutional memory.
**Buying process:** she's the champion; VP Corp Dev is economic buyer; security review by IT; success = pilot on 10 historical deals.
**WTP:** $60–120K/yr platform is small vs one analyst hire.

## P4 — "Credit Chris" (Phase 2, lender)

**Profile:** SMB/CRE credit team lead at a regional bank; examiner-driven documentation culture.
**JTBD:** *When a borrower submits financials and collateral claims, I need them verified and the file documented to examiner standard, without adding headcount.*
**Constraints that shape product:** FCRA/ECOA boundaries, model-risk-management documentation (SR 11-7 style), on-prem-ish expectations → private connectors, audit exports, human decisioning preserved. Not served until dedicated compliance work (see `../legal/compliance.md`).

## P5 — "Marketplace Expert Elena" (Phase 3, supply side)

**Profile:** independent CPA doing QoE work; wants deal-flow without business development.
**JTBD:** *When a machine can't verify a claim, hand me a structured, scoped task with the evidence gathered so far, so I can price and deliver it in hours, not weeks.*
**Design implications:** tasks must arrive pre-packaged (claim, current evidence, rubric); her output re-enters the ledger with her attestation; her quality score is her reputation asset.

## Anti-Personas (explicitly not served in v1)

- **Retail homebuyer** (emotional purchase, one-shot, consumer-protection surface) — different product.
- **Day-trader/securities analyst** — regulated advice territory; out of doctrine scope.
- **Seller seeking to optimize listings** — conflict with buyer trust; only served later via transparent "get verified" flow with public rubric.

## Cross-Persona Design Laws

1. Status colors and vocabulary identical everywhere (learnability = trust).
2. Every UNKNOWN ships with a closure path (what evidence, where, est. cost).
3. Never bury CONTRADICTED — it is the product's hero moment.
4. The memo must stand alone when forwarded to someone who's never seen DealPilot (viral surface + Dana's IC).
