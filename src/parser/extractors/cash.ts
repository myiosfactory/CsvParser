import { AccountInfo, DynamicRow, Nav, SectionMap } from "../types.js";
import { findSection } from "../io/sectionize.js";
import { rowToObject } from "../utils/cells.js";
import { SEC } from "./constants.js";

export type CashSummary = DynamicRow;

/**
 * Cash row from the Net asset value section, fully dynamic — every column the
 * CSV declares flows through (camelCased). The base currency is appended from
 * Account information so consumers know what unit `currentTotal` is in.
 */
export function extractCash(
  sections: SectionMap,
  account: AccountInfo,
  _nav: Nav,
): CashSummary {
  const section = findSection(sections, ...SEC.nav);
  const base: CashSummary = { currency: account.baseCurrency };

  if (!section) return base;

  for (const row of section.rows) {
    if (row.kind !== "Data") continue;
    const obj = rowToObject(row);
    const cls = typeof obj.assetClass === "string" ? obj.assetClass.toLowerCase() : "";
    if (cls === "cash" || cls === "barmittel") {
      return { ...obj, currency: account.baseCurrency };
    }
  }
  return base;
}
