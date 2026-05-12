const OPTIONS_LABELS = new Set(["options", "optionen", "option"]);
const SHARES_LABELS = new Set(["shares", "stocks", "aktien", "equities"]);

export function isOptions(raw: unknown): boolean {
  if (typeof raw !== "string") return false;
  return OPTIONS_LABELS.has(raw.trim().toLowerCase());
}

export function isShares(raw: unknown): boolean {
  if (typeof raw !== "string") return false;
  return SHARES_LABELS.has(raw.trim().toLowerCase());
}
