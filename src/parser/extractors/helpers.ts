import { Section, SectionRow } from "../types.js";
import { getCell } from "../io/sectionize.js";

export function dataRows(section: Section | undefined): SectionRow[] {
  return section ? section.rows.filter((r) => r.kind === "Data") : [];
}

/** Collapse a "Field name / Field value" key-value section into a Map. */
export function kvMap(section: Section | undefined): Map<string, string> {
  const out = new Map<string, string>();
  for (const row of dataRows(section)) {
    const key = getCell(row, "Field name", "Feldname");
    const val = getCell(row, "Field value", "Feldwert");
    if (key !== undefined) out.set(key.trim().toLowerCase(), (val ?? "").trim());
  }
  return out;
}

/** Look up the first non-empty value among the given keys (case-insensitive). */
export function lookup(kv: Map<string, string>, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = kv.get(k.toLowerCase());
    if (v !== undefined && v !== "") return v;
  }
  return null;
}
