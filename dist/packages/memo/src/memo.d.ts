import type { Claim, CitationCheckResult, Memo, Valuation } from "../../contracts/src/index.js";
interface ComposeMemoInput {
    id: string;
    dealId: string;
    runId: string;
    claims: readonly Claim[];
    valuation: Valuation;
    ledgerHeadHash: string;
    generatedAt: string;
}
export declare function composeMemo(input: ComposeMemoInput): Memo;
export declare function citationCheck(memo: Memo): CitationCheckResult;
export {};
