function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
function statusGlyph(status) {
    switch (status) {
        case "VERIFIED":
            return "●";
        case "CORROBORATED":
            return "◐";
        case "REPORTED":
            return "○";
        case "CONTRADICTED":
            return "✕";
        case "UNKNOWN":
            return "?";
        default:
            return "!";
    }
}
function claimRow(claim) {
    return `<tr data-status="${claim.status}" data-claim-id="${claim.id}"><td>${statusGlyph(claim.status)} ${claim.status}</td><td>${escapeHtml(claim.type)}</td><td>${escapeHtml(String(claim.proposition.value))}</td><td>${escapeHtml(claim.materiality)}</td><td>${escapeHtml(claim.statusReason)}</td><td><a href="#claim-${claim.id}">open</a></td></tr>`;
}
function evidenceChip(evidence) {
    return `<li><code>${escapeHtml(evidence.id)}</code> ${escapeHtml(evidence.sourceId)} · tier ${evidence.sourceTier} · ${escapeHtml(evidence.method)} · ${escapeHtml(evidence.provenance)}</li>`;
}
export function renderDealPage(run) {
    const unknowns = run.claims.filter((claim) => claim.status === "UNKNOWN" ||
        (claim.materiality === "blocking" && claim.status === "REPORTED"));
    const memoSections = run.memo.sections
        .map((section) => `<section><h3>${escapeHtml(section.heading)}</h3><p>${escapeHtml(section.text)}</p></section>`)
        .join("\n");
    const claimRows = run.claims.map(claimRow).join("\n");
    const evidenceItems = run.evidence.length > 0
        ? run.evidence.map(evidenceChip).join("\n")
        : "<li>No admitted evidence yet; missing evidence is rendered as UNKNOWN/REFUSED, not hidden.</li>";
    const drillDown = run.claims
        .map((claim) => `<article id="claim-${claim.id}"><h4>${escapeHtml(claim.type)} — ${claim.status}</h4><p>${escapeHtml(claim.statusReason)}</p><p>Evidence refs: ${escapeHtml(claim.evidenceRefs.join(", ") || "none")}</p></article>`)
        .join("\n");
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>DealPilot MVP Evidence Memo</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; color: #172033; background: #f7f8fb; }
    .band { border: 2px solid #d97706; background: #fff7ed; padding: 1rem; border-radius: 8px; }
    .refused { color: #991b1b; font-weight: 700; }
    table { border-collapse: collapse; width: 100%; background: white; }
    th, td { border: 1px solid #d8dee9; padding: 0.5rem; text-align: left; }
    [data-status="UNKNOWN"] { background: #fef3c7; }
    [data-status="CONTRADICTED"] { background: #fee2e2; }
  </style>
</head>
<body>
  <h1>DealPilot MVP</h1>
  <p>Evidence first. Deterministic adjudication. Fail closed.</p>
  <div class="band">
    <strong>Evidence band:</strong> ${escapeHtml(run.memo.evidenceBand)}
    <strong class="refused">Valuation: ${run.valuation.status}</strong>
  </div>
  <nav aria-label="Claim filters">
    <button data-filter="UNKNOWN">UNKNOWN</button>
    <button data-filter="CONTRADICTED">CONTRADICTED</button>
    <button data-filter="REPORTED">REPORTED</button>
    <button data-filter="CORROBORATED">CORROBORATED</button>
    <button data-filter="VERIFIED">VERIFIED</button>
  </nav>
  <h2>Memo</h2>
  ${memoSections}
  <h2>Close-the-Unknowns Worklist</h2>
  <ul>${unknowns.map((claim) => `<li>${escapeHtml(claim.type)} — ${escapeHtml(claim.statusReason)}</li>`).join("\n")}</ul>
  <h2>Claim Table</h2>
  <table><thead><tr><th>Status</th><th>Type</th><th>Value</th><th>Materiality</th><th>Rationale</th><th>Drill</th></tr></thead><tbody>${claimRows}</tbody></table>
  <h2>Evidence Explorer</h2>
  <ul>${evidenceItems}</ul>
  <h2>Claim Drill-down</h2>
  ${drillDown}
  <footer>Ledger head: <code>${escapeHtml(run.memo.ledger.headHash)}</code></footer>
</body>
</html>`;
}
//# sourceMappingURL=render.js.map