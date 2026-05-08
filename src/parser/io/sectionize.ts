import { RowKind, Section, SectionRow } from "../types.js";
import { readRows } from "./readRows.js";


const ROW_KINDS = new Set<RowKind>(["Header", "Data", "Total", "SubTotal", "Notes"]);

function normalizeKey(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function sectionize(input: string | Buffer, filename?: string): Map<string, Section> {
  const records = readRows(input, filename);

  const sections = new Map<string, Section>();
  const currentHeader = new Map<string, { original: Record<string, number>; lower: Record<string, number> }>();

  for (const cells of records) {
    if (!cells || cells.length < 2) continue;
    const name = (cells[0] ?? "").trim();
    const kindRaw = (cells[1] ?? "").trim();
    if (!name) continue;
    if (!ROW_KINDS.has(kindRaw as RowKind)) continue;
    const kind = kindRaw as RowKind;

    if (!sections.has(name)) sections.set(name, { name, rows: [] });
    const section = sections.get(name)!;

    if (kind === "Header") {
      const original: Record<string, number> = {};
      const lower: Record<string, number> = {};
      for (let i = 2; i < cells.length; i++) {
        const key = (cells[i] ?? "").trim();
        if (!key) continue;
        if (!(key in original)) original[key] = i;
        const lk = normalizeKey(key);
        if (!(lk in lower)) lower[lk] = i;
      }
      currentHeader.set(name, { original, lower });
      section.rows.push({ kind, cells, headerMap: original, headerMapLower: lower });
    } else {
      const maps = currentHeader.get(name) ?? { original: {}, lower: {} };
      section.rows.push({ kind, cells, headerMap: maps.original, headerMapLower: maps.lower });
    }
  }

  return sections;
}

export function getCell(row: SectionRow, ...aliases: string[]): string | undefined {
  for (const a of aliases) {
    const idx = row.headerMapLower[normalizeKey(a)];
    if (idx !== undefined) {
      const v = row.cells[idx];
      if (v !== undefined && v !== "") return v;
    }
  }
  return undefined;
}

export function findSection(
  sections: Map<string, Section>,
  ...aliases: string[]
): Section | undefined {
  const wanted = new Set(aliases.map(normalizeKey));
  for (const [name, section] of sections) {
    if (wanted.has(normalizeKey(name))) return section;
  }
  return undefined;
}
