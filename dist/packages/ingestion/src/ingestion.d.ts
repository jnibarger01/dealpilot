import type { Artifact, Deal, DealKind } from "../../contracts/src/index.js";
export interface CreateDealInput {
    id: string;
    kind: DealKind;
    artifactText: string;
    sourceUrl: string | null;
    now: string;
}
export declare function createDeal(input: CreateDealInput): Deal;
export declare function createArtifact(dealId: string, text: string, sourceUrl: string | null, now: string, version: number): Artifact;
export declare function extractText(artifact: Artifact): string;
