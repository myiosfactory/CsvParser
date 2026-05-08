import { DynamicRow, SectionMap } from "../types.js";
import { findSection } from "../io/sectionize.js";
import { rowToObject } from "../utils/cells.js";
import { SEC } from "./constants.js";

export type OptionContract = DynamicRow;

/** Open-positions rows where Asset category = Options. Fully dynamic — every CSV column flows through. */
export function extractOptionContracts(sections: SectionMap): OptionContract[] {
  const section = findSection(sections, ...SEC.positions);
  if (!section) return [];

  const out: OptionContract[] = [];
  for (const row of section.rows) {
    if (row.kind !== "Data") continue;

    const obj = rowToObject(row);
    const assetCategory =
      typeof obj.assetCategory === "string" ? obj.assetCategory.toLowerCase() : "";
    if (assetCategory !== "options") continue;

    out.push(obj);
  }
  return out;
}
