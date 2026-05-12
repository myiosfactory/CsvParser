import { SectionRow, DynamicRow } from "../types.js";
import { toNumber } from "./numbers.js";
import { canonicalField } from "./fieldMap.js";

const UMLAUT_MAP: Record<string, string> = {
  ä: "ae", ö: "oe", ü: "ue", ß: "ss",
  Ä: "ae", Ö: "oe", Ü: "ue",
};

/**
 * Convert a header label to camelCase.
 * Transliterates German umlauts first so they don't silently vanish and
 * produce garbled keys like "wHrung" (Währung) or "erlS" (Erlös).
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[äöüßÄÖÜ]/g, (c) => UMLAUT_MAP[c] ?? c)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-/]/g, " ")
    .replace(/[^a-zA-Z0-9 ]+/g, " ")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join("");
}

/** Parse a cell: empty → null; numeric-looking → number; otherwise → trimmed string. */
export function parseCell(raw: string | undefined): string | number | null {
  if (raw === undefined) return null;
  const s = String(raw).trim();
  if (s === "") return null;
  if (/^-?\d+(\.\d+)?$/.test(s) || /^-?\d+(\.\d+)?%$/.test(s)) {
    const n = toNumber(s);
    if (n !== null) return n;
  }
  return s;
}

/**
 * Map every column declared in the section's most recent Header row to a
 * canonical English field name.
 *
 * Resolution order:
 *  1. FIELD_MAP lookup (known IBKR headers → stable English API names)
 *  2. toCamelCase fallback (unknown columns — handles umlauts cleanly now)
 */
export function rowToObject(row: SectionRow): DynamicRow {
  const out: DynamicRow = {};
  for (const [columnName, columnIndex] of Object.entries(row.headerMap)) {
    const fieldName = canonicalField(columnName) ?? toCamelCase(columnName);
    out[fieldName] = parseCell(row.cells[columnIndex]);
  }
  return out;
}
