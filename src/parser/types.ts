export type RowKind = "Header" | "Data" | "Total" | "SubTotal" | "Notes";

export interface SectionRow {
  kind: RowKind;
  cells: string[];
  headerMap: Record<string, number>;       // original-cased
  headerMapLower: Record<string, number>;  // lowercase for case-insensitive lookup
}

export interface Section {
  name: string;
  rows: SectionRow[];
}

export type SectionMap = Map<string, Section>;

// --- Internal types (used during extraction) --------------------------------

export interface AccountInfo {
  name: string | null;
  accountId: string | null;
  baseCurrency: string | null;
  type: string | null;
  customerType: string | null;
  permissions: string | null;
  masterName: string | null;
}

export interface NavBucket {
  class: string;
  previous: number | null;
  longCurrent: number | null;
  shortCurrent: number | null;
  current: number | null;
  change: number | null;
}

export interface Nav {
  previousTotal: number | null;
  currentTotal: number | null;
  change: number | null;
  byAssetClass: NavBucket[];
  timeWeightedReturnPct: number | null;
}

// --- Public output ----------------------------------------------------------

export type DynamicRow = Record<string, string | number | null>;
export type CashSummary = DynamicRow;

export interface PositionsResult {
  openPositions: DynamicRow[];
  foreignExchangePositions: DynamicRow[];
}

import type { OptionContract } from "./extractors/optionContracts.js";

export interface ParseResult {
  cash: CashSummary;
  positions: PositionsResult;
  transactions: DynamicRow[];
  optionContracts: OptionContract[];
}
