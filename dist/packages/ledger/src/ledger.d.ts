import type { JsonValue, LedgerEvent, LedgerEventInput, LedgerVerifyResult } from "../../contracts/src/index.js";
export declare function sha256Hex(data: string): string;
export declare function canonicalJson(value: unknown): string;
export declare function appendLedgerEvent(existing: readonly LedgerEvent[], input: LedgerEventInput): LedgerEvent[];
export declare function verifyLedger(events: readonly LedgerEvent[]): LedgerVerifyResult;
export declare function exportJsonl(events: readonly LedgerEvent[]): string;
export declare function jsonValue(value: unknown): JsonValue;
