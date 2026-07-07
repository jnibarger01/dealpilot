import type {
  Claim,
  ClaimStatus,
  Deal,
  DealKind,
  EvidenceItem,
  LedgerEvent,
  Memo,
  VerificationRun,
} from "../../../packages/contracts/src/index.js";
import { createDeal as ingestDeal } from "../../../packages/ingestion/src/ingestion.js";
import { extractClaims } from "../../../packages/claims/src/extractor.js";
import {
  createManualEvidence,
  evidenceForClaim,
  type ManualEvidenceInput,
} from "../../../packages/evidence/src/registry.js";
import { adjudicateClaim } from "../../../packages/adjudication/src/adjudicator.js";
import { computeValuation } from "../../../packages/adjudication/src/valuation.js";
import { citationCheck, composeMemo } from "../../../packages/memo/src/memo.js";
import {
  appendLedgerEvent,
  cloneLedgerEvents,
  exportJsonl,
  jsonValue,
  verifyLedger,
} from "../../../packages/ledger/src/ledger.js";

export interface ApplicationOptions {
  now?: () => string;
}

export interface CreateDealRequest {
  kind: DealKind;
  artifactText: string;
  sourceUrl?: string;
}

export interface RunRequest {
  depth: "standard" | "shallow";
  budgetCredits: number;
}

export interface LedgerExport {
  events: LedgerEvent[];
  jsonl: string;
  verify: ReturnType<typeof verifyLedger>;
}

export interface UnknownWorkItem {
  claim_id: string;
  claim_type: string;
  status: string;
  unblock_text: string;
}

export interface ReviewerApprovalInput {
  reviewerId: string;
  note: string;
}

export interface OverrideClaimInput {
  reviewerId: string;
  newStatus: ClaimStatus;
  reason: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  createdAt: string;
}

export interface CreditBalance {
  balance: number;
  currency: "credits";
}

export interface CreditLedgerEntry {
  id: string;
  type: "grant" | "consume";
  amount: number;
  reason: string;
  createdAt: string;
}

interface Store {
  deals: Map<string, Deal>;
  runs: Map<string, VerificationRun>;
  latestRunByDeal: Map<string, string>;
  claims: Map<string, Claim>;
  evidence: Map<string, EvidenceItem>;
  manualEvidenceByClaim: Map<string, EvidenceItem[]>;
  memos: Map<string, Memo>;
  ledgers: Map<string, LedgerEvent[]>;
  webhooks: Map<string, WebhookEndpoint>;
  creditLedger: CreditLedgerEntry[];
}

export interface MvpApplication {
  createDeal(input: CreateDealRequest): Promise<Deal>;
  startVerificationRun(
    dealId: string,
    input: RunRequest,
  ): Promise<VerificationRun>;
  addManualEvidence(
    claimId: string,
    input: ManualEvidenceInput,
  ): Promise<EvidenceItem>;
  exportLedger(streamId: string): LedgerExport;
  getDeal(id: string): Deal | null;
  listDeals(): Deal[];
  getRun(id: string): VerificationRun | null;
  getClaimsForRun(runId: string, status?: string): Claim[];
  getClaim(id: string): Claim | null;
  getEvidence(id: string): EvidenceItem | null;
  getMemo(id: string): Memo | null;
  getUnknowns(dealId: string): UnknownWorkItem[];
  approveMemo(
    memoId: string,
    input: ReviewerApprovalInput,
  ): Promise<LedgerEvent>;
  overrideClaimStatus(
    claimId: string,
    input: OverrideClaimInput,
  ): Promise<LedgerEvent>;
  getCreditBalance(): CreditBalance;
  getCreditLedger(): CreditLedgerEntry[];
  createWebhook(input: { url: string; events: string[] }): WebhookEndpoint;
  listWebhooks(): WebhookEndpoint[];
}

export function createMvpApplication(
  options: ApplicationOptions = {},
): MvpApplication {
  const now = options.now ?? (() => new Date().toISOString());
  const store: Store = {
    deals: new Map(),
    runs: new Map(),
    latestRunByDeal: new Map(),
    claims: new Map(),
    evidence: new Map(),
    manualEvidenceByClaim: new Map(),
    memos: new Map(),
    ledgers: new Map(),
    webhooks: new Map(),
    creditLedger: [
      {
        id: "crd_seed_grant",
        type: "grant",
        amount: 100,
        reason: "MVP seed credits for local verification.",
        createdAt: options.now ? options.now() : new Date().toISOString(),
      },
    ],
  };
  let dealSeq = 0;
  let runSeq = 0;
  let memoSeq = 0;
  let webhookSeq = 0;

  function nextId(prefix: string, seq: number): string {
    return `${prefix}_${String(seq).padStart(6, "0")}`;
  }

  function append(
    streamId: string,
    type: string,
    payload: unknown,
    actor = "system",
    evidenceHashes: string[] = [],
  ): LedgerEvent {
    const existing = store.ledgers.get(streamId) ?? [];
    const next = appendLedgerEvent(existing, {
      streamId,
      type,
      payload: jsonValue(payload),
      actor,
      occurredAt: now(),
      promptHash: "sha256:prompt-stub-explicit-no-live-models",
      evidenceHashes,
    });
    store.ledgers.set(streamId, next);
    const event = next.at(-1);
    if (!event) {
      throw new Error("Ledger append failed.");
    }
    return event;
  }

  function requireDeal(dealId: string): Deal {
    const deal = store.deals.get(dealId);
    if (!deal) throw new Error(`Deal not found: ${dealId}`);
    return deal;
  }

  function buildRun(deal: Deal, input: RunRequest): VerificationRun {
    runSeq += 1;
    memoSeq += 1;
    const startedAt = now();
    const runId = nextId("run", runSeq);
    const memoId = nextId("memo", memoSeq);
    const artifact = deal.artifacts[deal.artifacts.length - 1];
    if (!artifact) throw new Error(`Deal ${deal.id} has no artifact.`);

    append(deal.id, "VerificationRunStarted", {
      runId,
      depth: input.depth,
      budgetCredits: input.budgetCredits,
    });
    append(deal.id, "TextExtracted", { artifactSha256: artifact.sha256 });

    const bornClaims = extractClaims(deal.id, artifact, startedAt);
    for (const claim of bornClaims) {
      append(deal.id, "ClaimExtracted", {
        claimId: claim.id,
        type: claim.type,
        sourceSpan: claim.sourceSpan,
      });
    }

    const admittedEvidence: EvidenceItem[] = [];
    const adjudicatedClaims: Claim[] = [];
    for (const claim of bornClaims) {
      const manual = store.manualEvidenceByClaim.get(claim.id) ?? [];
      const collected = evidenceForClaim(claim, manual);
      if (collected.length === 0) {
        append(deal.id, "EvidenceCollectionFailed", {
          claimId: claim.id,
          reason:
            "No live adapter configured in MVP stub; fail-closed path used.",
        });
      } else {
        for (const evidence of collected) {
          admittedEvidence.push(evidence);
          store.evidence.set(evidence.id, evidence);
          append(
            deal.id,
            "EvidenceCollected",
            {
              evidenceId: evidence.id,
              claimId: claim.id,
              sourceTier: evidence.sourceTier,
            },
            "system",
            [evidence.artifactSha256],
          );
        }
      }
      const adjudicated = adjudicateClaim(
        claim,
        collected,
        "rubric-mvp.1",
        now(),
      );
      adjudicatedClaims.push(adjudicated);
      store.claims.set(adjudicated.id, adjudicated);
      append(deal.id, "ClaimAdjudicated", {
        claimId: adjudicated.id,
        status: adjudicated.status,
        evidenceRefs: adjudicated.evidenceRefs,
        rubricVersion: "rubric-mvp.1",
        rationale: adjudicated.statusReason,
      });
    }

    const valuation = computeValuation(adjudicatedClaims);
    append(
      deal.id,
      valuation.status === "REFUSED" ? "ValuationRefused" : "ValuationComputed",
      valuation,
    );

    const beforeMemoHead = store.ledgers.get(deal.id)?.at(-1)?.hash ?? null;
    const memo = composeMemo({
      id: memoId,
      dealId: deal.id,
      runId,
      claims: adjudicatedClaims,
      valuation,
      ledgerHeadHash: beforeMemoHead ?? "",
      generatedAt: now(),
    });
    const check = citationCheck(memo);
    append(deal.id, "MemoComposed", {
      memoId,
      sectionCount: memo.sections.length,
    });
    append(
      deal.id,
      check.ok ? "CitationCheckSatisfied" : "CitationCheckFailed",
      { memoId, errors: check.errors },
    );
    if (check.ok) {
      append(deal.id, "MemoPublished", { memoId });
    }
    const verify = verifyLedger(store.ledgers.get(deal.id) ?? []);
    const finalMemo: Memo = {
      ...memo,
      ledger: { ...memo.ledger, headHash: verify.headHash ?? "" },
    };
    store.memos.set(finalMemo.id, finalMemo);

    const state = check.ok
      ? valuation.status === "REFUSED"
        ? "refused"
        : "published"
      : "blocked";
    const run: VerificationRun = {
      id: runId,
      dealId: deal.id,
      state,
      depth: input.depth,
      budgetCredits: input.budgetCredits,
      claims: adjudicatedClaims,
      evidence: admittedEvidence,
      valuation,
      memo: finalMemo,
      citationCheck: check,
      ledgerVerify: verify,
      startedAt,
      completedAt: now(),
    };
    store.runs.set(run.id, run);
    store.latestRunByDeal.set(deal.id, run.id);
    store.deals.set(deal.id, {
      ...deal,
      state: state === "published" ? "completed" : state,
      updatedAt: now(),
    });
    return run;
  }

  return {
    async createDeal(input: CreateDealRequest): Promise<Deal> {
      dealSeq += 1;
      const id = nextId("deal", dealSeq);
      const deal = ingestDeal({
        id,
        kind: input.kind,
        artifactText: input.artifactText,
        sourceUrl: input.sourceUrl ?? null,
        now: now(),
      });
      store.deals.set(deal.id, deal);
      append(deal.id, "DealIngested", {
        dealId: deal.id,
        kind: deal.kind,
        sourceUrl: deal.sourceUrl,
      });
      append(deal.id, "ArtifactStored", {
        artifactId: deal.artifacts[0]?.id ?? "missing",
        sha256: deal.artifacts[0]?.sha256 ?? "missing",
      });
      return deal;
    },
    async startVerificationRun(
      dealId: string,
      input: RunRequest,
    ): Promise<VerificationRun> {
      return buildRun(requireDeal(dealId), input);
    },
    async addManualEvidence(
      claimId: string,
      input: ManualEvidenceInput,
    ): Promise<EvidenceItem> {
      const claim = store.claims.get(claimId);
      if (!claim) throw new Error(`Claim not found: ${claimId}`);
      const evidence = createManualEvidence(claim, input, now());
      const existing = store.manualEvidenceByClaim.get(claimId) ?? [];
      store.manualEvidenceByClaim.set(claimId, [...existing, evidence]);
      store.evidence.set(evidence.id, evidence);
      append(
        claim.dealId,
        "ManualEvidenceUploaded",
        {
          claimId,
          evidenceId: evidence.id,
          reviewerValidated: input.reviewerValidated,
        },
        "user",
        [evidence.artifactSha256],
      );
      if (input.reviewerValidated) {
        append(
          claim.dealId,
          "ReviewerActionRecorded",
          {
            claimId,
            evidenceId: evidence.id,
            action: "manual_evidence_validated",
          },
          "reviewer",
          [evidence.artifactSha256],
        );
      }
      return evidence;
    },
    exportLedger(streamId: string): LedgerExport {
      const events = cloneLedgerEvents(store.ledgers.get(streamId) ?? []);
      return {
        events,
        jsonl: exportJsonl(events),
        verify: verifyLedger(events),
      };
    },
    getDeal(id: string): Deal | null {
      return store.deals.get(id) ?? null;
    },
    listDeals(): Deal[] {
      return [...store.deals.values()];
    },
    getRun(id: string): VerificationRun | null {
      return store.runs.get(id) ?? null;
    },
    getClaimsForRun(runId: string, status?: string): Claim[] {
      const run = store.runs.get(runId);
      if (!run) return [];
      return status
        ? run.claims.filter((claim) => claim.status === status)
        : run.claims;
    },
    getClaim(id: string): Claim | null {
      return store.claims.get(id) ?? null;
    },
    getEvidence(id: string): EvidenceItem | null {
      return store.evidence.get(id) ?? null;
    },
    getMemo(id: string): Memo | null {
      return store.memos.get(id) ?? null;
    },
    getUnknowns(dealId: string): UnknownWorkItem[] {
      const runId = store.latestRunByDeal.get(dealId);
      const run = runId ? store.runs.get(runId) : null;
      if (!run) return [];
      return run.valuation.blockers.map((blocker) => ({
        claim_id: blocker.claimId,
        claim_type: blocker.claimType,
        status: blocker.status,
        unblock_text: blocker.unblockText,
      }));
    },
    async approveMemo(
      memoId: string,
      input: ReviewerApprovalInput,
    ): Promise<LedgerEvent> {
      const memo = store.memos.get(memoId);
      if (!memo) throw new Error(`Memo not found: ${memoId}`);
      return append(
        memo.dealId,
        "MemoApproved",
        { memoId, reviewerId: input.reviewerId, note: input.note },
        input.reviewerId,
      );
    },
    async overrideClaimStatus(
      claimId: string,
      input: OverrideClaimInput,
    ): Promise<LedgerEvent> {
      const claim = store.claims.get(claimId);
      if (!claim) throw new Error(`Claim not found: ${claimId}`);
      const event = append(
        claim.dealId,
        "ClaimStatusOverrideAppended",
        {
          claimId,
          previousStatus: claim.status,
          newStatus: input.newStatus,
          reason: input.reason,
        },
        input.reviewerId,
        claim.evidenceRefs,
      );
      store.claims.set(claimId, {
        ...claim,
        status: input.newStatus,
        statusReason: `Reviewer override appended: ${input.reason}`,
        updatedAt: now(),
      });
      return event;
    },
    getCreditBalance(): CreditBalance {
      const balance = store.creditLedger.reduce(
        (sum, entry) =>
          sum + (entry.type === "grant" ? entry.amount : -entry.amount),
        0,
      );
      return { balance, currency: "credits" };
    },
    getCreditLedger(): CreditLedgerEntry[] {
      return [...store.creditLedger];
    },
    createWebhook(input: { url: string; events: string[] }): WebhookEndpoint {
      webhookSeq += 1;
      const endpoint = {
        id: nextId("whk", webhookSeq),
        url: input.url,
        events: [...input.events],
        createdAt: now(),
      };
      store.webhooks.set(endpoint.id, endpoint);
      return endpoint;
    },
    listWebhooks(): WebhookEndpoint[] {
      return [...store.webhooks.values()];
    },
  };
}
