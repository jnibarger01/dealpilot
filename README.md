# DealPilot — Company Documentation Repository

**DealPilot** is an AI-powered underwriting and decision-intelligence platform. It evaluates opportunities rather than finding them: it gathers evidence, verifies claims, quantifies risk, estimates value, exposes uncertainty, and produces transparent, auditable evidence memos.

**Core doctrine:** No claim without evidence. No evidence without provenance. Unknowns are labeled UNKNOWN — never guessed. (See the **Manual Verifier Doctrine**, formalized in `docs/architecture/ai-architecture.md` §2.)

## Repository Map

| Folder | Contents |
|---|---|
| `docs/business/` | Executive summary, business plan, market research, financial model, pricing, sales, marketing, fundraising narrative, top-100 risk register |
| `docs/product/` | PRD, roadmap (30d→5y), personas & JTBD, UX principles |
| `docs/architecture/` | System design (DDD/CQRS/event sourcing), infrastructure & vendor selection, AI architecture & verification pipeline, security program, threat model, observability |
| `docs/engineering/` | Coding standards, TDD plan, CI/CD, testing strategy & quality gates, API/SDK design |
| `docs/legal/` | Privacy policy outline, ToS outline, compliance roadmap (SOC 2, GDPR, CCPA) |
| `docs/investor/` | Pitch deck, due-diligence index & FAQ, cap table, round mechanics |
| `docs/operations/` | Hiring plan, runbooks, incident response |
| `docs/roadmap/` | MVP spec, V1 spec, Enterprise phase spec |

## Canonical Numbers (single source of truth)

All documents reference these; change here first.

| Constant | Value |
|---|---|
| Seed round | $4.0M at $16M post (25%) |
| Series A target | $15M at $60–75M post; trigger ≈ $1.8M ARR |
| Y1–Y5 ARR plan | $0.6M / $2.8M / $9.0M / $22M / $46M |
| Pricing tiers | Analyst $149 · Professional $449 · Team $1,950 · Enterprise from $60K/yr + usage credits |
| Blended gross margin target | 78% at scale (verification COGS is the swing factor) |
| Verification SLO | p95 standard-deal memo < 10 min; API reads p95 < 300 ms |
| Wedge markets | (1) US residential RE investors, (2) SMB acquisition / ETA searchers |

## Reading Order

Investors: `docs/business/executive-summary.md` → `docs/investor/pitch-deck.md` → `docs/business/financial-model.md` → `docs/business/risk-register.md`.
Engineers: `docs/product/prd.md` → `docs/architecture/system-design.md` → `docs/architecture/ai-architecture.md` → `engineering/*`.
Everyone: the Manual Verifier Doctrine section is required reading before writing any code that produces user-visible assertions.

## Status Conventions

Docs carry a header: `Status: Draft | Review | Approved` and `Owner:`. Substantive changes go through PR review; decision-grade changes get an ADR in `architecture/`.
