# Reference

What moneyfrisk does, in detail. Mirrors `skill/SKILL.md`.

<!-- For each thing the skill checks/does: a heading, a 1-2 line description, a
     concrete code example (good vs bad), and the fix it applies or recommends.
     If the skill has a severity model, put the table here. -->

## 1. Money typed as a float

A money-named field/column/variable declared as a binary float.

```ts
price: number          // bad: JS number is a float
amountCents: number    // good: integer minor units
// or: Decimal / BigDecimal, or SQL NUMERIC(12,2)
```
**Fix:** integer minor units (cents), a decimal type, or a money library. Severity **high**.

## 2. Float arithmetic on money

```ts
total += item.price * item.qty;   // bad: drift compounds each iteration
total += item.priceCents * item.qty; // good: exact in integers
```
**Fix:** do the math in integer cents or a decimal type. Severity **high** (accumulating) / **medium** (single op).

## 3. Lossy construction / parse

```ts
parseFloat(req.body.amount)   // bad: "19.99" -> float
Math.round(Number(amount) * 100)  // good: parse straight to cents
```
**Fix:** parse a money string to an integer number of cents, not a float. Severity **medium**.

## 4. Float equality / comparison on money

```ts
if (balance == 0) ...   // bad: float == is unreliable
if (balanceCents === 0) ...  // good
```
**Fix:** compare integers or a decimal type. Severity **medium–high** if it decides a payment.

## 5. Late or float-only rounding

```ts
return (total).toFixed(2);            // bad: hides accumulated drift
return formatCents(roundCents(total)); // good: round at a defined point + mode
```
**Fix:** round at defined points with a stated mode, not as a final cleanup. Severity **medium**.

## 6. Float money crossing a boundary

A float amount written to a ledger, sent to a payment API, summed across rows, or compared
for payment — where the drift becomes real and charged. Severity **high**.

## Severity model

| Severity | Examples |
|---|---|
| **high** | money stored/accumulated as a float; float money written to a ledger or payment; float equality deciding a transaction |
| **medium** | a single float op on money; lossy parse; late-only rounding |
| **low** | a display-only computed value that never feeds a stored or charged amount |

moneyfrisk does not report the task done while a **high** finding in the diff is unaddressed.

---

moneyfrisk reports real signal only — if it's fine, it isn't flagged.
