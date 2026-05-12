import { DynamicRow, SectionMap } from "../types.js";
import { findSection } from "../io/sectionize.js";
import { rowToObject } from "../utils/cells.js";
import { toNumber } from "../utils/numbers.js";
import {
  parseOptionSymbol,
  sideFromQuantity,
  OptionType,
  OptionSide,
} from "../utils/optionSymbol.js";
import { isOptions } from "./assetCategory.js";
import { SEC } from "./constants.js";

export interface OptionContract extends DynamicRow {
  symbol: string | null;
  underlying: string | null;
  expiry: string | null;
  optionType: OptionType | null;
  strike: number | null;
  multiplier: number | null;
  side: OptionSide | null;
}

export function extractOptionContracts(sections: SectionMap): OptionContract[] {
  const section = findSection(sections, ...SEC.positions);
  if (!section) return [];

  const out: OptionContract[] = [];
  for (const row of section.rows) {
    if (row.kind !== "Data") continue;

    const obj = rowToObject(row);
    if (!isOptions(obj.assetCategory)) continue;

    const symbol = typeof obj.symbol === "string" ? obj.symbol : null;
    const parsed = parseOptionSymbol(symbol);
    const quantity = toNumber(obj.crowd);
    const multiplier = toNumber(obj.multiple);

    out.push({
      ...obj,
      symbol,
      underlying: parsed?.underlying ?? null,
      expiry: parsed?.expiry ?? null,
      optionType: parsed?.optionType ?? null,
      strike: parsed?.strike ?? null,
      multiplier,
      side: sideFromQuantity(quantity),
    });
  }
  return out;
}
