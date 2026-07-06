import type { ClaimType, Materiality } from "./types.js";
export interface ClaimTypeDefinition {
    type: ClaimType;
    materiality: Materiality;
    unblockText: string;
    unit: string;
    predicate: string;
}
export declare const CLAIM_DEFINITIONS: readonly ClaimTypeDefinition[];
export declare function getClaimDefinition(type: ClaimType): ClaimTypeDefinition;
