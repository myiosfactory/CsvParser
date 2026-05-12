import { DynamicRow, SectionMap, SectionRow } from "../types.js";
import { findSection } from "../io/sectionize.js";
import { rowToObject } from "../utils/cells.js";
import { toNumber } from "../utils/numbers.js";
import { parseOptionSymbol, sideFromQuantity } from "../utils/optionSymbol.js";
import { isOptions } from "./assetCategory.js";
import { SEC } from "./constants.js";

export interface ForexPositionsSummary {
  costBasisInEur: number | null;
  valueInEur: number | null;
  unrealizedGainLossInEur: number | null;
}

export interface ForexPositionsResult {
  positions: DynamicRow[];
  summary: ForexPositionsSummary | null;
}

function enrichIfOption(obj: DynamicRow): DynamicRow {
  if (!isOptions(obj.assetCategory)) return obj;

  const parsed = parseOptionSymbol(obj.symbol);
  const side = sideFromQuantity(toNumber(obj.crowd));

  return {
    ...obj,
    underlying: parsed?.underlying ?? null,
    expiry: parsed?.expiry ?? null,
    optionType: parsed?.optionType ?? null,
    strike: parsed?.strike ?? null,
    multiplier: toNumber(obj.multiple),
    side,
  };
}

export function extractOpenPositions(sections: SectionMap): DynamicRow[] {
  const section = findSection(sections, ...SEC.positions);
  if (!section) return [];
  return section.rows
    .filter((r) => r.kind === "Data")
    .map((r) => enrichIfOption(rowToObject(r)));
}

const FOREX_TOTAL_LABELS = new Set(["in total", "total", "gesamt"]);

function isForexTotalRow(row: SectionRow): boolean {
  const first = (row.cells[2] ?? "").trim().toLowerCase();
  return FOREX_TOTAL_LABELS.has(first);
}

function buildForexSummary(row: SectionRow): ForexPositionsSummary {
  const nums: number[] = [];
  for (let i = 3; i < row.cells.length; i++) {
    const n = toNumber(row.cells[i]);
    if (n !== null) nums.push(n);
  }
  const [costBasis = null, value = null, unrealized = null] = nums;
  return {
    costBasisInEur: costBasis,
    valueInEur: value,
    unrealizedGainLossInEur: unrealized,
  };
}

export function extractForeignExchangePositions(
  sections: SectionMap,
): ForexPositionsResult {
  const section = findSection(sections, ...SEC.forex);
  if (!section) return { positions: [], summary: null };

  const positions: DynamicRow[] = [];
  let summary: ForexPositionsSummary | null = null;

  for (const row of section.rows) {
    if (row.kind !== "Data") continue;
    if (isForexTotalRow(row)) {
      summary = buildForexSummary(row);
      continue;
    }
    positions.push(rowToObject(row));
  }

  return { positions, summary };
}
