---
name: moneyfrisk
description: >-
  Frisk your diff for money stored or computed as a floating-point number before you
  call a coding task done. Triggers automatically when you are about to report work
  complete and your diff touched anything money-shaped (price, amount, total, balance,
  fee, tax, currency math) — or on /moneyfrisk. Floats can't represent most decimal
  cents exactly, so 0.1 + 0.2 is 0.30000000000000004 and money silently drifts;
  moneyfrisk flags float-typed money, unsafe float arithmetic on currency, and lossy
  float<->money conversions in the changed lines, and refuses to say "done" while a
  money value is riding on a float.
---

# moneyfrisk — frisk your diff for money on floats

You just wrote or changed code that touches money. Before you tell the user it's done,
**frisk it for floats**. A binary floating-point number (`float`, `double`, JS `number`,
Python `float`) cannot represent most decimal fractions exactly: `0.1 + 0.2` is
`0.30000000000000004`, and `1.10 * 3` is `3.3000000000000003`. Store or compute money in
floats and the cents drift — a penny here, a rounding error there — until a total doesn't
reconcile and someone's invoice is off. A linter sees `price: number`; only you, with the
diff in hand, know `price` is dollars. So you frisk your own money lines.

## When to run

- **Automatically**, right before you would say a coding task is done, merged, or ready —
  any "done / finished / ✅" moment whose diff added or changed money-shaped code:
  a field or variable named like money (price, amount, total, subtotal, balance, fee,
  tax, discount, cost, salary, refund, payout, currency), arithmetic on those, or a money
  parse/format.
- **On demand** when the user types `/moneyfrisk` (frisk the current diff or a named file).

## What it looks at

Only the **money-shaped lines in your diff** — the fields, columns, variables, and
arithmetic you added or changed whose name or context says currency (price, amount, total,
balance, fee, tax, discount, payout, …), plus the DB column types and parse/format calls on
them. Not the whole repo, not non-money numbers — stay scoped and fast. A loop index, a
ratio, or a percentage used only for display is not money.

## The process (run against the changed lines)

1. **Money typed as a float** — a money-named field, column, param, or variable declared as
   `float`/`double`/`number`/`Number`/`real` (or `DECIMAL` with too-few scale digits); a DB
   column `FLOAT`/`DOUBLE`/`REAL` for an amount. Money should be integer minor units (cents),
   a true decimal type (`BigDecimal`, Python `Decimal`, SQL `NUMERIC`/`DECIMAL`), or a money library.
2. **Float arithmetic on money** — `+ - * /` or `%` directly on float money: `price * qty`,
   `* taxRate`, `/ count` (splitting a bill), or accumulating a running total in a float. Each
   op compounds the representation error.
3. **Lossy construction / parse** — `parseFloat(amount)`, `Number(price)`, `float(value)`,
   `Double.parseDouble(...)` on a money string; reading a money column into a float.
4. **Float equality / comparison on money** — `balance == 0`, `total === expected`,
   `amount > 0` where amount is a float; representation error makes these unreliable.
5. **Rounding done late or with float rounding** — `toFixed(2)` or `Math.round(x*100)/100`
   used at the end to "hide" accumulated drift, instead of rounding at defined points with a
   stated mode.
6. **Float money crossing a boundary** — a float amount written to a ledger, sent to a
   payment API, summed across rows, or compared for payment, where the drift becomes real.

Severity: **high** (money stored/accumulated as a float, float money written to a ledger or
payment, float equality deciding a transaction), **medium** (a single float op on money,
lossy parse, late-only rounding), **low** (a display-only value that never feeds a stored or
charged amount — note it, don't block).

## What to do with findings

- **Apply the safe, mechanical fix yourself** when the intent is clear — switch a money field
  to integer minor units (`amountCents`) or a decimal type, route arithmetic through that type
  or a money helper, replace `parseFloat`/`Number` on a money string with an exact parse, swap
  float `==` for an integer/decimal comparison. State each fix in the report.
- **Escalate** anything that needs a human call — changing a public type or DB column, picking
  a rounding policy (half-up vs banker's), adding a money library, or a value you can't tell is
  money without domain knowledge. Describe it, give 1–2 options, ask to **approve / fix / skip**.
- **Never invent.** A loop counter, a ratio, a percentage used only for display, a physics value
  — not money. If a number isn't currency, don't flag it. False alarms train people to mute you.

## The hard rule

Do **not** report the task as done while a **high** finding in your diff — money stored,
accumulated, compared-for-payment, or persisted as a float — is unaddressed (neither fixed nor
explicitly accepted by the user). If the money lines are clean, say so in one line and finish.

## Output format

```
moneyfrisk — N changed file(s), M money line(s)
  ✗ high    src/cart.ts:42   total accumulated in a JS number (float) across items → store cents (int)  [fixed]
  ✗ high    src/order.ts:88  amount: float written to the orders ledger → DECIMAL(12,2) column  [escalated: schema change]
  ⚠ medium  src/pay.ts:15    parseFloat(req.body.amount) on a money string → parse to integer cents  [fixed]
  ✓ rest clean (no float-typed money, no float money arithmetic)
1 finding needs your call before this is done.
```

Be terse. Real money bugs only. Fix what's safe, flag what isn't, and don't sign off while
money is riding on a float.
