import { createHash } from "node:crypto";
const GENESIS_HASH = "0".repeat(64);
export function sha256Hex(data) {
    return createHash("sha256").update(data).digest("hex");
}
function normalize(value) {
    if (Array.isArray(value)) {
        return value.map((entry) => normalize(entry));
    }
    if (value !== null && typeof value === "object") {
        const record = value;
        const sorted = {};
        for (const key of Object.keys(record).sort()) {
            const next = record[key];
            if (next !== undefined) {
                sorted[key] = normalize(next);
            }
        }
        return sorted;
    }
    return value;
}
export function canonicalJson(value) {
    return JSON.stringify(normalize(value));
}
function hashEvent(event) {
    return sha256Hex(canonicalJson(event));
}
export function appendLedgerEvent(existing, input) {
    const previous = existing.at(-1);
    const eventWithoutHash = {
        streamId: input.streamId,
        type: input.type,
        payload: jsonValue(input.payload),
        actor: input.actor,
        occurredAt: input.occurredAt ?? new Date().toISOString(),
        seq: existing.length + 1,
        prevHash: previous?.hash ?? GENESIS_HASH,
    };
    const withOptional = {
        ...eventWithoutHash,
        ...(input.promptHash ? { promptHash: input.promptHash } : {}),
        ...(input.evidenceHashes
            ? { evidenceHashes: [...input.evidenceHashes] }
            : {}),
    };
    const event = { ...withOptional, hash: hashEvent(withOptional) };
    return [...existing, event];
}
export function cloneLedgerEvents(events) {
    return JSON.parse(JSON.stringify(events));
}
export function verifyLedger(events) {
    let previousHash = GENESIS_HASH;
    for (const event of events) {
        if (event.seq < 1) {
            return {
                valid: false,
                failureSeq: event.seq,
                message: "Invalid sequence number.",
                headHash: null,
            };
        }
        if (event.prevHash !== previousHash) {
            return {
                valid: false,
                failureSeq: event.seq,
                message: "Previous hash mismatch.",
                headHash: previousHash,
            };
        }
        const { hash: _hash, ...withoutHash } = event;
        const expected = hashEvent(withoutHash);
        if (event.hash !== expected) {
            return {
                valid: false,
                failureSeq: event.seq,
                message: "Event hash mismatch.",
                headHash: previousHash,
            };
        }
        previousHash = event.hash;
    }
    return {
        valid: true,
        failureSeq: null,
        message: "Ledger verified.",
        headHash: events.at(-1)?.hash ?? null,
    };
}
export function exportJsonl(events) {
    return events.map((event) => canonicalJson(event)).join("\n");
}
export function jsonValue(value) {
    return JSON.parse(JSON.stringify(value));
}
//# sourceMappingURL=ledger.js.map