import { sectionize, findSection } from "./io/sectionize.js";
import {
  extractAccount,
  extractCash,
  extractNav,
  extractOpenPositions,
  extractForeignExchangePositions,
  extractTransactions,
  extractOptionContracts,
} from "./extractors/index.js";
import { ParseResult } from "./types.js";
import { NotAnIbStatementError } from "./errors.js";

export { NotAnIbStatementError } from "./errors.js";
export type { ParseResult, CashSummary, PositionsResult, DynamicRow } from "./types.js";

export function parseIbStatement(input: string | Buffer, filename?: string): ParseResult {
  const sections = sectionize(input, filename);

  const looksLikeIb =
    findSection(sections, "Statement") ||
    findSection(sections, "Account information", "Account Information", "Kontoinformation");
  if (sections.size === 0 || !looksLikeIb) {
    throw new NotAnIbStatementError();
  }

  const warnings: string[] = [];

  const account = safe(() => extractAccount(sections), warnings, "account", {
    name: null, accountId: null, baseCurrency: null, type: null,
    customerType: null, permissions: null, masterName: null,
  });
  const nav = safe(() => extractNav(sections), warnings, "nav", {
    previousTotal: null, currentTotal: null, change: null, byAssetClass: [], timeWeightedReturnPct: null,
  });

  const cash = safe(() => extractCash(sections, account, nav), warnings, "cash", {
    currency: account.baseCurrency,
  });
  const positions = {
    openPositions: safe(() => extractOpenPositions(sections), warnings, "openPositions", []),
    foreignExchangePositions: safe(() => extractForeignExchangePositions(sections), warnings, "foreignExchangePositions", []),
  };
  const transactions = safe(() => extractTransactions(sections), warnings, "transactions", []);
  const optionContracts = safe(() => extractOptionContracts(sections), warnings, "optionContracts", []);

  return { cash, positions, transactions, optionContracts };
}

/** Run an extractor; on failure record a warning and fall back instead of crashing the parse. */
function safe<T>(fn: () => T, warnings: string[], name: string, fallback: T): T {
  try {
    return fn();
  } catch (err) {
    warnings.push(`${name}: failed to extract (${(err as Error).message})`);
    return fallback;
  }
}
