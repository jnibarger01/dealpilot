import { getClaimDefinition } from "../../contracts/src/index.js";
const money = (value) => Number(value.replace(/[$,\s]/g, ""));
const textValue = (value) => value.trim();
const PATTERNS = [
    {
        type: "financial.list_price",
        regex: /(?:asking price|list price|price)\s*:?\s*\$?([0-9][0-9,]*)/i,
        parse: money,
    },
    {
        type: "financial.noi",
        regex: /(?:noi|net operating income)\s*:?\s*\$?([0-9][0-9,]*)/i,
        parse: money,
    },
    {
        type: "financial.rent_roll",
        regex: /(?:rent roll|monthly rent)\s*:?\s*\$?([0-9][0-9,]*)/i,
        parse: money,
    },
    {
        type: "financial.taxes",
        regex: /(?:annual taxes|taxes|tax bill)\s*:?\s*\$?([0-9][0-9,]*)/i,
        parse: money,
    },
    {
        type: "physical.sqft",
        regex: /(?:square feet|sq\.?\s*ft\.?|sqft)\s*:?\s*([0-9][0-9,]*)/i,
        parse: money,
    },
    {
        type: "physical.year_built",
        regex: /(?:year built|built)\s*:?\s*([12][0-9]{3})/i,
        parse: money,
    },
    {
        type: "physical.occupancy",
        regex: /(?:occupancy)\s*:?\s*([0-9]{1,3})\s*%/i,
        parse: money,
    },
    {
        type: "legal.lien_status",
        regex: /(?:lien status|liens?)\s*:?\s*([^\n.]+)/i,
        parse: textValue,
    },
    {
        type: "legal.zoning",
        regex: /(?:zoning)\s*:?\s*([^\n.]+)/i,
        parse: textValue,
    },
    {
        type: "legal.permits",
        regex: /(?:open permits|permits?)\s*:?\s*([^\n.]+)/i,
        parse: textValue,
    },
    {
        type: "legal.hoa",
        regex: /(?:hoa|homeowners association)\s*:?\s*\$?([0-9][0-9,]*)/i,
        parse: money,
    },
    {
        type: "environmental.flood_zone",
        regex: /(?:flood zone)\s*:?\s*([^\n.]+)/i,
        parse: textValue,
    },
    {
        type: "market.comps_basis",
        regex: /(?:comparable basis|comps basis|comps)\s*:?\s*([^\n.]+)/i,
        parse: textValue,
    },
];
export function extractClaims(dealId, artifact, now) {
    const claims = [];
    for (const pattern of PATTERNS) {
        const match = pattern.regex.exec(artifact.text);
        if (!match?.[1]) {
            continue;
        }
        const definition = getClaimDefinition(pattern.type);
        const value = pattern.parse(match[1]);
        const proposition = {
            subject: "property",
            predicate: definition.predicate,
            value,
            unit: definition.unit,
            period: "current",
        };
        const idSuffix = pattern.type.replace(/[^a-z0-9]+/gi, "_");
        claims.push({
            id: `clm_${dealId.replace(/^deal_/, "")}_${idSuffix}`,
            dealId,
            type: pattern.type,
            proposition,
            sourceSpan: {
                artifactSha256: artifact.sha256,
                charStart: match.index,
                charEnd: match.index + match[0].length,
                page: 1,
            },
            materiality: definition.materiality,
            status: "REPORTED",
            statusReason: "Extracted from seller-controlled artifact; born REPORTED by doctrine.",
            evidenceRefs: [],
            createdAt: now,
            updatedAt: now,
        });
    }
    return claims;
}
//# sourceMappingURL=extractor.js.map