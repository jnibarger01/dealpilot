# DealPilot — Seed Pitch Deck (v1 narrative)
Status: Working draft · Owner: CEO · Format: 14 slides, ≤ 20 min talk track. Numbers reconcile to `../business/financial-model.md`; claims must pass the doctrine (no unverifiable stats on our own slides — we eat the dog food).

---

**Slide 1 — Title**
- H1: **DealPilot — Know what's true before you buy.**
- Sub: AI underwriting that verifies every claim with evidence — or tells you it can't.
- Visual: product screenshot, memo with status glyphs visible.
- *Notes*: One breath: "Shopping assistants find things. DealPilot finds out what's actually true about them." Seed, $4M.

**Slide 2 — Problem**
- Every significant purchase decision runs on **seller-asserted claims**: listings, CIMs, broker decks. Buyers spend 20–60 hours per deal manually verifying — or they don't, and pay for it.
- Diligence is expensive, inconsistent, and unauditable. The market's answer so far: prettier summaries of unverified claims.
- Visual: a real listing annotated — 14 claims, 3 checkable in public records, 2 wrong.
- *Notes*: Tell one design-partner story: the $40K NOI overstatement a rubric caught in 9 minutes. **Q likely: "isn't this just diligence software?"** A: diligence tools organize documents; nobody adjudicates claims against evidence at unit economics an individual can afford.

**Slide 3 — Why Now**
- (1) Frontier models finally read documents well enough to *extract* claims reliably — but generate confidently wrong answers, so raw LLMs are unusable for money decisions. (2) Public/commercial evidence sources are API-accessible at last. (3) Post-2023 trust collapse in AI outputs → verification is the scarce good.
- Visual: three-arrow convergence.
- *Notes*: The wedge exists *because* generic AI fails here — hallucination isn't our risk, it's our market.

**Slide 4 — Solution**
- DealPilot ingests a deal (URL/PDF) → extracts every claim → collects independent evidence → adjudicates each claim **VERIFIED / CORROBORATED / REPORTED / CONTRADICTED / UNKNOWN** → produces a valuation range and a memo where **every sentence cites evidence or doesn't ship**.
- If evidence is insufficient: it **refuses** to output a number. That refusal is the product.
- Visual: 90-second product demo (live if wifi gods allow; recorded fallback).
- *Notes*: Land the doctrine sentence: "We never invent facts. Unsupported claims are marked UNKNOWN — and we show our work in a tamper-evident ledger anyone can verify offline."

**Slide 5 — How It Works (the moat mechanics)**
- Separation of powers: the model that reads seller docs can't approve claims; the model that writes memos can't see raw seller docs. Deterministic citation checker (no ML) gates every output. Hash-chained ledger + open-source offline verifier = **auditable by anyone, forgeable by no one**.
- Visual: pipeline diagram (from `../architecture/system-design.md` §1, simplified).
- *Notes*: This is where technical investors lean in. **Q: "What stops OpenAI/Anthropic?"** A: platforms sell generation; our asset is the evidence graph, rubrics tuned per deal type, and the audit substrate — a *liability posture* platforms won't take on horizontally. Plus we're a customer of all of them (routing layer).

**Slide 6 — Market**
- TAM $47B (decision-support + diligence spend across asset classes) → SAM $6.2B (US RE investors + SMB acquisition, API-reachable) → SOM $180M by Y5.
- Wedge 1: US residential RE investors (2.5M active). Wedge 2: SMB acquisition/search (ETA wave). Expansion: corp dev → lenders → Underwriting API as infrastructure.
- Visual: concentric circles + wedge arrows. (Build-up table in `../business/market-research.md` — offer it in diligence.)
- *Notes*: Bottom-up beats top-down here: 40K paying analysts × $2.4K ACV blended in SOM math.

**Slide 7 — Business Model**
- Seats + verification credits (usage scales with value). Analyst $149 → Professional $449 → Team $1,950/mo → Enterprise $60K+. Credits $0.90→$0.45; a standard deal ≈ 8–15 credits.
- Verification COGS $11 → $4/memo (routing, caching, scale); blended GM 66% → 80%.
- Visual: pricing ladder + margin bridge.
- *Notes*: **Q: "Isn't COGS scary?"** A: yes, it's risk #3 on our register — show the weekly $/memo dashboard exists from day one. Honesty here builds more credibility than a hand-wave.

**Slide 8 — Traction & Validation Plan**
- Today (pre-seed stage): 25 design partners committed (LOIs), golden corpus of 320 hand-labeled deals built, walking-skeleton pipeline running end-to-end.
- 12-mo targets: $600K ARR, 40% activation, auto-verification ≥70%, SOC 2 Type I.
- Visual: milestone timeline with the three gates.
- *Notes*: Frame honestly: "We're pre-revenue; here's exactly what $4M must prove and the kill criteria we set ourselves" (`../roadmap/mvp.md` §6). Investors fund discipline as much as vision at seed.

**Slide 9 — Go-to-Market**
- Motion sequence: PLG free tier (watermarked UNVERIFIED — the product markets the problem) → prosumer conversion → team expansion → enterprise pilots ($7.5K paid). Channels: SEO on claim-verification queries, creator partnerships in REI/ETA communities, the annual *State of Seller Claims* report, MCP/API distribution into agent stacks.
- Visual: funnel with CAC by motion ($1.1K prosumer / $6.5K team / $32K ent).
- *Notes*: One channel proof-point per motion; don't recite all six (`../business/marketing.md` has the depth).

**Slide 10 — Competition**
- 2×2: **evidence rigor** (x) vs **workflow depth** (y). Generic AI assistants: high fluency, zero rigor. Data providers (CoStar-class): data, no adjudication. Diligence VDRs: workflow, no verification. Human analysts: rigor at 100× cost. We own the top-right at software economics.
- Visual: the 2×2 with logos.
- *Notes*: **Q: "Data providers could add this."** A: they sell the data both sides use; adjudicating *against* listings conflicts with their sell-side revenue. Structural, not just execution.

**Slide 11 — Moat (compounding)**
- (1) Evidence Graph: every verified claim enriches entity-level priors. (2) Outcome data: what CONTRADICTED patterns predicted bad deals. (3) Rubric IP per vertical. (4) Audit-substrate switching costs (ledgers live in workflows). (5) Open-source verifier = trust standard others must match.
- Visual: flywheel.
- *Notes*: Moat is data + doctrine + distribution of the *verification standard itself*.

**Slide 12 — Team**
- 2 technical founders (CEO: fintech infra + prior exit-adjacent scars; CTO: ML systems at scale — bios per actuals), advisory: RE fund principal, former appraisal-regulatory counsel, ex-LLM-lab evals lead.
- Visual: faces + one-line proof each.
- *Notes*: **Q: key-person risk** → honest answer + hiring plan slide reference (first 11, `../operations/hiring.md`).

**Slide 13 — Financials**
- ARR: $0.6M → $2.8M → $9.0M → $22M → $46M (Y1–Y5). Burn to Series A: $4M over ~24 mo (11 → 23 heads). Series A gates: $1.8M ARR, NRR ≥105%, 6+ enterprise logos or 1.5K seats, verification GM ≥72%, SOC 2 both.
- Visual: ARR curve + gate checklist.
- *Notes*: Emphasize the downshift trigger (mo-18 ARR < $1.0M → freeze at 14 heads) — we pre-committed the brake, not just the gas.

**Slide 14 — Ask**
- **$4.0M seed at $16M post.** Use: 51% engineering, 17% GTM, 11% evidence/model costs, 6% compliance, balance ops/buffer. Buys: public launch, $600K ARR, Series-A-ready proof.
- Visual: use-of-funds donut + milestone line.
- *Notes*: Close on the one-liner and the offline verifier demo — hand them the USB-stick verifier gimmick if in person. Then stop talking.

---

**Appendix slides (on request):** unit-economics detail, security/one-pager (ledger + SOC 2 plan), regulatory perimeter (§6 of `../legal/compliance.md` distilled), competitive teardown, golden-corpus methodology, full financial model walkthrough.

**Deck hygiene:** every number on these slides traces to a doc in this repo; anything we can't back gets cut — the deck must pass the same doctrine we sell.
