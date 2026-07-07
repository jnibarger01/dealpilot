import { CLAIM_DEFINITIONS, getClaimDefinition, } from "../../contracts/src/index.js";
const blockingUnsupported = new Set(["UNKNOWN", "CONTRADICTED", "REPORTED"]);
const valuationDriverSupported = new Set(["VERIFIED", "CORROBORATED"]);
export function computeValuation(claims) {
    const presentClaimTypes = new Set(claims.map((claim) => claim.type));
    const unsupportedBlockers = claims
        .filter((claim) => claim.materiality === "blocking" &&
        blockingUnsupported.has(claim.status))
        .map((claim) => ({
        claimId: claim.id,
        claimType: claim.type,
        status: claim.status,
        unblockText: getClaimDefinition(claim.type).unblockText,
    }));
    const missingBlockers = CLAIM_DEFINITIONS.filter((definition) => definition.materiality === "blocking" &&
        !presentClaimTypes.has(definition.type)).map((definition) => ({
        claimId: `missing:${definition.type}`,
        claimType: definition.type,
        status: "UNKNOWN",
        unblockText: definition.unblockText,
    }));
    const blockers = [...unsupportedBlockers, ...missingBlockers];
    const listPriceClaim = claims.find((claim) => claim.type === "financial.list_price" &&
        typeof claim.proposition.value === "number");
    const supportedListPriceClaim = claims.find((claim) => claim.type === "financial.list_price" &&
        typeof claim.proposition.value === "number" &&
        valuationDriverSupported.has(claim.status) &&
        claim.evidenceRefs.length > 0);
    if (!supportedListPriceClaim) {
        blockers.push({
            claimId: listPriceClaim?.id ?? "missing:financial.list_price",
            claimType: "financial.list_price",
            status: listPriceClaim?.status ?? "UNKNOWN",
            unblockText: getClaimDefinition("financial.list_price").unblockText,
        });
    }
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
    if (!supportedListPriceClaim) {
        throw new Error("Supported valuation anchor missing after blocker evaluation.");
    }
    const anchor = Number(supportedListPriceClaim.proposition.value);
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