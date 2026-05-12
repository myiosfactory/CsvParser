import { DynamicRow, SectionMap } from "../types.js";
import { findSection } from "../io/sectionize.js";
import { rowToObject } from "../utils/cells.js";
import { toNumber } from "../utils/numbers.js";
import { parseOptionSymbol, sideFromQuantity } from "../utils/optionSymbol.js";
import { isOptions } from "./assetCategory.js";
import { SEC } from "./constants.js";

export function extractTransactions(sections: SectionMap): DynamicRow[] {
  const section = findSection(sections, ...SEC.transactions);
  if (!section) return [];

  return section.rows
    .filter((r) => r.kind === "Data")
    .map((r) => {
      const obj = rowToObject(r);
      if (!isOptions(obj.assetCategory)) return obj;

      const parsed = parseOptionSymbol(obj.symbol);
      const side = sideFromQuantity(toNumber(obj.crowd));
      return {
        ...obj,
        underlying: parsed?.underlying ?? null,
        expiry: parsed?.expiry ?? null,
        optionType: parsed?.optionType ?? null,
        strike: parsed?.strike ?? null,
        side,
      };
    });
}
