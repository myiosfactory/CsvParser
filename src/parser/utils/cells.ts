import { SectionRow, DynamicRow } from "../types.js";
import { toNumber } from "./numbers.js";

/** Convert a header label like "Cost basis" or "Asset category" to camelCase. */
export function toCamelCase(str: string): string {
  return str
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
 * Map every column declared in the section's most recent Header row to a field on the output object.
 * New columns added to the CSV in future are picked up automatically.
 */
export function rowToObject(row: SectionRow): DynamicRow {
  const out: DynamicRow = {};
  for (const [colName, idx] of Object.entries(row.headerMap)) {
    out[toCamelCase(colName)] = parseCell(row.cells[idx]);
  }
  return out;
}
