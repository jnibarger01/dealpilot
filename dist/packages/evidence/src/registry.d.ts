import type { Claim, EvidenceItem } from "../../contracts/src/index.js";
export interface ManualEvidenceInput {
    sourceId: string;
    observedValue: string | number | boolean;
    unit: string;
    provenance: string;
    reviewerValidated: boolean;
}
export declare function createManualEvidence(claim: Claim, input: ManualEvidenceInput, now: string): EvidenceItem;
export declare function evidenceForClaim(claim: Claim, evidenceItems: readonly EvidenceItem[]): EvidenceItem[];
