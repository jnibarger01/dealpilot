import assert from "node:assert/strict";
import test from "node:test";

import { createMvpApplication } from "../dist/apps/api/src/application.js";
import { verifyLedger } from "../dist/packages/ledger/src/ledger.js";

const sellerText = `
123 Evidence Lane listing package
Asking Price: $450,000
NOI: $312,000
Rent Roll: $26,000 monthly
Square Feet: 2400
Annual Taxes: $5,900
Year Built: 1985
Occupancy: 92%
HOA: $150 monthly
Zoning: R-2
Open permits: none disclosed
Flood Zone: AE
Comparable basis: nearby duplex sales
Lien status: seller says clear title
`;

test("@ac Slice-1 URL/text artifact -> claims -> UNKNOWN/REFUSED memo -> citation pass -> ledger verify", async () => {
  const app = createMvpApplication({ now: () => "2026-07-06T00:00:00.000Z" });

  const deal = await app.createDeal({
    kind: "real_estate",
    sourceUrl: "https://example.invalid/listing/123",
    artifactText: sellerText,
  });
  assert.equal(deal.state, "ready");
  assert.ok(deal.artifacts[0].sha256.startsWith("sha256:"));

  const run = await app.startVerificationRun(deal.id, {
    depth: "standard",
    budgetCredits: 12,
  });
  assert.equal(run.state, "refused");
  assert.equal(run.valuation.status, "REFUSED");
  assert.ok(
    run.claims.length >= 10,
    `expected extracted RE claims, got ${run.claims.length}`,
  );
  assert.ok(
    run.claims.every((claim) => claim.status),
    "every claim must have a status",
  );
  assert.ok(
    run.claims.some(
      (claim) => claim.status === "UNKNOWN" && claim.materiality === "blocking",
    ),
  );
  assert.ok(
    run.memo.sections.some((section) =>
      /Unknowns & How to Close Them/i.test(section.heading),
    ),
  );
  assert.equal(
    run.citationCheck.passed,
    true,
    run.citationCheck.errors.join("\n"),
  );
  assert.equal(run.ledgerVerify.valid, true);

  const ledgerExport = app.exportLedger(deal.id);
  assert.equal(verifyLedger(ledgerExport.events).valid, true);
  assert.ok(ledgerExport.jsonl.includes("ValuationRefused"));
});

test("@ac Slice-2 manual evidence keeps provenance and never silently promotes unsupported seller assertions", async () => {
  const app = createMvpApplication({ now: () => "2026-07-06T00:00:00.000Z" });
  const deal = await app.createDeal({
    kind: "real_estate",
    artifactText: sellerText,
  });
  const firstRun = await app.startVerificationRun(deal.id, {
    depth: "standard",
    budgetCredits: 12,
  });
  const noi = firstRun.claims.find((claim) => claim.type === "financial.noi");
  assert.ok(noi, "NOI claim should be extracted");

  const manual = await app.addManualEvidence(noi.id, {
    sourceId: "seller.t12_upload",
    observedValue: 312000,
    unit: "USD",
    provenance: "user uploaded T-12 PDF; pending reviewer validation",
    reviewerValidated: false,
  });
  assert.equal(manual.method, "user_supplied");
  assert.equal(manual.sourceTier, "D");

  const secondRun = await app.startVerificationRun(deal.id, {
    depth: "standard",
    budgetCredits: 12,
  });
  const secondNoi = secondRun.claims.find(
    (claim) => claim.type === "financial.noi",
  );
  assert.equal(secondNoi.status, "REPORTED");
  assert.match(secondNoi.statusReason, /seller|reported|tier D/i);
  assert.equal(secondRun.valuation.status, "REFUSED");
});
