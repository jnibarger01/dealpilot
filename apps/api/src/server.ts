import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";

import type { ClaimStatus } from "../../../packages/contracts/src/index.js";
import type { MvpApplication } from "./application.js";
import { renderDealPage } from "../../ui/src/render.js";

function concatChunks(chunks: readonly Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return merged;
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const text = new TextDecoder().decode(concatChunks(chunks));
  return text ? JSON.parse(text) : {};
}

function send(response: ServerResponse, status: number, body: unknown): void {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

function sendHtml(
  response: ServerResponse,
  status: number,
  html: string,
): void {
  response.statusCode = status;
  response.setHeader("content-type", "text/html; charset=utf-8");
  response.end(html);
}

function problem(
  response: ServerResponse,
  status: number,
  detail: string,
): void {
  send(response, status, {
    type: "https://docs.dealpilot.local/problems/mvp",
    title: status === 404 ? "Not found" : "Request failed",
    status,
    detail,
    request_id: `req_${Date.now()}`,
  });
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function createHttpServer(app: MvpApplication): Server {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", "http://127.0.0.1");
      const method = request.method ?? "GET";
      const parts = url.pathname.split("/").filter(Boolean);

      if (method === "GET" && url.pathname === "/") {
        sendHtml(
          response,
          200,
          "<!doctype html><title>DealPilot MVP</title><h1>DealPilot MVP</h1><p>Evidence first. Unknowns are explicit.</p>",
        );
        return;
      }

      if (method === "POST" && url.pathname === "/v1/deals") {
        const body = asRecord(await readJson(request));
        const artifactText = String(
          body.artifact_text ?? body.artifactText ?? "",
        );
        const sourceUrl =
          typeof body.source_url === "string" ? body.source_url : undefined;
        const deal = await app.createDeal(
          sourceUrl
            ? { kind: "real_estate", artifactText, sourceUrl }
            : { kind: "real_estate", artifactText },
        );
        send(response, 201, deal);
        return;
      }

      if (method === "GET" && url.pathname === "/v1/deals") {
        send(response, 200, { data: app.listDeals() });
        return;
      }

      if (
        method === "GET" &&
        parts[0] === "v1" &&
        parts[1] === "deals" &&
        parts.length === 3
      ) {
        const deal = app.getDeal(parts[2] ?? "");
        if (!deal) return problem(response, 404, "Deal not found.");
        send(response, 200, deal);
        return;
      }

      if (
        method === "POST" &&
        parts[0] === "v1" &&
        parts[1] === "deals" &&
        parts[3] === "runs"
      ) {
        const body = asRecord(await readJson(request));
        const run = await app.startVerificationRun(parts[2] ?? "", {
          depth: body.depth === "shallow" ? "shallow" : "standard",
          budgetCredits:
            typeof body.budget_credits === "number" ? body.budget_credits : 12,
        });
        send(response, 201, run);
        return;
      }

      if (
        method === "GET" &&
        parts[0] === "v1" &&
        parts[1] === "runs" &&
        parts.length === 3
      ) {
        const run = app.getRun(parts[2] ?? "");
        if (!run) return problem(response, 404, "Run not found.");
        send(response, 200, run);
        return;
      }

      if (
        method === "GET" &&
        parts[0] === "v1" &&
        parts[1] === "runs" &&
        parts[3] === "claims"
      ) {
        send(response, 200, {
          data: app.getClaimsForRun(
            parts[2] ?? "",
            url.searchParams.get("status") ?? undefined,
          ),
        });
        return;
      }

      if (
        method === "GET" &&
        parts[0] === "v1" &&
        parts[1] === "claims" &&
        parts.length === 3
      ) {
        const claim = app.getClaim(parts[2] ?? "");
        if (!claim) return problem(response, 404, "Claim not found.");
        send(response, 200, claim);
        return;
      }

      if (
        method === "POST" &&
        parts[0] === "v1" &&
        parts[1] === "claims" &&
        parts[3] === "evidence"
      ) {
        const body = asRecord(await readJson(request));
        const evidence = await app.addManualEvidence(parts[2] ?? "", {
          sourceId: String(body.source_id ?? body.sourceId ?? "manual.upload"),
          observedValue:
            typeof body.observed_value === "number" ||
            typeof body.observed_value === "boolean"
              ? body.observed_value
              : String(body.observed_value ?? ""),
          unit: String(body.unit ?? "TEXT"),
          provenance: String(body.provenance ?? "manual upload"),
          reviewerValidated: body.reviewer_validated === true,
        });
        send(response, 201, evidence);
        return;
      }

      if (
        method === "POST" &&
        parts[0] === "v1" &&
        parts[1] === "claims" &&
        parts[3] === "override"
      ) {
        const body = asRecord(await readJson(request));
        const rawStatus = String(
          body.new_status ?? body.newStatus ?? "UNKNOWN",
        );
        const allowed: readonly ClaimStatus[] = [
          "VERIFIED",
          "CORROBORATED",
          "REPORTED",
          "CONTRADICTED",
          "UNKNOWN",
        ];
        const newStatus = allowed.includes(rawStatus as ClaimStatus)
          ? (rawStatus as ClaimStatus)
          : "UNKNOWN";
        const event = await app.overrideClaimStatus(parts[2] ?? "", {
          reviewerId: String(body.reviewer_id ?? body.reviewerId ?? "reviewer"),
          newStatus,
          reason: String(body.reason ?? "No reason supplied."),
        });
        send(response, 201, event);
        return;
      }

      if (
        method === "GET" &&
        parts[0] === "v1" &&
        parts[1] === "evidence" &&
        parts.length === 3
      ) {
        const evidence = app.getEvidence(parts[2] ?? "");
        if (!evidence) return problem(response, 404, "Evidence not found.");
        send(response, 200, evidence);
        return;
      }

      if (
        method === "GET" &&
        parts[0] === "v1" &&
        parts[1] === "memos" &&
        parts.length === 3
      ) {
        const memo = app.getMemo(parts[2] ?? "");
        if (!memo) return problem(response, 404, "Memo not found.");
        send(response, 200, memo);
        return;
      }

      if (
        method === "GET" &&
        parts[0] === "v1" &&
        parts[1] === "memos" &&
        parts[3] === "export"
      ) {
        const memo = app.getMemo(parts[2] ?? "");
        if (!memo) return problem(response, 404, "Memo not found.");
        send(response, 200, {
          format: url.searchParams.get("format") ?? "json",
          memo,
          ledger: app.exportLedger(memo.dealId),
        });
        return;
      }

      if (
        method === "POST" &&
        parts[0] === "v1" &&
        parts[1] === "memos" &&
        parts[3] === "approve"
      ) {
        const body = asRecord(await readJson(request));
        const event = await app.approveMemo(parts[2] ?? "", {
          reviewerId: String(body.reviewer_id ?? body.reviewerId ?? "reviewer"),
          note: String(body.note ?? "approved"),
        });
        send(response, 201, event);
        return;
      }

      if (
        method === "GET" &&
        parts[0] === "v1" &&
        parts[1] === "ledger" &&
        parts[2] === "export"
      ) {
        send(
          response,
          200,
          app.exportLedger(url.searchParams.get("stream") ?? ""),
        );
        return;
      }

      if (
        method === "GET" &&
        parts[0] === "v1" &&
        parts[1] === "deals" &&
        parts[3] === "unknowns"
      ) {
        send(response, 200, { data: app.getUnknowns(parts[2] ?? "") });
        return;
      }

      if (method === "GET" && url.pathname === "/v1/credits/balance") {
        send(response, 200, app.getCreditBalance());
        return;
      }

      if (method === "GET" && url.pathname === "/v1/credits/ledger") {
        send(response, 200, { data: app.getCreditLedger() });
        return;
      }

      if (method === "GET" && url.pathname === "/v1/webhooks") {
        send(response, 200, { data: app.listWebhooks() });
        return;
      }

      if (method === "POST" && url.pathname === "/v1/webhooks") {
        const body = asRecord(await readJson(request));
        const eventsRaw = Array.isArray(body.events) ? body.events : [];
        const events = eventsRaw.map((event) => String(event));
        const endpoint = app.createWebhook({
          url: String(body.url ?? ""),
          events,
        });
        send(response, 201, endpoint);
        return;
      }

      problem(response, 404, "Route not found.");
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Unknown server error.";
      problem(response, 400, detail);
    }
  });
}
