# IB Activity Statement CSV Parser

Backend for sprint Deliverable 1: parses an Interactive Brokers Activity Statement CSV (English) and returns clean structured JSON for the dashboard.

## Run

```bash
npm install
npm run dev          # starts http://localhost:3000
```

## Endpoint

`POST /api/parse` — accepts either:

- `multipart/form-data` with field `file` (CSV upload), or
- raw `text/csv` body

Returns `200` with parsed JSON, or `400` if the file is not a recognizable IB statement.

```bash
curl -F "file=@fixtures/ib_statement_en.csv" http://localhost:3000/api/parse | jq
```

## Output shape

```ts
{
  account:        { name, accountId, baseCurrency, type, ... },
  period:         { raw, from, to, generatedAt },
  nav:            { previousTotal, currentTotal, change, byAssetClass[], timeWeightedReturnPct },
  navChange:      { initial, deposits, withdrawals, realizedPnl, unrealizedPnl, final, other },
  cash:           { balanceBase, currency, byCurrency[] },
  positions: {
    stocks:  [ { symbol, currency, quantity, costBasis, price, value, unrealizedPnl } ],
    options: [ { symbol, underlying, expiry, right, strike, quantity, multiplier, ... } ]
  },
  transactions:   [ { assetClass, symbol, currency, datetime, quantity, price, proceeds, fee, basis, realizedPnl, code } ],
  dividends:      { total, items[] },
  withholdingTax: { total, items[] },
  fees:           { total, items[] },
  interest:       { total, items[] },
  deposits:       { total, items[] },
  marginOverview: [ { date, netLiquidationValue, initialMargin, maintenanceMargin, excessLiquidity, utilizationPct } ],
  performance:    { bySymbol[], totals: { realized, unrealized } },
  warnings:       [ "<section>: <message>" ]
}
```

## Error handling

- **Whole file unrecognized** → `400 { error: "Not an IB Activity Statement" }`
- **Single section malformed** → that section is empty/null in the output and an entry is added to `warnings[]`. The rest of the file still parses.
- **Missing column inside a section** → field is `null`, no crash. Header columns are looked up by name, not by position.

## Test

```bash
npm test
```

Vitest parses `fixtures/ib_statement_en.csv` and asserts NAV totals, position counts, OCC option-symbol parsing, transaction parsing, and totals for dividends/fees/interest/deposits.
