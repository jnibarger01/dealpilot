# DealPilot — UX Principles & Core Flows
Status: Approved · Owner: Design

## 1. Design Principles (ranked; ties break upward)

1. **Uncertainty is a first-class citizen.** UNKNOWN and CONTRADICTED get the strongest visual treatment in the product. We never design confidence we don't have; no green checkmarks without a citation behind them.
2. **Receipts one click away, always.** Any number, anywhere, opens its claim card (value, status, evidence chips with provenance, adjudication rationale). If a surface can't support the click-through, it can't show the number.
3. **Progressive disclosure, forensic depth.** Evidence band → key findings → full claim table → raw evidence → ledger. Rachel stops at layer 2; Dana's auditor goes to layer 5.
4. **The memo is the product.** Every flow ends in an artifact worth forwarding; the forwarded artifact must stand alone (see personas §Cross-Persona Laws).
5. **Honest latency.** Verification takes minutes; show a live pipeline view (claims found → evidence collected → adjudicated) rather than a spinner. Perceived integrity > perceived speed.
6. **Fail-closed UX.** Errors and gaps render as explicit states with next actions ("County source unavailable — status UNKNOWN. Upload tax record or retry in 2h"), never as blanks.

## 2. Core Flows

**F1 First deal (activation):** drop URL/PDF → live pipeline view → memo. Zero configuration before first value; account details deferred until export. Target: ≤4 min to first insight (shallow), ≤10 min p95 to verified memo.
**F2 Claim triage:** claim table sorted CONTRADICTED → UNKNOWN(material) → REPORTED → CORROBORATED → VERIFIED. Bulk actions: "generate broker questions," "request evidence," "accept as user-asserted (logged)."
**F3 Close-the-unknowns:** each UNKNOWN shows closure path (which document/source, est. cost/time, one-click request-from-seller email draft). This flow is Sam's QoE-triage superpower.
**F4 Review & approve (Dana):** reviewer diff view (what changed since last review), annotate on claims, approve with attestation modal (identity, timestamp, hash shown — the signing moment should *feel* consequential).
**F5 Pipeline inbox:** forwarded deals appear as screened cards (evidence-band chip + top finding); daily digest email mirrors card layout.

## 3. Information Design

- **Status system:** VERIFIED (solid green ●), CORROBORATED (green ◐), REPORTED (gray ○), CONTRADICTED (red ✕), UNKNOWN (amber ?). Shape+color (color-blind safe); identical in product, exports, marketing.
- **Numbers:** ranges rendered as bands with driver labels; point values always carry status glyph inline (e.g., "$1,700/mo ◐").
- **Evidence chips:** favicon/source badge + retrieved-at age ("county · 3d ago"). Stale (>TTL) chips visually decay.

## 4. Voice & Microcopy

Forensic, calm, specific. Banned words in-product: "probably," "seems," "likely" without a stated basis; "guaranteed"; "AI magic." UNKNOWN copy pattern: *what we couldn't verify → why → how to close it.* Contradiction copy pattern: *claim vs evidence, side by side, no adjectives* — the data is the drama.

## 5. Accessibility & Platforms

WCAG 2.1 AA in Definition of Done (contrast, keyboard paths for triage/approval, screen-reader claim-table semantics, no color-only status). Web-first responsive; mobile web read/approve flows first-class (Dana approves from her phone); native apps deferred (P2). PDF exports tagged/accessible.

## 6. Design QA Gates

Every shipped surface passes: (a) receipts-one-click audit, (b) fail-closed state review (all error/empty states designed), (c) status-system conformance, (d) forwardability test (artifact shown cold to a non-user; they must correctly state the evidence band + top risk in <60s).
