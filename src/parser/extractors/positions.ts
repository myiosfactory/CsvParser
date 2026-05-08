import { DynamicRow, SectionMap } from "../types.js";
import { findSection } from "../io/sectionize.js";
import { rowToObject } from "../utils/cells.js";
import { SEC } from "./constants.js";

export function extractOpenPositions(sections: SectionMap): DynamicRow[] {
  const section = findSection(sections, ...SEC.positions);
  if (!section) return [];
  return section.rows.filter((r) => r.kind === "Data").map(rowToObject);
}

export function extractForeignExchangePositions(sections: SectionMap): DynamicRow[] {
  const section = findSection(sections, ...SEC.forex);
  if (!section) return [];
  return section.rows.filter((r) => r.kind === "Data").map(rowToObject);
}
