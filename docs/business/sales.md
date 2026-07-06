# DealPilot — Sales Strategy & Playbook
Status: Approved · Owner: CEO (interim CRO)

## 1. Motion Map

| Segment | Motion | Owner | ACV | Cycle | Close mechanism |
|---|---|---|---|---|---|
| Prosumer | Self-serve PLG | Growth | $1.8–5.4K | Same-day | Card |
| Multi-seat prosumer → Team | Sales-assisted (PQL-triggered) | AE (mo 12+) | $23–35K | 2–4 wks | Card/invoice |
| Corp dev / family office | Founder-led → AE pod | CEO → AEs | $60–150K | 90–150 d | Pilot → annual |
| Lenders (Phase 2) | Enterprise + compliance | AE + SE | $120–250K | 6–9 mo | Pilot + security review |
| API partners (Phase 3) | BD | Head of Partnerships | Usage | 3–6 mo | Rev-share agreement |

## 2. PQL Definition (triggers AE outreach)

Any of: ≥3 seats same domain · ≥80 credits consumed in 30 days · memo exported to ≥3 distinct external recipients · approval-workflow feature clicked ≥2× · security/SSO docs page visited. Score ≥2 signals → AE queue within 24h.

## 3. Enterprise Playbook (corp dev)

**Stage gates (exit criteria enforced in CRM):**
1. *Discovery* — pain quantified: deals screened/yr, analyst hours/deal, current memo turnaround. Exit: champion identified + metrics captured.
2. *Technical validation* — live teardown of one of THEIR historical deals in the meeting (the demo IS a verification run). Exit: "that contradicted claim would have cost us X" moment on record.
3. *Pilot* — 30 days, 10 historical + live deals, success criteria signed up front: ≥85% of pilot memos rated "IC-usable," ≥60% analyst-time reduction measured, zero unexplained assertions. Pilot is paid ($7.5K, credited to contract) — free pilots select for tourists.
4. *Security/procurement* — SOC 2 report, pen-test letter, DPA, architecture one-pager from `../investor/due-diligence.md` package. SLA: respond to security questionnaires ≤5 business days.
5. *Commercials* — platform fee + committed credits; multi-year for discount; exec sponsor sign-off.

**Objection handling (canonical):**
- "How do I know it's not hallucinating?" → open the ledger; run the offline verifier on the export live; show the CONTRADICTED and UNKNOWN sections. Never argue — demonstrate.
- "Our analysts already do this." → position as analyst leverage, not replacement: pilot measures hours redeployed to negotiation/sourcing.
- "Data security?" → tenant isolation architecture, private connectors, no training on customer data (contractual), audit export.
- "What about liability if it's wrong?" → decision-support positioning, human approval gate, ToS + the honest answer: our UNKNOWN discipline exists precisely so wrongness is bounded and visible.

## 4. Team Structure & Quotas

| Mo | Team | Quota model |
|---|---|---|
| 0–12 | Founder + growth | n/a (learning) |
| 12–18 | 2 AEs, 0.5 SE (eng rotation) | $600K ARR/AE/yr ramped |
| 18–30 | 4 AEs, 1 SE, 1 sales lead, 2 CSMs | $750K/AE; CSM NRR 115% book target |
| 30+ | Pods by segment | Standard SaaS ratios; CAC payback ≤14 mo gate on hiring |

Comp: 50/50 base/variable AEs; accelerators >100%; clawback on 90-day churn.

## 5. Forecasting & Ops

- CRM: HubSpot start → Salesforce at ≥6 sellers. Single pipeline taxonomy from day 1 (stage exit criteria above).
- Coverage rule: 3.5× pipeline to quarter target; commit/best-case/pipeline called weekly.
- Win/loss: every closed-lost ≥$25K gets a 20-min interview within 2 weeks; themes reviewed monthly with product.
- Pricing floor and discount policy per `pricing.md` §6; deal desk = CEO until CRO hire.
