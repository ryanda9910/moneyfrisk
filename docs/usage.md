# Usage

## When it runs

- **Automatically** when you are about to report a coding task done and your diff added or changed money-shaped code.
- **On demand** via `/moneyfrisk`.

## What it looks at

Only the **money-shaped lines in your diff** — the fields, columns, variables, and
arithmetic you added or changed whose name or context says currency (price, amount, total,
balance, fee, tax, discount, payout, …), plus the DB column types and parse/format calls on
them. Not the whole repo, not non-money numbers. A loop index, a ratio, or a display-only
percentage is not money.

## The output

```
moneyfrisk — 1 file, 3 money lines
  ✗ high    cart.ts:7  total accumulated in a JS number (float) → sum in integer cents   [fixed]
  ✗ high    cart.ts:8  price * qty in floats compounds the drift → priceCents * qty       [fixed]
  ⚠ medium  cart.ts:9  tax = total * 0.1 then rounded late — pick a rounding policy        [escalated]
  ✓ rest clean (no float money written to a ledger)
1 finding needs your call before this is done.
```

- **summary line** — files and money lines frisked.
- **✗ high / ⚠ medium** — a float-money issue; `[fixed]` states the mechanical fix applied.
- **[escalated]** — needs your call (rounding policy, public type/schema change, ambiguous money).
- **✓ line** — what was clean, so you know it actually looked.
- **closing line** — what you must decide before the task is done.

## The rule

moneyfrisk does **not** report the task done while a **high** finding in your diff — money
stored, accumulated, compared-for-payment, or persisted as a float — is unaddressed (neither
fixed nor explicitly accepted by you). Clean money lines: it says so in one line and finishes.
