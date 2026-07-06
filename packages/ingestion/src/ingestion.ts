import type { Artifact, Deal, DealKind } from "../../contracts/src/index.js";
import { sha256Hex } from "../../ledger/src/ledger.js";

export interface CreateDealInput {
  id: string;
  kind: DealKind;
  artifactText: string;
  sourceUrl: string | null;
  now: string;
}

export function createDeal(input: CreateDealInput): Deal {
  const artifact = createArtifact(
    input.id,
    input.artifactText,
    input.sourceUrl,
    input.now,
    1,
  );
  return {
    id: input.id,
    kind: input.kind,
    state: "ready",
    sourceUrl: input.sourceUrl,
    artifacts: [artifact],
    createdAt: input.now,
    updatedAt: input.now,
  };
}

export function createArtifact(
  dealId: string,
  text: string,
  sourceUrl: string | null,
  now: string,
  version: number,
): Artifact {
  const normalized = text.trim();
  if (!normalized) {
    throw new Error(
      "Artifact text is required; empty deals are fail-closed at ingest.",
    );
  }
  const digest = `sha256:${sha256Hex(normalized)}`;
  return {
    id: `art_${digest.slice(7, 19)}`,
    dealId,
    sha256: digest,
    text: normalized,
    sourceUrl,
    createdAt: now,
    version,
  };
}

export function extractText(artifact: Artifact): string {
  return artifact.text;
}
