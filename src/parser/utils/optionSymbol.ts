export type OptionType = "CALL" | "PUT";
export type OptionSide = "LONG" | "SHORT";

export interface ParsedOptionSymbol {
  underlying: string;
  expiry: string;        // YYYY-MM-DD
  optionType: OptionType;
  strike: number;        // dollars (e.g. 200, 4.5)
}

/**
 * Parse an IBKR / OCC-style option symbol such as "AAPL 20251219 C00200000"
 * into structured fields. Returns null if the string does not match.
 *
 * Strike is encoded as an 8-digit integer in thousandths of a dollar
 * (00200000 → 200.000).
 */
export function parseOptionSymbol(raw: unknown): ParsedOptionSymbol | null {
  if (typeof raw !== "string") return null;
  const str = raw.trim();
  if (!str) return null;

  const matchingStr = str.match(/^([A-Z][A-Z0-9.\-]*)\s+(\d{8})\s+([CP])(\d{8})$/);
  if (!matchingStr) return null;

  const [, underlying, yyyymmdd, cp, strikeRaw] = matchingStr;
  const expiry = `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
  const strike = Number(strikeRaw) / 1000;
  if (!Number.isFinite(strike)) return null;

  return {
    underlying,
    expiry,
    optionType: cp === "C" ? "CALL" : "PUT",
    strike,
  };
}

export function sideFromQuantity(qty: number | null | undefined): OptionSide | null {
  if (qty === null || qty === undefined || !Number.isFinite(qty)) return null;
  return qty < 0 ? "SHORT" : "LONG";
}
