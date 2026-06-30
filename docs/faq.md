# FAQ

### What is this, exactly?

A skill (plain instructions) your coding agent follows. It adds no network calls,
no telemetry, no account — your code goes wherever your agent already sends it and
nowhere new.

### How is it different from a linter / CLI tool?

A linter sees `price: number` and a multiplication; it can't tell whether that number is
dollars or a loop count, so it either says nothing or flags every `number`. moneyfrisk
reasons in the same context the agent just wrote the code in — it knows `price`/`total`/`tax`
is money and the multiply is `price * qty`, so it catches float money the linter can't, and
stays quiet on the ratios and counters that aren't money.

### Will it slow me down?

Barely. It only ever reads the **money lines in your diff**, not the repo, and only when your
change actually touched money. Clean money lines get a one-line "all clear" and it's done.

### Does it spam?

It's instructed not to: it only flags real signal and never invents problems.

### What languages / stacks?

Any. The bug class is universal — JS/TS `number`, Python `float`, Java/C# `double`, Go
`float64`, SQL `FLOAT`/`REAL`. The examples here are JavaScript/TypeScript-flavored; the
fixes (integer minor units, `Decimal`/`BigDecimal`, `NUMERIC`/`DECIMAL`) map to each stack.

### Which agents?

Claude Code (native), plus Codex, Cursor, Gemini CLI, opencode, Aider, Copilot CLI.

### It missed / mis-flagged something.

Open an issue with the example and the output — the checklist is a living file.
