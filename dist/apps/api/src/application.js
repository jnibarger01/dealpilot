import { createDeal as ingestDeal } from "../../../packages/ingestion/src/ingestion.js";
import { extractClaims } from "../../../packages/claims/src/extractor.js";
import { createManualEvidence, evidenceForClaim, } from "../../../packages/evidence/src/registry.js";
import { adjudicateClaim } from "../../../packages/adjudication/src/adjudicator.js";
import { computeValuation } from "../../../packages/adjudication/src/valuation.js";
import { citationCheck, composeMemo } from "../../../packages/memo/src/memo.js";
import { appendLedgerEvent, exportJsonl, jsonValue, verifyLedger, } from "../../../packages/ledger/src/ledger.js";
export function createMvpApplication(options = {}) {
    const now = options.now ?? (() => new Date().toISOString());
    const store = {
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
    function nextId(prefix, seq) {
        return `${prefix}_${String(seq).padStart(6, "0")}`;
    }
    function append(streamId, type, payload, actor = "system", evidenceHashes = []) {
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
    function requireDeal(dealId) {
        const deal = store.deals.get(dealId);
        if (!deal)
            throw new Error(`Deal not found: ${dealId}`);
        return deal;
    }
    function buildRun(deal, input) {
        runSeq += 1;
        memoSeq += 1;
        const startedAt = now();
        const runId = nextId("run", runSeq);
        const memoId = nextId("memo", memoSeq);
        const artifact = deal.artifacts[deal.artifacts.length - 1];
        if (!artifact)
            throw new Error(`Deal ${deal.id} has no artifact.`);
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
        const admittedEvidence = [];
        const adjudicatedClaims = [];
        for (const claim of bornClaims) {
            const manual = store.manualEvidenceByClaim.get(claim.id) ?? [];
            const collected = evidenceForClaim(claim, manual);
            if (collected.length === 0) {
                append(deal.id, "EvidenceCollectionFailed", {
                    claimId: claim.id,
                    reason: "No live adapter configured in MVP stub; fail-closed path used.",
                });
            }
            else {
                for (const evidence of collected) {
                    admittedEvidence.push(evidence);
                    store.evidence.set(evidence.id, evidence);
                    append(deal.id, "EvidenceCollected", {
                        evidenceId: evidence.id,
                        claimId: claim.id,
                        sourceTier: evidence.sourceTier,
                    }, "system", [evidence.artifactSha256]);
                }
            }
            const adjudicated = adjudicateClaim(claim, collected, "rubric-mvp.1", now());
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
        append(deal.id, valuation.status === "REFUSED" ? "ValuationRefused" : "ValuationComputed", valuation);
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
        append(deal.id, check.passed ? "CitationCheckPassed" : "CitationCheckFailed", { memoId, errors: check.errors });
        if (check.passed) {
            append(deal.id, "MemoPublished", { memoId });
        }
        const verify = verifyLedger(store.ledgers.get(deal.id) ?? []);
        const finalMemo = {
            ...memo,
            ledger: { ...memo.ledger, headHash: verify.headHash ?? "" },
        };
        store.memos.set(finalMemo.id, finalMemo);
        const state = check.passed
            ? valuation.status === "REFUSED"
                ? "refused"
                : "published"
            : "blocked";
        const run = {
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
        async createDeal(input) {
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
        async startVerificationRun(dealId, input) {
            return buildRun(requireDeal(dealId), input);
        },
        async addManualEvidence(claimId, input) {
            const claim = store.claims.get(claimId);
            if (!claim)
                throw new Error(`Claim not found: ${claimId}`);
            const evidence = createManualEvidence(claim, input, now());
            const existing = store.manualEvidenceByClaim.get(claimId) ?? [];
            store.manualEvidenceByClaim.set(claimId, [...existing, evidence]);
            store.evidence.set(evidence.id, evidence);
            append(claim.dealId, "ManualEvidenceUploaded", {
                claimId,
                evidenceId: evidence.id,
                reviewerValidated: input.reviewerValidated,
            }, "user", [evidence.artifactSha256]);
            if (input.reviewerValidated) {
                append(claim.dealId, "ReviewerActionRecorded", {
                    claimId,
                    evidenceId: evidence.id,
                    action: "manual_evidence_validated",
                }, "reviewer", [evidence.artifactSha256]);
            }
            return evidence;
        },
        exportLedger(streamId) {
            const events = store.ledgers.get(streamId) ?? [];
            return {
                events,
                jsonl: exportJsonl(events),
                verify: verifyLedger(events),
            };
        },
        getDeal(id) {
            return store.deals.get(id) ?? null;
        },
        listDeals() {
            return [...store.deals.values()];
        },
        getRun(id) {
            return store.runs.get(id) ?? null;
        },
        getClaimsForRun(runId, status) {
            const run = store.runs.get(runId);
            if (!run)
                return [];
            return status
                ? run.claims.filter((claim) => claim.status === status)
                : run.claims;
        },
        getClaim(id) {
            return store.claims.get(id) ?? null;
        },
        getEvidence(id) {
            return store.evidence.get(id) ?? null;
        },
        getMemo(id) {
            return store.memos.get(id) ?? null;
        },
        getUnknowns(dealId) {
            const runId = store.latestRunByDeal.get(dealId);
            const run = runId ? store.runs.get(runId) : null;
            if (!run)
                return [];
            return run.valuation.blockers.map((blocker) => ({
                claim_id: blocker.claimId,
                claim_type: blocker.claimType,
                status: blocker.status,
                unblock_text: blocker.unblockText,
            }));
        },
        async approveMemo(memoId, input) {
            const memo = store.memos.get(memoId);
            if (!memo)
                throw new Error(`Memo not found: ${memoId}`);
            return append(memo.dealId, "MemoApproved", { memoId, reviewerId: input.reviewerId, note: input.note }, input.reviewerId);
        },
        async overrideClaimStatus(claimId, input) {
            const claim = store.claims.get(claimId);
            if (!claim)
                throw new Error(`Claim not found: ${claimId}`);
            const event = append(claim.dealId, "ClaimStatusOverrideAppended", {
                claimId,
                previousStatus: claim.status,
                newStatus: input.newStatus,
                reason: input.reason,
            }, input.reviewerId, claim.evidenceRefs);
            store.claims.set(claimId, {
                ...claim,
                status: input.newStatus,
                statusReason: `Reviewer override appended: ${input.reason}`,
                updatedAt: now(),
            });
            return event;
        },
        getCreditBalance() {
            const balance = store.creditLedger.reduce((sum, entry) => sum + (entry.type === "grant" ? entry.amount : -entry.amount), 0);
            return { balance, currency: "credits" };
        },
        getCreditLedger() {
            return [...store.creditLedger];
        },
        createWebhook(input) {
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
        listWebhooks() {
            return [...store.webhooks.values()];
        },
    };
}
//# sourceMappingURL=application.js.map