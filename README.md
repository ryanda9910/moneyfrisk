<p align="center">
  <img src="assets/logo.svg" alt="moneyfrisk" width="96" height="96" />
</p>

<h1 align="center">moneyfrisk</h1>

<p align="center"><b>Frisk your diff for money on floats before you ship.</b></p>

<p align="center">
  🇺🇸 English · <a href="README.id.md">🇮🇩 Bahasa Indonesia</a> · <a href="README.zh-CN.md">🇨🇳 简体中文</a>
</p>

<p align="center">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-34D399" />
  <img alt="skill" src="https://img.shields.io/badge/Claude%20Code-skill-34D399" />
  <img alt="harness" src="https://img.shields.io/badge/also-Codex%20·%20Cursor%20·%20Gemini%20·%20opencode-blue" />
  <img alt="install" src="https://img.shields.io/badge/install-one%20line-34D399" />
</p>

<p align="center">
  <img src="demo.gif" alt="moneyfrisk demo" width="760" />
</p>

A Claude Code **skill** (also works in Codex, Cursor, Gemini CLI, opencode) that your
agent runs on itself before it says a coding task is done. The moment its diff touched
money — a price, a total, a tax, a balance — moneyfrisk frisks those lines for the oldest
silent bug in software: money stored or computed as a binary float. `0.1 + 0.2` is
`0.30000000000000004`. Accumulate a cart total in a `number`, multiply a price by a tax
rate, parse `"19.99"` with `parseFloat`, and the cents drift until an invoice doesn't add
up. A linter sees `price: number`; only the agent, with the diff in hand, knows `price` is
dollars. moneyfrisk fixes what's mechanical (move to integer cents or a decimal type),
escalates the policy calls (which rounding mode?), and refuses to sign off while money is
riding on a float.

## Before / After

**Without moneyfrisk** — the agent writes the checkout total, says "done", and ships
cents that drift:

```js
let total = 0;
for (const it of items) total += it.price * it.qty;  // float accumulation
const tax = total * 0.1;                              // 19.99 -> 1.9990000000000001
// $19.99 x 3 = 59.97, but this can land on 59.96999999999999
```

**With moneyfrisk** — it frisks the money lines first and won't call it done while a float is in charge:

```
moneyfrisk — 1 file, 3 money lines
  ✗ high    cart.ts:7  total accumulated in a JS number (float) → sum in integer cents   [fixed]
  ✗ high    cart.ts:8  price * qty in floats compounds the drift → priceCents * qty       [fixed]
  ⚠ medium  cart.ts:9  tax = total * 0.1 then rounded late — pick a rounding policy        [escalated]
  ✓ rest clean (no float money written to a ledger)
1 finding needs your call before this is done.
```

## Real runs

Not a mockup. moneyfrisk caught 5 float-money bugs in a checkout diff (accumulation, ledger write, tax, float equality) and stayed silent on a stats diff with the same math. Full verbatim output in **[CASES.md](CASES.md)**.

## Install

```bash
# macOS / Linux / WSL
curl -fsSL https://raw.githubusercontent.com/ryanda9910/moneyfrisk/main/install.sh | bash

# Windows (PowerShell)
irm https://raw.githubusercontent.com/ryanda9910/moneyfrisk/main/install.ps1 | iex
```

Finds every coding agent you have and installs the skill into each. ~10 seconds,
safe to re-run. `--project` also installs into the current repo's `.claude/`. No
key, no account, no dependency.

Manual: copy [`skill/SKILL.md`](skill/SKILL.md) into your agent's skills/rules dir
(Claude Code: `~/.claude/skills/moneyfrisk/SKILL.md`).

## Documentation

Full docs in **[docs/](docs/)** — [usage](docs/usage.md) · [reference](docs/checklist.md) ·
[install](docs/install.md) · [customizing](docs/customizing.md) · [FAQ](docs/faq.md) ·
[real runs](CASES.md) · [contributing](CONTRIBUTING.md).

## Works in

Claude Code (native skill), plus any agent that loads a rules/skill file — Codex,
Cursor, Gemini CLI, opencode, Aider, GitHub Copilot CLI.

## License

MIT.
