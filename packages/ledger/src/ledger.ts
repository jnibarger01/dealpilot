import { createHash } from "node:crypto";

import type {
  JsonValue,
  LedgerEvent,
  LedgerEventInput,
  LedgerVerifyResult,
} from "../../contracts/src/index.js";

const GENESIS_HASH = "0".repeat(64);

export function sha256Hex(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => normalize(entry));
  }
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
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

export function canonicalJson(value: unknown): string {
  return JSON.stringify(normalize(value));
}

function hashEvent(event: Omit<LedgerEvent, "hash">): string {
  return sha256Hex(canonicalJson(event));
}

export function appendLedgerEvent(
  existing: readonly LedgerEvent[],
  input: LedgerEventInput,
): LedgerEvent[] {
  const previous = existing.at(-1);
  const eventWithoutHash: Omit<LedgerEvent, "hash"> = {
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
  } satisfies Omit<LedgerEvent, "hash">;
  const event: LedgerEvent = { ...withOptional, hash: hashEvent(withOptional) };
  return [...existing, event];
}

export function cloneLedgerEvents(
  events: readonly LedgerEvent[],
): LedgerEvent[] {
  return JSON.parse(JSON.stringify(events)) as LedgerEvent[];
}

export function verifyLedger(
  events: readonly LedgerEvent[],
): LedgerVerifyResult {
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

export function exportJsonl(events: readonly LedgerEvent[]): string {
  return events.map((event) => canonicalJson(event)).join("\n");
}

export function jsonValue(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value)) as JsonValue;
}
