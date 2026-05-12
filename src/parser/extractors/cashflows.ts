import { DynamicRow, SectionMap, SectionRow } from "../types.js";
import { findSection, getCell } from "../io/sectionize.js";
import { rowToObject } from "../utils/cells.js";
import { toNumber } from "../utils/numbers.js";
import { SEC } from "./constants.js";

export interface CashflowEntry {
  currency: string | null;
  date: string | null;
  description: string | null;
  amount: number | null;
  [k: string]: string | number | null;
}

export interface CashflowTotal {
  currency: string | null;
  amount: number | null;
}

export interface CashflowSection {
  entries: CashflowEntry[];
  totals: CashflowTotal[];
  grandTotal: number | null;
}

const EMPTY: CashflowSection = { entries: [], totals: [], grandTotal: null };

function buildEntry(row: SectionRow): CashflowEntry {
  const base = rowToObject(row) as DynamicRow;
  const currency = (getCell(row, "currency", "Währung", "Wahrung") ?? null) as string | null;
  const date = (getCell(row, "Date", "Datum") ?? null) as string | null;
  const description = (getCell(row, "Description", "Beschreibung") ?? null) as string | null;
  const amount = toNumber(getCell(row, "Amount", "Betrag"));

  return {
    ...base,
    currency: currency ? currency.trim() : null,
    date: date ? date.trim() : null,
    description: description ? description.trim() : null,
    amount,
  };
}

/**
 * Extract a "cashflow-style" section whose rows share the shape:
 *   currency | Date | Description | Amount
 * Used for Dividends, Withholding tax, Fees, Interest, Deposits/Withdrawals.
 */
function extractCashflowSection(
  sections: SectionMap,
  aliases: readonly string[],
): CashflowSection {
  const section = findSection(sections, ...aliases);
  if (!section) return { entries: [], totals: [], grandTotal: null };

  const entries: CashflowEntry[] = [];
  const totalsByCurrency = new Map<string, number>();
  let grandTotal: number | null = null;

  for (const row of section.rows) {
    if (row.kind === "Data") {
      entries.push(buildEntry(row));
      continue;
    }
    if (row.kind === "Total" || row.kind === "SubTotal") {
      const currency = (getCell(row, "currency", "Währung", "Wahrung") ?? "").trim();
      const amount = toNumber(getCell(row, "Amount", "Betrag"));
      if (amount === null) continue;
      if (currency) {
        totalsByCurrency.set(currency, amount);
      } else {
        grandTotal = amount;
      }
    }
  }

  if (grandTotal === null && totalsByCurrency.size > 0) {
    let sum = 0;
    for (const v of totalsByCurrency.values()) sum += v;
    grandTotal = sum;
  }

  return {
    entries,
    totals: Array.from(totalsByCurrency, ([currency, amount]) => ({ currency, amount })),
    grandTotal,
  };
}

export function extractDividends(sections: SectionMap): CashflowSection {
  return extractCashflowSection(sections, SEC.dividends);
}

export function extractWithholdingTax(sections: SectionMap): CashflowSection {
  return extractCashflowSection(sections, SEC.withholdingTax);
}

export function extractDepositsWithdrawals(sections: SectionMap): CashflowSection {
  return extractCashflowSection(sections, SEC.depositsWithdrawals);
}

export function extractFees(sections: SectionMap): CashflowSection {
  return extractCashflowSection(sections, SEC.fees);
}

export function extractInterest(sections: SectionMap): CashflowSection {
  return extractCashflowSection(sections, SEC.interest);
}

export const EMPTY_CASHFLOW_SECTION: CashflowSection = EMPTY;
