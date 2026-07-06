import assert from "node:assert/strict";
import test from "node:test";

import { adjudicateClaim } from "../dist/packages/adjudication/src/adjudicator.js";
import { citationCheck, composeMemo } from "../dist/packages/memo/src/memo.js";
import {
  appendLedgerEvent,
  verifyLedger,
} from "../dist/packages/ledger/src/ledger.js";
import { computeValuation } from "../dist/packages/adjudication/src/valuation.js";

const baseClaim = {
  id: "clm_test_noi",
  dealId: "deal_test",
  type: "financial.noi",
  proposition: {
    subject: "property",
    predicate: "annual_noi",
    value: 312000,
    unit: "USD",
    period: "2025",
  },
  sourceSpan: {
    artifactSha256: "artifact_hash",
    charStart: 0,
    charEnd: 24,
    page: 1,
  },
  materiality: "blocking",
  status: "REPORTED",
  statusReason: "Extracted from seller material.",
  evidenceRefs: [],
  createdAt: "2026-07-06T00:00:00.000Z",
  updatedAt: "2026-07-06T00:00:00.000Z",
};

const sellerEvidence = {
  id: "evd_seller_noi",
  claimId: baseClaim.id,
  artifactSha256: "evd_seller_hash",
  sourceId: "seller.upload",
  sourceTier: "D",
  method: "user_supplied",
  retrievedAt: "2026-07-06T00:00:00.000Z",
  adapterVersion: "manual.v1",
  observedValue: 312000,
  unit: "USD",
  supports: "support",
  provenance: "seller-provided rent roll",
};

const authoritativeEvidence = {
  ...sellerEvidence,
  id: "evd_assessor_tax",
  artifactSha256: "evd_assessor_hash",
  sourceId: "county.assessor.metro1",
  sourceTier: "A",
  method: "api",
  adapterVersion: "county-assessor.v1",
  provenance: "county assessor API",
};

test("@ac FR-4.2 VERIFIED requires tier-A evidence; seller evidence cannot upgrade itself", () => {
  const adjudicated = adjudicateClaim(
    baseClaim,
    [sellerEvidence],
    "rubric-mvp.1",
  );
  assert.equal(adjudicated.status, "REPORTED");
  assert.equal(adjudicated.evidenceRefs.length, 1);
  assert.match(adjudicated.statusReason, /seller|reported|tier D/i);

  const verified = adjudicateClaim(
    { ...baseClaim, type: "financial.taxes", materiality: "blocking" },
    [authoritativeEvidence],
    "rubric-mvp.1",
  );
  assert.equal(verified.status, "VERIFIED");
  assert.equal(verified.evidenceRefs[0], authoritativeEvidence.id);
});

test("@ac FR-5.2 valuation refuses when blocking claims remain UNKNOWN or CONTRADICTED", () => {
  const unknownBlocking = {
    ...baseClaim,
    status: "UNKNOWN",
    statusReason: "Evidence source failed.",
    evidenceRefs: [],
  };
  const valuation = computeValuation([unknownBlocking]);
  assert.equal(valuation.status, "REFUSED");
  assert.equal(valuation.blockers.length, 1);
  assert.equal(valuation.blockers[0].claimId, baseClaim.id);
  assert.match(valuation.blockers[0].unblockText, /upload|evidence|verify/i);
});

test("@ac FR-6.1 citation checker blocks uncited factual prose and permits cited memo sections", () => {
  const valuation = computeValuation([{ ...baseClaim, status: "UNKNOWN" }]);
  const memo = composeMemo({
    id: "memo_test",
    dealId: "deal_test",
    runId: "run_test",
    claims: [{ ...baseClaim, status: "UNKNOWN" }],
    valuation,
    ledgerHeadHash: "head_hash",
    generatedAt: "2026-07-06T00:00:00.000Z",
  });
  const result = citationCheck(memo);
  assert.equal(result.passed, true, result.errors.join("\n"));

  const broken = {
    ...memo,
    sections: [
      ...memo.sections,
      {
        heading: "Bad",
        text: "NOI is 312000 without a citation.",
        claimIds: [],
        evidenceIds: [],
      },
    ],
  };
  const brokenResult = citationCheck(broken);
  assert.equal(brokenResult.passed, false);
  assert.match(brokenResult.errors.join("\n"), /uncited/i);
});

test("@ac FR-7.1 ledger is append-only and tamper-evident", () => {
  const one = appendLedgerEvent([], {
    streamId: "deal_test",
    type: "DealIngested",
    payload: { dealId: "deal_test" },
    actor: "system",
  });
  const two = appendLedgerEvent(one, {
    streamId: "deal_test",
    type: "ArtifactStored",
    payload: { sha256: "artifact_hash" },
    actor: "system",
  });
  assert.equal(verifyLedger(two).valid, true);

  const tampered = two.map((event) => ({ ...event }));
  tampered[0] = { ...tampered[0], payload: { dealId: "deal_other" } };
  assert.equal(verifyLedger(tampered).valid, false);
});
