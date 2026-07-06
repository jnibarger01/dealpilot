export type DealKind = "real_estate" | "smb";
export type ClaimStatus = "VERIFIED" | "CORROBORATED" | "REPORTED" | "CONTRADICTED" | "UNKNOWN";
export type Materiality = "blocking" | "significant" | "contextual";
export type SourceTier = "A" | "B" | "C" | "D";
export type EvidenceMethod = "api" | "licensed" | "user_supplied" | "manual_review";
export type EvidenceSupport = "support" | "conflict" | "context";
export type RunState = "queued" | "extracting" | "collecting" | "adjudicating" | "valuing" | "composing" | "published" | "refused" | "blocked";
export type ValuationStatus = "COMPLETED" | "REFUSED";
export type ClaimType = "financial.list_price" | "financial.noi" | "financial.rent_roll" | "financial.taxes" | "physical.sqft" | "physical.year_built" | "physical.occupancy" | "legal.lien_status" | "legal.zoning" | "legal.permits" | "legal.hoa" | "environmental.flood_zone" | "market.comps_basis";
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | {
    readonly [key: string]: JsonValue;
};
export interface SourceSpan {
    artifactSha256: string;
    charStart: number;
    charEnd: number;
    page: number;
}
export interface Proposition {
    subject: string;
    predicate: string;
    value: string | number | boolean;
    unit: string;
    period: string;
}
export interface Artifact {
    id: string;
    dealId: string;
    sha256: string;
    text: string;
    sourceUrl: string | null;
    createdAt: string;
    version: number;
}
export interface Deal {
    id: string;
    kind: DealKind;
    state: "ready" | "running" | "completed" | "refused" | "blocked";
    sourceUrl: string | null;
    artifacts: Artifact[];
    createdAt: string;
    updatedAt: string;
}
export interface Claim {
    id: string;
    dealId: string;
    type: ClaimType;
    proposition: Proposition;
    sourceSpan: SourceSpan;
    materiality: Materiality;
    status: ClaimStatus;
    statusReason: string;
    evidenceRefs: string[];
    createdAt: string;
    updatedAt: string;
}
export interface EvidenceItem {
    id: string;
    claimId: string;
    artifactSha256: string;
    sourceId: string;
    sourceTier: SourceTier;
    method: EvidenceMethod;
    retrievedAt: string;
    adapterVersion: string;
    observedValue: string | number | boolean;
    unit: string;
    supports: EvidenceSupport;
    provenance: string;
    reviewerValidated?: boolean;
    lineage?: string;
}
export interface ValuationBlocker {
    claimId: string;
    claimType: ClaimType;
    status: ClaimStatus;
    unblockText: string;
}
export interface Valuation {
    status: ValuationStatus;
    currency: "USD";
    rangeMinor: [number, number] | null;
    drivers: string[];
    blockers: ValuationBlocker[];
    assumptions: string[];
}
export interface MemoSection {
    heading: string;
    text: string;
    claimIds: string[];
    evidenceIds: string[];
}
export interface Memo {
    id: string;
    dealId: string;
    runId: string;
    evidenceBand: "Substantiated" | "Substantiated with open items" | "Material contradictions" | "Cannot evaluate";
    valuation: Valuation;
    sections: MemoSection[];
    counts: Record<ClaimStatus, number>;
    ledger: {
        stream: string;
        headHash: string;
    };
    generatedAt: string;
}
export interface CitationCheckResult {
    passed: boolean;
    errors: string[];
}
export interface LedgerEventInput {
    streamId: string;
    type: string;
    payload: JsonValue;
    actor: string;
    occurredAt?: string;
    promptHash?: string;
    evidenceHashes?: string[];
}
export interface LedgerEvent extends LedgerEventInput {
    seq: number;
    prevHash: string;
    hash: string;
    occurredAt: string;
}
export interface LedgerVerifyResult {
    valid: boolean;
    failureSeq: number | null;
    message: string;
    headHash: string | null;
}
export interface VerificationRun {
    id: string;
    dealId: string;
    state: RunState;
    depth: "standard" | "shallow";
    budgetCredits: number;
    claims: Claim[];
    evidence: EvidenceItem[];
    valuation: Valuation;
    memo: Memo;
    citationCheck: CitationCheckResult;
    ledgerVerify: LedgerVerifyResult;
    startedAt: string;
    completedAt: string;
}
