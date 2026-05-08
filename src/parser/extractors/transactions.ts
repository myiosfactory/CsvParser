import { DynamicRow, SectionMap } from "../types.js";
import { findSection } from "../io/sectionize.js";
import { rowToObject } from "../utils/cells.js";
import { SEC } from "./constants.js";

export function extractTransactions(sections: SectionMap): DynamicRow[] {
  const section = findSection(sections, ...SEC.transactions);
  if (!section) return [];
  return section.rows.filter((r) => r.kind === "Data").map(rowToObject);
}
