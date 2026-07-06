import { sha256Hex, canonicalJson } from "../../ledger/src/ledger.js";
export function createManualEvidence(claim, input, now) {
    const tier = input.reviewerValidated ? "B" : "D";
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
export function evidenceForClaim(claim, evidenceItems) {
    return evidenceItems.filter((evidence) => evidence.claimId === claim.id);
}
//# sourceMappingURL=registry.js.map