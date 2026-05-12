/**
 * Canonical field name map.
 * Keys are lowercase-trimmed IBKR column header strings (English and German).
 * Values are the standardized camelCase English field names exposed in the API.
 *
 * Rule: any header that appears in a real IBKR statement should be listed here.
 * Unknown headers fall back to toCamelCase() — they won't break, but won't be
 * as clean. Add them here as they are encountered.
 */
export const FIELD_MAP: Record<string, string> = {
  // ── Common ────────────────────────────────────────────────────────────────
  "currency":                           "currency",
  "währung":                            "currency",
  "wahrung":                            "currency",
  "date":                               "date",
  "datum":                              "date",
  "date/time":                          "dateTime",
  "datum/uhrzeit":                      "dateTime",
  "datumzeit":                          "dateTime",
  "datum/zeit":                         "dateTime",
  "description":                        "description",
  "beschreibung":                       "description",
  "amount":                             "amount",
  "betrag":                             "amount",
  "code":                               "code",
  "symbol":                             "symbol",
  "asset category":                     "assetCategory",
  "vermögenswertkategorie":             "assetCategory",
  "vermgenswertkategorie":              "assetCategory",
  "datadiscriminator":                  "dataDiscriminator",

  // ── Open positions ────────────────────────────────────────────────────────
  "crowd":                              "crowd",
  "anzahl":                             "quantity",
  "menge":                              "crowd",
  "multiple":                           "multiplier",
  "multiplikator":                      "multiplier",
  "multipl.":                           "multiplier",
  "multipl":                            "multiplier",
  "introductory course":                "costPrice",
  "einführungskurs":                    "costPrice",
  "einfuhrungskurs":                    "costPrice",
  "einstandskurs":                      "costPrice",
  "cost basis":                         "costBasis",
  "kostenbasis":                        "costBasis",
  "closing price":                      "closingPrice",
  "schlusskurs":                        "closingPrice",
  "value":                              "marketValue",
  "wert":                               "marketValue",
  "unrealized g/v":                     "unrealizedPnl",
  "unrealized gain/loss":               "unrealizedPnl",
  "unrealisierter g/v":                 "unrealizedPnl",
  "realisierter g/v":                   "realizedPnl",
  "realisiertergv":                     "realizedPnl",
  "play by":                            "playBy",

  // ── Transactions ──────────────────────────────────────────────────────────
  "t.-course":                          "tradePrice",
  "t.-kurs":                            "tradePrice",
  "proceeds":                           "proceeds",
  "erlös":                              "proceeds",
  "erlos":                              "proceeds",
  "commission/fee":                     "commission",
  "provision/gebühr":                   "commission",
  "provision/gebhr":                    "commission",
  "prov./gebühr":                       "commission",
  "prov./gebhr":                        "commission",
  "base":                               "basis",
  "basis":                              "basis",
  "realized profit and loss statement": "realizedPnl",
  "realisierter gewinn und verlust":    "realizedPnl",

  // ── NAV ───────────────────────────────────────────────────────────────────
  "asset class":                        "assetClass",
  "assetklasse":                        "assetClass",
  "previous total value":               "previousValue",
  "vorheriger gesamtwert":              "previousValue",
  "currently long":                     "longValue",
  "aktuell long":                       "longValue",
  "currently short":                    "shortValue",
  "aktuell short":                      "shortValue",
  "current total value":                "currentValue",
  "aktueller gesamtwert":               "currentValue",
  "change":                             "change",
  "veränderung":                        "change",

  // ── Change in NAV ─────────────────────────────────────────────────────────
  "field name":                         "fieldName",
  "field value":                        "fieldValue",
  "feldname":                           "fieldName",
  "feldwert":                           "fieldValue",

  // ── FX positions ──────────────────────────────────────────────────────────
  "cost basis in eur":                  "costBasisInEur",
  "kostenbasis in eur":                 "costBasisInEur",
  "value in eur":                       "valueInEur",
  "wert in eur":                        "valueInEur",
  "unrealized gain/loss in eur":        "unrealizedPnlInEur",
  "unrealisierter gewinn/verlust in eur": "unrealizedPnlInEur",

  // ── FX P&L details ────────────────────────────────────────────────────────
  "fx currency":                        "fxCurrency",
  "fx-währung":                         "fxCurrency",
  "proceeds in eur":                    "proceedsInEur",
  "erlös in eur":                       "proceedsInEur",
  "base in eur":                        "basisInEur",
  "basis in eur":                       "basisInEur",
  "realized profit/loss in eur":        "realizedPnlInEur",
  "realisierter gewinn/verlust in eur": "realizedPnlInEur",

  // ── Performance summary ───────────────────────────────────────────────────
  "cost adjustment":                    "costAdjustment",
  "kostenanpassung":                    "costAdjustment",
  "realised s/t profit":                "realizedShortTermProfit",
  "realized s/t profit":                "realizedShortTermProfit",
  "realized s/t loss":                  "realizedShortTermLoss",
  "realized l/t profit":                "realizedLongTermProfit",
  "realized l/t loss":                  "realizedLongTermLoss",
  "total realized":                     "totalRealized",
  "unrealized s/t profit":              "unrealizedShortTermProfit",
  "unrealized s/t loss":                "unrealizedShortTermLoss",
  "unrealized l/t profit":              "unrealizedLongTermProfit",
  "unrealized l/t loss":                "unrealizedLongTermLoss",
  "unrealized total":                   "unrealizedTotal",
  "in total":                           "total",
  "gesamt":                             "total",

  // ── Margin overview ───────────────────────────────────────────────────────
  "net liquidation value":              "netLiquidationValue",
  "initial margin":                     "initialMargin",
  "maintenance margin":                 "maintenanceMargin",
  "excess liquidity":                   "excessLiquidity",
  "margin utilization %":               "marginUtilizationPct",

  // ── Dividends / Withholding / Fees / Interest / Deposits ─────────────────
  "time-weighted return":               "timeWeightedReturnPct",
};

/**
 * Aggressively normalize a header for lookup so that every casing and
 * separator variant of the same logical header resolves to one map entry.
 *
 * Examples (all collapse to "einstandskurs"):
 *   "EinstandsKurs", "Einstands Kurs", "Einstands-Kurs",
 *   "einstands_kurs", "EINSTANDS KURS"
 *
 * Examples (all collapse to "realisiertergv"):
 *   "Realisierter G/V", "Realisierter G&V",
 *   "Realisierter G.V.", "realisierterGV"
 *
 * Normalization steps:
 *   1. Transliterate German umlauts (ä→ae, ö→oe, ü→ue, ß→ss).
 *   2. Lowercase the whole string.
 *   3. Strip every character that is not a letter, digit or `%`.
 *      This removes spaces, hyphens, underscores, dots, slashes,
 *      ampersands, parentheses and similar punctuation.
 *
 * Net effect: you only need ONE map entry per logical header,
 * not three variants for every possible separator.
 */
const UMLAUT_TRANSLITERATIONS: Record<string, string> = {
  ä: "ae", ö: "oe", ü: "ue", ß: "ss",
  Ä: "ae", Ö: "oe", Ü: "ue",
};

function normalizeHeaderForLookup(header: string): string {
  return header
    .replace(/[äöüßÄÖÜ]/g, (char) => UMLAUT_TRANSLITERATIONS[char] ?? char)
    .toLowerCase()
    .replace(/[^a-z0-9%]/g, "");
}

/**
 * Pre-normalize every FIELD_MAP key once at module load time so each lookup
 * is a single O(1) hash hit (instead of normalizing both sides on every call).
 */
const normalizedFieldMap: Record<string, string> = (() => {
  const result: Record<string, string> = {};
  for (const [rawHeader, canonical] of Object.entries(FIELD_MAP)) {
    result[normalizeHeaderForLookup(rawHeader)] = canonical;
  }
  return result;
})();

/**
 * Look up the canonical English field name for an IBKR column header.
 * Returns undefined when the header is unknown — callers fall back to
 * `toCamelCase()` in that case.
 */
export function canonicalField(header: string): string | undefined {
  return normalizedFieldMap[normalizeHeaderForLookup(header)];
}
