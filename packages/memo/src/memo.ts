import type {
  Claim,
  ClaimStatus,
  CitationCheckResult,
  Memo,
  MemoSection,
  Valuation,
} from "../../contracts/src/index.js";

interface ComposeMemoInput {
  id: string;
  dealId: string;
  runId: string;
  claims: readonly Claim[];
  valuation: Valuation;
  ledgerHeadHash: string;
  generatedAt: string;
}

const allStatuses: readonly ClaimStatus[] = [
  "VERIFIED",
  "CORROBORATED",
  "REPORTED",
  "CONTRADICTED",
  "UNKNOWN",
];

function countStatuses(claims: readonly Claim[]): Record<ClaimStatus, number> {
  const counts: Record<ClaimStatus, number> = {
    VERIFIED: 0,
    CORROBORATED: 0,
    REPORTED: 0,
    CONTRADICTED: 0,
    UNKNOWN: 0,
  };
  for (const claim of claims) {
    counts[claim.status] += 1;
  }
  return counts;
}

function evidenceBand(
  claims: readonly Claim[],
  valuation: Valuation,
): Memo["evidenceBand"] {
  if (valuation.status === "REFUSED") return "Cannot evaluate";
  if (claims.some((claim) => claim.status === "CONTRADICTED"))
    return "Material contradictions";
  if (
    claims.some(
      (claim) => claim.status === "UNKNOWN" || claim.status === "REPORTED",
    )
  )
    return "Substantiated with open items";
  return "Substantiated";
}

function citedList(ids: readonly string[]): string {
  return ids.map((id) => `[${id}]`).join(" ");
}

export function composeMemo(input: ComposeMemoInput): Memo {
  const blockers = input.valuation.blockers;
  const unknownClaims = input.claims.filter(
    (claim) =>
      claim.status === "UNKNOWN" ||
      (claim.materiality === "blocking" && claim.status === "REPORTED"),
  );
  const sections: MemoSection[] = [];

  if (blockers.length > 0) {
    const ids = blockers.map((blocker) => blocker.claimId);
    sections.push({
      heading: "Evidence Band",
      text: `Cannot evaluate because material inputs remain unresolved ${citedList(ids)}.`,
      claimIds: ids,
      evidenceIds: [],
    });
  } else {
    const ids = input.claims.map((claim) => claim.id);
    sections.push({
      heading: "Evidence Band",
      text: `Substantiated evidence is sufficient for an MVP valuation range ${citedList(ids)}.`,
      claimIds: ids,
      evidenceIds: input.claims.flatMap((claim) => claim.evidenceRefs),
    });
  }

  if (input.valuation.status === "REFUSED") {
    const ids = blockers.map((blocker) => blocker.claimId);
    sections.push({
      heading: "Valuation",
      text: `Valuation is REFUSED until blocking evidence is closed ${citedList(ids)}.`,
      claimIds: ids,
      evidenceIds: [],
    });
  } else {
    const driverIds = input.valuation.drivers;
    sections.push({
      heading: "Valuation",
      text: `Valuation range is generated only from supported claim drivers ${citedList(driverIds)}.`,
      claimIds: driverIds,
      evidenceIds: input.claims
        .filter((claim) => driverIds.includes(claim.id))
        .flatMap((claim) => claim.evidenceRefs),
    });
  }

  const unknownIds = unknownClaims.map((claim) => claim.id);
  sections.push({
    heading: "Unknowns & How to Close Them",
    text:
      unknownIds.length === 0
        ? `No UNKNOWN claims remain after adjudication ${citedList(input.claims.map((claim) => claim.id))}.`
        : unknownClaims
            .map((claim) => {
              const reason = claim.statusReason.replace(/[.!?]+$/u, "");
              return `${claim.type} is ${claim.status} ${citedList([claim.id])}. Closure reason: ${reason} ${citedList([claim.id])}.`;
            })
            .join(" "),
    claimIds:
      unknownIds.length === 0
        ? input.claims.map((claim) => claim.id)
        : unknownIds,
    evidenceIds: unknownClaims.flatMap((claim) => claim.evidenceRefs),
  });

  sections.push({
    heading: "Claim Appendix",
    text: input.claims
      .map(
        (claim) => `${claim.type} is ${claim.status} ${citedList([claim.id])}.`,
      )
      .join(" "),
    claimIds: input.claims.map((claim) => claim.id),
    evidenceIds: input.claims.flatMap((claim) => claim.evidenceRefs),
  });

  return {
    id: input.id,
    dealId: input.dealId,
    runId: input.runId,
    evidenceBand: evidenceBand(input.claims, input.valuation),
    valuation: input.valuation,
    sections,
    counts: countStatuses(input.claims),
    ledger: {
      stream: input.dealId,
      headHash: input.ledgerHeadHash,
    },
    generatedAt: input.generatedAt,
  };
}

export function citationCheck(memo: Memo): CitationCheckResult {
  const errors: string[] = [];
  for (const section of memo.sections) {
    const sentences = section.text
      .split(/(?<=[.!?])\s+/)
      .map((part) => part.trim())
      .filter(Boolean);
    for (const sentence of sentences) {
      if (sentence.startsWith("ASSUMPTION:")) {
        continue;
      }
      const hasClaimRef = section.claimIds.some((claimId) =>
        sentence.includes(`[${claimId}]`),
      );
      if (!hasClaimRef) {
        errors.push(
          `Uncited factual sentence in ${section.heading}: ${sentence}`,
        );
      }
    }
  }
  for (const status of allStatuses) {
    if (!Number.isInteger(memo.counts[status])) {
      errors.push(`Missing count for ${status}.`);
    }
  }
  return { ok: errors.length === 0, errors };
}
