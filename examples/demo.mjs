/**
 * Self-driving demo for the README recording (VHS). Key-free and deterministic —
 * replays a representative moneyfrisk run. Keep the report content faithful to the
 * real runs in CASES.md. Run: node examples/demo.mjs
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const C = {
  reset: "\x1b[0m", dim: "\x1b[2m", b: "\x1b[1m",
  green: "\x1b[38;5;42m", red: "\x1b[38;5;203m", yellow: "\x1b[38;5;221m",
  grey: "\x1b[90m", cyan: "\x1b[36m", plus: "\x1b[38;5;42m",
};
async function line(s = "", d = 55) { process.stdout.write(s + "\n"); await sleep(d); }
// stream char-by-char WITHOUT wrapping each char (that shreds ANSI escapes)
async function type(s, speed = 12) { for (const ch of s) { process.stdout.write(ch); await sleep(speed); } process.stdout.write(C.reset + "\n"); }

async function main() {
  await line(`${C.green}${C.b}  moneyfrisk${C.reset} ${C.dim}— frisk your diff for money on floats${C.reset}\n`, 400);

  // 1) show the money code the agent just wrote
  await type(`${C.cyan}$${C.reset} git diff ${C.dim}# you just added checkout totals${C.reset}`, 20);
  await sleep(150);
  await line(`${C.plus}+ let total = 0;${C.reset}`, 50);
  await line(`${C.plus}+ for (const it of items) total += it.price * it.qty;${C.reset}`, 50);
  await line(`${C.plus}+ const tax = total * 0.1;${C.reset}`, 50);
  await line();

  // 2) run the skill
  await type(`${C.cyan}$${C.reset} ${C.b}/moneyfrisk${C.reset}`, 24);
  await sleep(300);
  await line(`${C.dim}  frisking 3 money lines…${C.reset}`, 700);
  await line();

  // 3) the report (faithful to CASES.md)
  await line(`${C.b}moneyfrisk${C.reset} ${C.dim}— 1 file, 3 money lines${C.reset}`, 250);
  await line(`  ${C.red}✗ high${C.reset}    cart.ts:7  total accumulated in a JS number (float) ${C.green}→ sum in integer cents${C.reset}  ${C.green}[fixed]${C.reset}`, 320);
  await line(`  ${C.red}✗ high${C.reset}    cart.ts:8  price * qty in floats compounds the drift ${C.green}→ priceCents * qty${C.reset}  ${C.green}[fixed]${C.reset}`, 320);
  await line(`  ${C.yellow}⚠ medium${C.reset}  cart.ts:9  tax = total * 0.1 then rounded late — pick a rounding policy  ${C.yellow}[escalated]${C.reset}`, 320);
  await line(`  ${C.green}✓${C.reset} rest clean (no float money written to a ledger)`, 250);
  await line(`${C.b}0.1 + 0.2 = 0.30000000000000004. 1 call needed before this is done.${C.reset}`, 200);
  await line();
  await sleep(400);
  await line(`${C.green}  github.com/ryanda9910/moneyfrisk${C.reset}`, 100);
  await line();
}
main();
