# Install

## One line

```bash
# macOS / Linux / WSL
curl -fsSL https://raw.githubusercontent.com/ryanda9910/moneyfrisk/main/install.sh | bash
# Windows (PowerShell)
irm https://raw.githubusercontent.com/ryanda9910/moneyfrisk/main/install.ps1 | iex
```

Idempotent — re-run to update. Needs `curl` or `wget` (macOS/Linux); no other deps.

## Where it installs

| Agent | Location |
|---|---|
| **Claude Code** (native skill) | `~/.claude/skills/moneyfrisk/SKILL.md` |
| Codex | `~/.codex/moneyfrisk/moneyfrisk.md` |
| Cursor | `~/.cursor/moneyfrisk/moneyfrisk.md` |
| Gemini CLI | `~/.gemini/moneyfrisk/moneyfrisk.md` |
| opencode / Aider / Copilot CLI | manual (paste into the rules file) |

## Global vs project

- **Global** (default) — home agent dirs; applies to every repo.
- **Project** — add `-- --project` (sh) / `-project` (ps1) to also install into
  `./.claude/skills/moneyfrisk/SKILL.md` so the skill travels with the repo.

## Manual

```bash
mkdir -p ~/.claude/skills/moneyfrisk
cp skill/SKILL.md ~/.claude/skills/moneyfrisk/SKILL.md
```

## Uninstall

```bash
rm -rf ~/.claude/skills/moneyfrisk ~/.codex/moneyfrisk ~/.cursor/moneyfrisk ~/.gemini/moneyfrisk
```
