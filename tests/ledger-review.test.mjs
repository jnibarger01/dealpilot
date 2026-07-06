import assert from "node:assert/strict";
import test from "node:test";

import { createMvpApplication } from "../dist/apps/api/src/application.js";
import { FALLBACK_MAP } from "../dist/packages/evidence/src/fallbackMap.js";
import { CLAIM_DEFINITIONS } from "../dist/packages/contracts/src/claimRegistry.js";

const sellerText =
  "NOI: $312,000\nAnnual Taxes: $5,900\nFlood Zone: AE\nLien status: seller says clear";

test("@ac RR-1/H3 fallback map covers every MVP claim type and every blocking type has a manual path", () => {
  const mapped = new Set(FALLBACK_MAP.map((row) => row.claimType));
  for (const definition of CLAIM_DEFINITIONS) {
    assert.ok(
      mapped.has(definition.type),
      `missing fallback row for ${definition.type}`,
    );
  }
  const blockingRows = FALLBACK_MAP.filter(
    (row) => row.materiality === "blocking",
  );
  assert.ok(blockingRows.length >= 5);
  for (const row of blockingRows) {
    assert.ok(
      row.manualPath.length > 5,
      `${row.claimType} missing manual path`,
    );
    assert.match(
      row.unblockText,
      /upload|order|retry|evidence|title|leases|tax|FEMA/i,
    );
    assert.equal(row.ifAllFail, "UNKNOWN_REFUSED");
  }
});

test("@ac FR-7/FR-8 ledger records prompt hash, evidence hashes, reviewer approval, and immutable override events", async () => {
  const app = createMvpApplication({ now: () => "2026-07-06T00:00:00.000Z" });
  const deal = await app.createDeal({
    kind: "real_estate",
    artifactText: sellerText,
  });
  const run = await app.startVerificationRun(deal.id, {
    depth: "standard",
    budgetCredits: 12,
  });
  const claim = run.claims.find(
    (candidate) => candidate.type === "financial.noi",
  );
  assert.ok(claim);

  const evidence = await app.addManualEvidence(claim.id, {
    sourceId: "seller.t12_upload",
    observedValue: 312000,
    unit: "USD",
    provenance: "uploaded T-12",
    reviewerValidated: true,
  });
  await app.approveMemo(run.memo.id, {
    reviewerId: "rev_001",
    note: "Approved as refusal-first memo.",
  });
  await app.overrideClaimStatus(claim.id, {
    reviewerId: "rev_001",
    newStatus: "UNKNOWN",
    reason: "Manual evidence was validated as received but not authoritative.",
  });

  const exported = app.exportLedger(deal.id);
  assert.equal(exported.verify.valid, true);
  assert.ok(
    exported.events.every((event) => event.promptHash),
    "every event should carry prompt hash trail",
  );
  assert.ok(
    exported.events.some(
      (event) =>
        event.type === "ManualEvidenceUploaded" &&
        event.evidenceHashes?.includes(evidence.artifactSha256),
    ),
  );
  assert.ok(exported.events.some((event) => event.type === "MemoApproved"));
  assert.ok(
    exported.events.some(
      (event) => event.type === "ClaimStatusOverrideAppended",
    ),
  );

  const overrideEvent = exported.events.find(
    (event) => event.type === "ClaimStatusOverrideAppended",
  );
  assert.equal(
    overrideEvent.payload.reason,
    "Manual evidence was validated as received but not authoritative.",
  );
});
