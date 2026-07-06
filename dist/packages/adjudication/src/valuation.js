import { getClaimDefinition } from "../../contracts/src/index.js";
const blockingUnsupported = new Set(["UNKNOWN", "CONTRADICTED", "REPORTED"]);
export function computeValuation(claims) {
    const blockers = claims
        .filter((claim) => claim.materiality === "blocking" &&
        blockingUnsupported.has(claim.status))
        .map((claim) => ({
        claimId: claim.id,
        claimType: claim.type,
        status: claim.status,
        unblockText: getClaimDefinition(claim.type).unblockText,
    }));
    if (blockers.length > 0) {
        return {
            status: "REFUSED",
            currency: "USD",
            rangeMinor: null,
            drivers: [],
            blockers,
            assumptions: [],
        };
    }
    const listPriceClaim = claims.find((claim) => claim.type === "financial.list_price" &&
        typeof claim.proposition.value === "number");
    const anchor = typeof listPriceClaim?.proposition.value === "number"
        ? listPriceClaim.proposition.value
        : 400000;
    const low = Math.round(anchor * 0.92 * 100);
    const high = Math.round(anchor * 1.05 * 100);
    return {
        status: "COMPLETED",
        currency: "USD",
        rangeMinor: [low, high],
        drivers: claims
            .filter((claim) => claim.evidenceRefs.length > 0)
            .map((claim) => claim.id),
        blockers: [],
        assumptions: [
            "Range is deterministic MVP output and is only emitted when blocking inputs are supported.",
        ],
    };
}
//# sourceMappingURL=valuation.js.map