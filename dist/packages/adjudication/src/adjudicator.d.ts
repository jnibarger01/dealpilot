import type { Claim, EvidenceItem } from "../../contracts/src/index.js";
export declare function adjudicateClaim(claim: Claim, evidence: readonly EvidenceItem[], rubricVersion: string, now?: string): Claim;
