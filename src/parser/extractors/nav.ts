import { Nav, NavBucket, SectionMap } from "../types.js";
import { findSection, getCell } from "../io/sectionize.js";
import { toNumber } from "../utils/numbers.js";
import { SEC } from "./constants.js";

export function extractNav(sections: SectionMap): Nav {
  const section = findSection(sections, ...SEC.nav);
  const buckets: NavBucket[] = [];
  let previousTotal: number | null = null;
  let currentTotal: number | null = null;
  let change: number | null = null;
  let twr: number | null = null;

  if (!section) {
    return { previousTotal, currentTotal, change, byAssetClass: buckets, timeWeightedReturnPct: null };
  }

  for (const row of section.rows) {
    if (row.kind !== "Data") continue;
    const cls = (getCell(row, "Asset class", "Assetklasse") || "").trim();

    if (cls) {
      const prev = toNumber(getCell(row, "Previous total value", "Vorheriger Gesamtwert"));
      const longC = toNumber(getCell(row, "Currently long", "Aktuell Long"));
      const shortC = toNumber(getCell(row, "Currently short", "Aktuell Short"));
      const cur = toNumber(getCell(row, "Current total value", "Aktueller Gesamtwert"));
      const ch = toNumber(getCell(row, "change", "Veränderung"));
      const lower = cls.toLowerCase();
      if (lower === "in total" || lower === "total" || lower === "gesamt") {
        previousTotal = prev;
        currentTotal = cur;
        change = ch;
      } else {
        buckets.push({
          class: cls,
          previous: prev,
          longCurrent: longC,
          shortCurrent: shortC,
          current: cur,
          change: ch,
        });
      }
      continue;
    }

    const firstVal = row.cells[2];
    if (firstVal && /%$/.test(firstVal.trim())) twr = toNumber(firstVal);
  }

  return { previousTotal, currentTotal, change, byAssetClass: buckets, timeWeightedReturnPct: twr };
}
