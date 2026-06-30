<p align="center">
  <img src="assets/logo.svg" alt="moneyfrisk" width="96" height="96" />
</p>

<h1 align="center">moneyfrisk</h1>

<p align="center"><b>上线前，先搜查你的 diff 里有没有用浮点数存钱。</b></p>

<p align="center">
  <a href="README.md">🇺🇸 English</a> · <a href="README.id.md">🇮🇩 Bahasa Indonesia</a> · 🇨🇳 简体中文
</p>

<p align="center">
  <img src="demo.gif" alt="moneyfrisk 演示" width="760" />
</p>

一个 Claude Code **技能**（同样适用于 Codex、Cursor、Gemini CLI、opencode），让你的 agent
在宣布任务完成前先搜查自己。一旦它的 diff 碰到了钱——价格、总额、税、余额——moneyfrisk
就搜查这些行里软件最古老的隐性 bug：用二进制浮点数存储或计算金额。`0.1 + 0.2` 等于
`0.30000000000000004`。把购物车总额累加到 `number` 里、把价格乘以税率、用 `parseFloat`
解析 `"19.99"`，分就会漂移，直到账单对不上。linter 只看到 `price: number`；只有手握 diff 的
agent 知道 `price` 是钱。moneyfrisk 修掉机械性的问题（改成整数分或十进制类型），上报需要
拍板的策略（用哪种舍入模式？），并且只要还有钱在用浮点数，就不签字说"完成"。

## 前 / 后对比

**没有 moneyfrisk** —— agent 写好结账总额、说"完成"，然后把会漂移的分一起上线：

```js
let total = 0;
for (const it of items) total += it.price * it.qty;  // 浮点累加
const tax = total * 0.1;                              // 19.99 -> 1.9990000000000001
```

**有了 moneyfrisk** —— 先搜查金额行，只要还有浮点数掌权就不算完成：

```
moneyfrisk — 1 个文件，3 行金额
  ✗ high    cart.ts:7  总额累加在 JS number（浮点）里 → 用整数分求和   [fixed]
  ✗ high    cart.ts:8  price * qty 用浮点会放大漂移 → priceCents * qty   [fixed]
  ⚠ medium  cart.ts:9  tax = total * 0.1 之后才舍入 —— 请选定舍入策略     [escalated]
  ✓ 其余干净（没有浮点金额写入账本）
1 处需要你拍板，之后才算完成。
```

## 安装

```bash
# macOS / Linux / WSL
curl -fsSL https://raw.githubusercontent.com/ryanda9910/moneyfrisk/main/install.sh | bash

# Windows (PowerShell)
irm https://raw.githubusercontent.com/ryanda9910/moneyfrisk/main/install.ps1 | iex
```

它会找出你装的每个编码 agent，把技能装进每一个。约 10 秒，可重复运行。无需密钥、无需账号、无依赖。

## 许可证

MIT。
