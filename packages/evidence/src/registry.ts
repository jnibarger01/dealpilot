import type {
  Claim,
  EvidenceItem,
  SourceTier,
} from "../../contracts/src/index.js";
import { sha256Hex, canonicalJson } from "../../ledger/src/ledger.js";

export interface ManualEvidenceInput {
  sourceId: string;
  observedValue: string | number | boolean;
  unit: string;
  provenance: string;
  reviewerValidated: boolean;
}

export function createManualEvidence(
  claim: Claim,
  input: ManualEvidenceInput,
  now: string,
): EvidenceItem {
  const tier: SourceTier = input.reviewerValidated ? "B" : "D";
  const artifactSha256 = `sha256:${sha256Hex(canonicalJson({ claimId: claim.id, input }))}`;
  return {
    id: `evd_${artifactSha256.slice(7, 19)}`,
    claimId: claim.id,
    artifactSha256,
    sourceId: input.sourceId,
    sourceTier: tier,
    method: "user_supplied",
    retrievedAt: now,
    adapterVersion: "manual-evidence.mvp.1",
    observedValue: input.observedValue,
    unit: input.unit,
    supports: "support",
    provenance: input.provenance,
    reviewerValidated: input.reviewerValidated,
    lineage: input.sourceId,
  };
}

export function evidenceForClaim(
  claim: Claim,
  evidenceItems: readonly EvidenceItem[],
): EvidenceItem[] {
  return evidenceItems.filter((evidence) => evidence.claimId === claim.id);
}
