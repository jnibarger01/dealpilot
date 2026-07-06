import type { Claim, ClaimStatus, Deal, DealKind, EvidenceItem, LedgerEvent, Memo, VerificationRun } from "../../../packages/contracts/src/index.js";
import { type ManualEvidenceInput } from "../../../packages/evidence/src/registry.js";
import { verifyLedger } from "../../../packages/ledger/src/ledger.js";
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
export interface MvpApplication {
    createDeal(input: CreateDealRequest): Promise<Deal>;
    startVerificationRun(dealId: string, input: RunRequest): Promise<VerificationRun>;
    addManualEvidence(claimId: string, input: ManualEvidenceInput): Promise<EvidenceItem>;
    exportLedger(streamId: string): LedgerExport;
    getDeal(id: string): Deal | null;
    listDeals(): Deal[];
    getRun(id: string): VerificationRun | null;
    getClaimsForRun(runId: string, status?: string): Claim[];
    getClaim(id: string): Claim | null;
    getEvidence(id: string): EvidenceItem | null;
    getMemo(id: string): Memo | null;
    getUnknowns(dealId: string): UnknownWorkItem[];
    approveMemo(memoId: string, input: ReviewerApprovalInput): Promise<LedgerEvent>;
    overrideClaimStatus(claimId: string, input: OverrideClaimInput): Promise<LedgerEvent>;
    getCreditBalance(): CreditBalance;
    getCreditLedger(): CreditLedgerEntry[];
    createWebhook(input: {
        url: string;
        events: string[];
    }): WebhookEndpoint;
    listWebhooks(): WebhookEndpoint[];
}
export declare function createMvpApplication(options?: ApplicationOptions): MvpApplication;
