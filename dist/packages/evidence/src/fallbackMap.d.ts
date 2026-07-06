import type { ClaimType, Materiality, SourceTier } from "../../contracts/src/index.js";
export interface FallbackMapRow {
    claimType: ClaimType;
    materiality: Materiality;
    verifiedTier: SourceTier | null;
    corroboratedTiers: readonly SourceTier[];
    primarySource: string | null;
    backupSource: string | null;
    manualPath: string;
    ifAllFail: "UNKNOWN_REFUSED" | "UNKNOWN" | "REPORTED_FLAGGED" | "REPORTED";
    unblockText: string;
}
export declare const FALLBACK_MAP: readonly FallbackMapRow[];
export declare function fallbackFor(claimType: ClaimType): FallbackMapRow;
