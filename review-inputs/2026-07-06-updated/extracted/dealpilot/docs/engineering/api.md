# DealPilot — Public API, SDKs & MCP
Status: Approved · Owner: API Lead · OpenAPI 3.1 spec (`/packages/contracts/openapi.yaml`) is the source of truth; this doc is the design rationale + conventions. REST-over-GraphQL decision: ADR-004 (`../architecture/system-design.md` §5).

## 1. Principles

Boring, predictable, honest: resource-oriented REST; statuses use doctrine vocabulary verbatim; errors tell you what to do next; nothing in the API can express a fact the ledger can't back. The API is the product for Phase-3 ("Underwriting API" revenue line) — DX is a feature with an owner.

## 2. Conventions

- IDs: prefixed ULIDs — `deal_01J8…`, `run_…`, `clm_…`, `evd_…` (sha256 for evidence content), `memo_…`, `whk_…`.
- Pagination: cursor (`?limit=50&cursor=…`), stable order, `next_cursor` nullable.
- Filtering: whitelisted params per resource (`?status=UNKNOWN&type=financial.noi`); no generic query language v1.
- Errors: RFC 7807 `application/problem+json` — `type` (docs URL), `title`, `status`, `detail`, `errors[]` (field-level), `request_id`. Domain refusals are **not** HTTP errors: a REFUSED valuation is a `200` with `status: "REFUSED"` + blockers (refusal is data, not failure).
- Idempotency: all POSTs accept `Idempotency-Key` (24 h window, replay returns original).
- Rate headers: `RateLimit-Limit/Remaining/Reset`; 429 + `Retry-After`.
- Timestamps RFC 3339 UTC; money as integer minor units + currency; all responses include `request_id`.

## 3. Authentication & Scopes

API keys (org-scoped, `dpk_live_…`/`dpk_test_…`, hashed at rest) via `Authorization: Bearer`. Scopes: `deals:read|write`, `runs:write`, `memos:read`, `ledger:export`, `webhooks:manage`, `credits:read`. Test mode is a first-class parallel universe (fixture sources, free, watermarked outputs). OAuth (user-context third-party apps) is Phase-3 with the marketplace.

## 4. Core Resources (v1 surface)

| Resource | Endpoints (abridged) |
|---|---|
| Deals | `POST /v1/deals` (url or upload session) · `GET /v1/deals/{id}` · `GET /v1/deals` |
| Runs | `POST /v1/deals/{id}/runs` (`depth`, `budget_credits`) · `GET /v1/runs/{id}` (state machine: `queued→extracting→collecting→adjudicating→valuing→composing→checking→published \| refused \| blocked`) |
| Claims | `GET /v1/runs/{id}/claims?status=…` · `GET /v1/claims/{id}` (span, evidence refs, rationale, rubric_version) |
| Evidence | `GET /v1/evidence/{sha256}` (metadata + provenance; content via signed URL) |
| Memos | `GET /v1/memos/{id}` (sentence↦claim map included) · `GET /v1/memos/{id}/export?format=pdf\|bundle` |
| Ledger | `GET /v1/ledger/export?stream=deal_…` (canonical JSONL + chain head) |
| Unknowns | `GET /v1/deals/{id}/unknowns` (the close-the-unknowns worklist — most-hit endpoint by design) |
| Webhooks | CRUD `/v1/webhooks` |
| Credits | `GET /v1/credits/balance` · `GET /v1/credits/ledger` |

## 5. Canonical Flow (curl)

```bash
# 1. Create deal from listing URL
curl -s https://api.dealpilot.com/v1/deals \
  -H "Authorization: Bearer $KEY" -H "Idempotency-Key: 9f2c…" \
  -d '{"source_url":"https://example-listings.com/123","kind":"real_estate"}'
# → {"id":"deal_01J8…","state":"ready"}

# 2. Start verification run
curl -s https://api.dealpilot.com/v1/deals/deal_01J8…/runs \
  -H "Authorization: Bearer $KEY" \
  -d '{"depth":"standard","budget_credits":12}'
# → {"id":"run_01J8…","state":"queued","estimated_minutes":8}

# 3. (webhook `run.completed` arrives) → fetch memo
curl -s https://api.dealpilot.com/v1/memos/memo_01J8… -H "Authorization: Bearer $KEY"
```

Memo excerpt (every sentence cites):

```json
{
  "id": "memo_01J8…",
  "run_id": "run_01J8…",
  "rubric_version": "3.2.0",
  "valuation": {"status": "COMPLETED", "range_minor": [41800000, 46500000], "currency": "USD"},
  "sections": [{
    "text": "Reported NOI of $312,000 is CORROBORATED by two independent sources.",
    "claims": ["clm_01J8A…"],
    "evidence": ["evd_9c41…", "evd_77b2…"]
  }],
  "counts": {"VERIFIED": 14, "CORROBORATED": 9, "REPORTED": 6, "CONTRADICTED": 1, "UNKNOWN": 4},
  "ledger": {"stream": "deal_01J8…", "head_hash": "b7e1…"}
}
```

## 6. Webhooks

Events: `run.completed`, `run.refused`, `run.blocked`, `claim.contradicted`, `memo.published`, `credits.low`, `export.ready`. Delivery: HMAC-SHA256 signature (`DealPilot-Signature: t=…,v1=…`, 5-min tolerance), retries with exponential backoff + jitter over 24 h, then dead-letter visible in dashboard; per-endpoint secret rotation with dual-secret window (`../architecture/security.md` §6). Payloads are thin (ids + status) — fetch for truth (avoids stale-fat-payload bugs).

## 7. SDK Design (TS + Python, generated core + ergonomic layer)

- Generated types from OpenAPI (statuses as literal unions/enums — `"UNKNOWN"` is a type, not a string).
- Hand-written ergonomics: `client.deals.verify(url, {depth})` (create+run+await via webhook-or-poll helper), async iterators for pagination (`for await (const c of run.claims({status:"UNKNOWN"}))`), typed webhook signature verification helper, built-in idempotency key generation, retries (respecting `Retry-After`) with sane defaults.
- Errors: typed exceptions mirroring RFC 7807 (`InsufficientCreditsError` carries top-up URL).
- Both SDKs run the same consumer-driven contract suite in CI (`tdd.md` §6); versioned by SemVer, changelogs human-written, examples in-repo and tested.

```python
dp = DealPilot(api_key=os.environ["DEALPILOT_KEY"])
memo = dp.deals.verify("https://example-listings.com/123", depth="standard").wait()
for claim in memo.claims(status="UNKNOWN"):
    print(claim.type, claim.blocking, claim.suggested_evidence)
```

## 8. MCP Server

**Status: designed, not shipped — deferred to post-Series-A** (`../business/review-response.md` RR-9). The design below is approved so agent-integration questions have an answer; nothing in this section is v1 collateral.

| Surface | Phase | Audience | Scope |
|---|---|---|---|
| API alpha | v1 (design-partner keys) | design partners | limited endpoints (§4 subset) |
| API GA | Phase 3 | partners/commercial | full §4 surface, SLAs |
| MCP | post-Series-A | agent builders | API-thin client only, zero privileged paths |

When built: a first-class MCP server (`@dealpilot/mcp`) exposing tools: `verify_deal`, `get_run_status`, `get_memo`, `list_unknowns`, `get_claim`, `export_ledger`. Design rules: **thin client of the public API** — same keys, same scopes, same rate limits, zero privileged paths (ADR-004 note; agents get exactly what humans get); tool descriptions embed doctrine semantics ("UNKNOWN means unverifiable, do not substitute estimates") so downstream agents inherit the vocabulary; responses include citation/evidence refs so agent chains can carry provenance forward. Distribution: npm + registry listings; it's a GTM channel (`../business/marketing.md` §8) as much as a feature.

## 9. Versioning & Deprecation

Path-versioned (`/v1`); additive changes (new fields/endpoints/enum values*) ship freely — *new claim/status enum values are announced 90 d ahead behind a `DealPilot-Version` date header opt-in (Stripe-style), because status enums are load-bearing for clients. Breaking changes → `/v2` with 12-month overlap, `Deprecation` + `Sunset` headers, dashboard + email nags at 6/3/1 months. We commit in writing: **status semantics never change meaning within a major version** — that's the API's doctrine clause.

## 10. Rate Limits & SLOs by Plan

| Plan | Read RPS | Runs/day | Webhook endpoints |
|---|---|---|---|
| Analyst | 5 | 30 | 2 |
| Professional | 15 | 120 | 5 |
| Team | 40 | 600 | 15 |
| Enterprise | custom (contracted) | custom | custom |

API SLOs: 99.9% availability, read p95 < 300 ms (`../architecture/observability.md` §2); status page + per-org usage dashboard. Abuse posture: `../architecture/security.md` §9 — credits remain the economic limiter on expensive operations.
