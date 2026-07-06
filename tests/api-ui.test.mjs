import assert from "node:assert/strict";
import test from "node:test";

import { createMvpApplication } from "../dist/apps/api/src/application.js";
import { createHttpServer } from "../dist/apps/api/src/server.js";
import { renderDealPage } from "../dist/apps/ui/src/render.js";

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  return { response, body };
}

test("@ac API exposes required MVP endpoints with refusal as 200 data, not HTTP failure", async () => {
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
        artifact_text:
          "NOI: $312,000\nAnnual Taxes: $5,900\nLien status: seller says clear",
      }),
    });
    assert.equal(created.response.status, 201);
    assert.ok(created.body.id.startsWith("deal_"));

    const runStarted = await request(
      baseUrl,
      `/v1/deals/${created.body.id}/runs`,
      {
        method: "POST",
        body: JSON.stringify({ depth: "standard", budget_credits: 12 }),
      },
    );
    assert.equal(runStarted.response.status, 201);
    assert.equal(runStarted.body.state, "refused");
    assert.equal(runStarted.body.valuation.status, "REFUSED");

    const claims = await request(
      baseUrl,
      `/v1/runs/${runStarted.body.id}/claims?status=UNKNOWN`,
    );
    assert.equal(claims.response.status, 200);
    assert.ok(Array.isArray(claims.body.data));

    const memo = await request(baseUrl, `/v1/memos/${runStarted.body.memo.id}`);
    assert.equal(memo.response.status, 200);
    assert.ok(
      memo.body.sections.some((section) => /Unknowns/i.test(section.heading)),
    );

    const unknowns = await request(
      baseUrl,
      `/v1/deals/${created.body.id}/unknowns`,
    );
    assert.equal(unknowns.response.status, 200);
    assert.ok(unknowns.body.data.every((item) => item.unblock_text));

    const ledger = await request(
      baseUrl,
      `/v1/ledger/export?stream=${created.body.id}`,
    );
    assert.equal(ledger.response.status, 200);
    assert.equal(ledger.body.verify.valid, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("@ac UI renders memo, evidence-band, filters, evidence explorer, and claim drill-down hooks", async () => {
  const app = createMvpApplication({ now: () => "2026-07-06T00:00:00.000Z" });
  const deal = await app.createDeal({
    kind: "real_estate",
    artifactText: "NOI: $312,000\nAnnual Taxes: $5,900\nFlood Zone: AE",
  });
  const run = await app.startVerificationRun(deal.id, {
    depth: "standard",
    budgetCredits: 12,
  });
  const html = renderDealPage(run);

  assert.match(html, /DealPilot MVP/i);
  assert.match(html, /Cannot evaluate|Material contradictions|Substantiated/i);
  assert.match(html, /UNKNOWN/i);
  assert.match(html, /REFUSED/i);
  assert.match(html, /data-filter="UNKNOWN"/);
  assert.match(html, /Evidence Explorer/i);
  assert.match(html, /Claim Drill-down/i);
  assert.doesNotMatch(html, /Pursue|Pass|Buy now|recommend/i);
});
