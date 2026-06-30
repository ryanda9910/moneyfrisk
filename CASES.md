# Real runs

Actual moneyfrisk runs in Claude Code (not mockups), on planted examples.
Reproduce: install the skill, set up the example, run `/moneyfrisk`.

Command used (headless Claude Code, own auth, no API key in shell):
```
claude -p "use your moneyfrisk skill on <target>. Output only the moneyfrisk report." --allowed-tools "Bash(git diff:*)" "Read"
```

---

## Case 1 — a checkout total built on floats

The agent added cart totals to a checkout function. The diff it frisked:
```diff
 export async function checkout(userId: string, items: Item[]) {
+  let total = 0;
+  for (const it of items) total += it.price * it.qty;
+  const tax = total * 0.1;
+  const grandTotal = total + tax;
+  if (grandTotal == 0) throw new Error("empty cart");
+  const order = await db.order.create({ userId, items, amount: grandTotal.toFixed(2) });
   return order;
 }
```
moneyfrisk said (verbatim, no-edit mode so it escalated instead of fixing):
```
moneyfrisk — 1 changed file(s), 5 money line(s)
  ✗ high    cart.ts:7   total accumulated in a JS number (float) across items: price*qty → store/sum integer cents  [escalated: no-edit]
  ✗ high    cart.ts:11  float grandTotal written to orders ledger via toFixed(2) (late string round hides drift) → persist integer cents / DECIMAL(12,2)  [escalated: no-edit]
  ⚠ medium  cart.ts:8   tax = total * 0.1 float arithmetic on money → compute in cents/decimal  [escalated: no-edit]
  ⚠ medium  cart.ts:10  grandTotal == 0 float equality deciding checkout → integer/decimal compare  [escalated: no-edit]
  ⚠ medium  cart.ts:9   grandTotal = total + tax float add → decimal/cents add  [escalated: no-edit]
  ✓ price/qty interface field (cart.ts:3) display-input, flagged via downstream use
2 high findings need your call. Money riding on float — not done.
```
Caught the float accumulation, the float amount written to the ledger via `toFixed(2)`
(the late string-round that *hides* the drift), the float tax math, and the `== 0` float
equality deciding the checkout — and refused to call the task done. A type-checker is happy
with every one of these: they're all valid `number`s.

---

## Case 2 — non-money numbers, no false alarm

A diff that adds plain statistics, no currency. The diff:
```diff
 export function summarize(values: number[]) {
+  let sum = 0;
+  for (const v of values) sum += v;
+  const mean = sum / values.length;
+  const ratio = values.filter((v) => v > mean).length / values.length;
+  const progressPct = Math.round(ratio * 100);
+  return { count: values.length, mean, ratio, progressPct };
 }
```
moneyfrisk said (verbatim):
```
moneyfrisk — 1 changed file, 0 money line(s)
  ✓ clean — no money-named field/var, no currency arithmetic. values/mean/ratio/progressPct are generic stats, not money.
No findings. Done.
```
The same float math (`+`, `/`, accumulation) that was a bug on money is fine here, and
moneyfrisk knows the difference: a mean and a ratio are not currency, so it stays silent.
