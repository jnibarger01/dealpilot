import type { ClaimType, Materiality } from "./types.js";

export interface ClaimTypeDefinition {
  type: ClaimType;
  materiality: Materiality;
  unblockText: string;
  unit: string;
  predicate: string;
}

export const CLAIM_DEFINITIONS: readonly ClaimTypeDefinition[] = [
  {
    type: "financial.list_price",
    materiality: "contextual",
    unblockText:
      "Asking price is the seller's term; cross-check listing feeds for consistency.",
    unit: "USD",
    predicate: "list_price",
  },
  {
    type: "financial.noi",
    materiality: "blocking",
    unblockText:
      "Upload trailing-12 financials and leases so income can be checked against deposits.",
    unit: "USD",
    predicate: "annual_noi",
  },
  {
    type: "financial.rent_roll",
    materiality: "blocking",
    unblockText:
      "Upload current leases or estoppels to substantiate the rent roll.",
    unit: "USD_MONTHLY",
    predicate: "monthly_rent_roll",
  },
  {
    type: "financial.taxes",
    materiality: "blocking",
    unblockText:
      "Upload the latest county tax bill or retry the assessor adapter.",
    unit: "USD",
    predicate: "annual_taxes",
  },
  {
    type: "physical.sqft",
    materiality: "significant",
    unblockText: "Upload a measured floor plan or prior appraisal.",
    unit: "SQFT",
    predicate: "square_feet",
  },
  {
    type: "physical.year_built",
    materiality: "contextual",
    unblockText:
      "Upload any document showing construction year, such as an appraisal or permit.",
    unit: "YEAR",
    predicate: "year_built",
  },
  {
    type: "physical.occupancy",
    materiality: "significant",
    unblockText: "Upload leases or estoppels to support occupancy.",
    unit: "PCT",
    predicate: "occupancy",
  },
  {
    type: "legal.lien_status",
    materiality: "blocking",
    unblockText: "Order or upload a title commitment with recording numbers.",
    unit: "TEXT",
    predicate: "lien_status",
  },
  {
    type: "legal.zoning",
    materiality: "significant",
    unblockText: "Request a zoning verification letter from the city.",
    unit: "TEXT",
    predicate: "zoning",
  },
  {
    type: "legal.permits",
    materiality: "significant",
    unblockText: "Upload permit records or authorize a records request.",
    unit: "TEXT",
    predicate: "permit_status",
  },
  {
    type: "legal.hoa",
    materiality: "significant",
    unblockText: "Upload HOA estoppel, dues statement, and CC&Rs.",
    unit: "USD_MONTHLY",
    predicate: "hoa_dues",
  },
  {
    type: "environmental.flood_zone",
    materiality: "blocking",
    unblockText: "Retry FEMA lookup or upload an elevation certificate.",
    unit: "TEXT",
    predicate: "flood_zone",
  },
  {
    type: "market.comps_basis",
    materiality: "significant",
    unblockText: "Add comparable sales to narrow the valuation range.",
    unit: "TEXT",
    predicate: "comps_basis",
  },
] as const;

export function getClaimDefinition(type: ClaimType): ClaimTypeDefinition {
  const found = CLAIM_DEFINITIONS.find(
    (definition) => definition.type === type,
  );
  if (!found) {
    throw new Error(`Unknown claim type: ${type}`);
  }
  return found;
}
