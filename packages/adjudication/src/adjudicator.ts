import type {
  Claim,
  ClaimStatus,
  EvidenceItem,
  SourceTier,
} from "../../contracts/src/index.js";
import { fallbackFor } from "../../evidence/src/fallbackMap.js";

const supportedTiers: readonly SourceTier[] = ["A", "B", "C"];

function valuesAgree(claim: Claim, evidence: EvidenceItem): boolean {
  if (
    typeof claim.proposition.value === "number" &&
    typeof evidence.observedValue === "number"
  ) {
    const expected = claim.proposition.value;
    const observed = evidence.observedValue;
    const tolerance = Math.max(Math.abs(expected) * 0.05, 1);
    return Math.abs(expected - observed) <= tolerance;
  }
  return (
    String(claim.proposition.value).trim().toLowerCase() ===
    String(evidence.observedValue).trim().toLowerCase()
  );
}

function independentSources(evidence: readonly EvidenceItem[]): string[] {
  return [...new Set(evidence.map((item) => item.lineage ?? item.sourceId))];
}

export function adjudicateClaim(
  claim: Claim,
  evidence: readonly EvidenceItem[],
  rubricVersion: string,
  now = claim.updatedAt,
): Claim {
  const relevant = evidence.filter((item) => item.claimId === claim.id);
  if (relevant.length === 0) {
    const row = fallbackFor(claim.type);
    const unresolved: ClaimStatus =
      row.ifAllFail === "REPORTED" || row.ifAllFail === "REPORTED_FLAGGED"
        ? "REPORTED"
        : "UNKNOWN";
    return {
      ...claim,
      status: unresolved,
      statusReason:
        unresolved === "UNKNOWN"
          ? `No admitted evidence collected under ${rubricVersion}; fail-closed UNKNOWN.`
          : "Seller assertion only; kept REPORTED by doctrine.",
      evidenceRefs: [],
      updatedAt: now,
    };
  }

  const conflicts = relevant.filter((item) => item.supports === "conflict");
  const supports = relevant.filter(
    (item) => item.supports === "support" && valuesAgree(claim, item),
  );
  const firstSupport = supports[0];
  const firstConflict = conflicts[0];
  if (firstConflict && firstSupport) {
    return {
      ...claim,
      status: "CONTRADICTED",
      statusReason: `Evidence conflicts with claim under ${rubricVersion}; both sides cited.`,
      evidenceRefs: [firstSupport.id, firstConflict.id],
      updatedAt: now,
    };
  }

  const tierA = supports.find(
    (item) => item.sourceTier === "A" && item.method !== "user_supplied",
  );
  if (tierA) {
    return {
      ...claim,
      status: "VERIFIED",
      statusReason: `Admitted by authoritative tier-A source ${tierA.sourceId}; evidence as-of ${tierA.retrievedAt}.`,
      evidenceRefs: [tierA.id],
      updatedAt: now,
    };
  }

  const corroborating = supports.filter(
    (item) =>
      supportedTiers.includes(item.sourceTier) && item.sourceTier !== "D",
  );
  if (
    corroborating.length >= 2 &&
    independentSources(corroborating).length >= 2
  ) {
    return {
      ...claim,
      status: "CORROBORATED",
      statusReason: `Two independent non-authoritative sources agree under ${rubricVersion}.`,
      evidenceRefs: corroborating.slice(0, 2).map((item) => item.id),
      updatedAt: now,
    };
  }

  const sellerOnly = relevant.every(
    (item) => item.sourceTier === "D" || item.method === "user_supplied",
  );
  if (sellerOnly) {
    return {
      ...claim,
      status: "REPORTED",
      statusReason:
        "Only seller/user-supplied tier D evidence is present; cannot upgrade beyond REPORTED.",
      evidenceRefs: relevant.map((item) => item.id),
      updatedAt: now,
    };
  }

  return {
    ...claim,
    status: "UNKNOWN",
    statusReason: `Evidence did not satisfy ${rubricVersion}; fail-closed UNKNOWN.`,
    evidenceRefs: relevant.map((item) => item.id),
    updatedAt: now,
  };
}
