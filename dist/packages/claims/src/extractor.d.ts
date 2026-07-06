import type { Artifact, Claim } from "../../contracts/src/index.js";
export declare function extractClaims(dealId: string, artifact: Artifact, now: string): Claim[];
