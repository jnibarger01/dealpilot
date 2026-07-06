import assert from "node:assert/strict";
import test from "node:test";

import { createMvpApplication } from "../dist/apps/api/src/application.js";
import { createHttpServer } from "../dist/apps/api/src/server.js";

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("json") && text ? JSON.parse(text) : text;
  return { response, body };
}

test("@ac API required MVP/resource endpoints exist for credits, webhooks, memo export, reviewer approval, and overrides", async () => {
  const app = createMvpApplication({ now: () => "2026-07-06T00:00:00.000Z" });
  const server = createHttpServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const created = await request(baseUrl, "/v1/deals", {
      method: "POST",
      body: JSON.stringify({
        kind: "real_estate",
        artifact_text: "NOI: $312,000\nAnnual Taxes: $5,900\nFlood Zone: AE",
      }),
    });
    const runStarted = await request(
      baseUrl,
      `/v1/deals/${created.body.id}/runs`,
      {
        method: "POST",
        body: JSON.stringify({ depth: "standard", budget_credits: 12 }),
      },
    );
    const firstClaim = runStarted.body.claims[0];

    const creditBalance = await request(baseUrl, "/v1/credits/balance");
    assert.equal(creditBalance.response.status, 200);
    assert.equal(creditBalance.body.currency, "credits");

    const creditLedger = await request(baseUrl, "/v1/credits/ledger");
    assert.equal(creditLedger.response.status, 200);
    assert.ok(Array.isArray(creditLedger.body.data));

    const webhook = await request(baseUrl, "/v1/webhooks", {
      method: "POST",
      body: JSON.stringify({
        url: "https://example.invalid/hook",
        events: ["run.refused"],
      }),
    });
    assert.equal(webhook.response.status, 201);
    const webhooks = await request(baseUrl, "/v1/webhooks");
    assert.equal(webhooks.response.status, 200);
    assert.equal(webhooks.body.data.length, 1);

    const exportedMemo = await request(
      baseUrl,
      `/v1/memos/${runStarted.body.memo.id}/export?format=bundle`,
    );
    assert.equal(exportedMemo.response.status, 200);
    assert.equal(exportedMemo.body.format, "bundle");
    assert.ok(exportedMemo.body.ledger.verify.valid);

    const approval = await request(
      baseUrl,
      `/v1/memos/${runStarted.body.memo.id}/approve`,
      {
        method: "POST",
        body: JSON.stringify({
          reviewer_id: "rev_api",
          note: "Reviewed refusal memo.",
        }),
      },
    );
    assert.equal(approval.response.status, 201);

    const override = await request(
      baseUrl,
      `/v1/claims/${firstClaim.id}/override`,
      {
        method: "POST",
        body: JSON.stringify({
          reviewer_id: "rev_api",
          new_status: "UNKNOWN",
          reason: "Keep fail-closed for API test.",
        }),
      },
    );
    assert.equal(override.response.status, 201);
    assert.equal(override.body.type, "ClaimStatusOverrideAppended");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
