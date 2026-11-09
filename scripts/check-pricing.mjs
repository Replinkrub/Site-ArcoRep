import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

// Exercise the actual financial engine without a browser, network, or records.
const requirePackage = createRequire(new URL("../package.json", import.meta.url));
const ts = requirePackage("typescript");
const filename = new URL("../lib/pricing.ts", import.meta.url);
const unit = { exports: {} };
const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
new Function("module", "exports", compiled)(unit, unit.exports);
const { calculatePricing, parseMoney, parseRate, MAX_UNIT_COST_CENTS, MAX_FREIGHT_RATE } = unit.exports;
const baseline = { acquisitionCents: 10_000, freightMode: "amount", freightValue: 0, otherCents: 0, taxRate: 0, feeRate: 0, marginRate: 2000 };
function result(input = {}) {
  const outcome = calculatePricing({ ...baseline, ...input });
  assert.equal(outcome.ok, true, outcome.message);
  return outcome.result;
}
function cents(raw, expected) { assert.deepEqual(parseMoney(raw), { status: "valid", value: expected }); }
function rate(raw, expected) { assert.deepEqual(parseRate(raw), { status: "valid", value: expected }); }

cents("11,90", 1190);
cents("11.90", 1190);
cents("R$ 1.234,56", 123456);
cents("1.234", 123400);
assert.equal(parseMoney("1.234.567,89").status, "invalid");
cents(",50", 50);
cents(".50", 50);
cents("0", 0);
cents("1.000.000,00", MAX_UNIT_COST_CENTS);
rate("5,25%", 525);
rate("0,01", 1);
rate("100", 10000);
assert.equal(parseMoney("   ").status, "empty");
assert.equal(parseRate("").status, "empty");
for (const value of ["-1", "NaN", "Infinity", "1e3", "12,345", "1,000", "1..2", "abc", "1 00", "1.000.000,01"]) {
  assert.equal(parseMoney(value).status, "invalid", value);
}
assert.equal(parseRate("100,01").status, "invalid");
assert.deepEqual(parseRate("1000", MAX_FREIGHT_RATE), { status: "valid", value: MAX_FREIGHT_RATE });

const simple = result();
assert.equal(simple.priceCents, 12500);
assert.equal(simple.contributionCents, 2500);
assert.equal(simple.effectiveMarginPercent, 20);
assert.equal(simple.markupPercent, 25);
assert.equal(result({ marginRate: 3000 }).priceCents, 14286);
const withCharges = result({ freightValue: 1000, otherCents: 500, taxRate: 600, feeRate: 400, marginRate: 3000 });
assert.equal(withCharges.totalCostCents, 11500);
assert.equal(withCharges.priceCents, 19168, "One extra cent is required after rounding the two charges");
assert.equal(withCharges.taxCents, 1150);
assert.equal(withCharges.feeCents, 767);
assert.equal(withCharges.contributionCents, 5751);
assert.deepEqual(result({ freightMode: "percent", freightValue: 1200, otherCents: 300, taxRate: 600, feeRate: 400, marginRate: 3000 }), {
  ...withCharges, freightCents: 1200, otherCents: 300,
});
const example = result({ acquisitionCents: 1000, freightValue: 100, taxRate: 500, feeRate: 300, marginRate: 3000 });
assert.equal(example.priceCents, 1775);
assert.equal(example.contributionCents, 533);
assert.equal(result({ marginRate: 0 }).priceCents, 10000);
assert.equal(result({ marginRate: 0 }).contributionCents, 0);
assert.equal(result({ acquisitionCents: 5, freightMode: "percent", freightValue: 1000, marginRate: 0 }).freightCents, 1, "Half-cent freight rounds up");

for (const invalid of [
  { acquisitionCents: 0 }, { acquisitionCents: -1 }, { acquisitionCents: NaN },
  { acquisitionCents: Infinity }, { acquisitionCents: 1.5 }, { acquisitionCents: "100" },
  { acquisitionCents: MAX_UNIT_COST_CENTS + 1 }, { freightMode: "both" },
  { freightValue: -1 }, { otherCents: -1 }, { feeRate: 10001 }, { marginRate: 10000 },
  { taxRate: 5000, feeRate: 2000, marginRate: 3000 },
  { taxRate: 5000, feeRate: 2000, marginRate: 3001 },
  { taxRate: NaN }, { marginRate: -1 },
]) assert.equal(calculatePricing({ ...baseline, ...invalid }).ok, false, JSON.stringify(invalid));

function verify(input) {
  const actual = result(input);
  const fullInput = { ...baseline, ...input };
  const scale = 10000n;
  const target = BigInt(fullInput.marginRate);
  const price = BigInt(actual.priceCents);
  assert.ok(Number.isSafeInteger(actual.priceCents));
  assert.equal(actual.priceCents, actual.totalCostCents + actual.taxCents + actual.feeCents + actual.contributionCents);
  assert.ok(BigInt(actual.contributionCents) * scale >= price * target, "Effective margin meets the target");
  const divisor = BigInt(10000 - fullInput.taxRate - fullInput.feeRate - fullInput.marginRate);
  const base = (BigInt(actual.totalCostCents) * scale + divisor - 1n) / divisor;
  assert.ok(price >= base);
  if (price > base) {
    const previous = price - 1n;
    const tax = (previous * BigInt(fullInput.taxRate) + 5000n) / scale;
    const fee = (previous * BigInt(fullInput.feeRate) + 5000n) / scale;
    assert.ok((previous - BigInt(actual.totalCostCents) - tax - fee) * scale < previous * target);
  }
}

verify({ acquisitionCents: 1, taxRate: 1, marginRate: 9998 });
verify({ acquisitionCents: 1, taxRate: 3333, feeRate: 3333, marginRate: 3333 });
verify({ acquisitionCents: MAX_UNIT_COST_CENTS, freightMode: "percent", freightValue: MAX_FREIGHT_RATE, otherCents: MAX_UNIT_COST_CENTS, taxRate: 1, marginRate: 9998 });
let seed = 20261009;
function next(maximum) {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed % maximum;
}
for (let index = 0; index < 1500; index++) {
  const taxRate = next(3001);
  const feeRate = next(2001);
  const marginRate = next(10000 - taxRate - feeRate);
  verify({ acquisitionCents: next(1_000_000) + 1, freightMode: index % 2 ? "amount" : "percent",
    freightValue: next(2501), otherCents: next(2501), taxRate, feeRate, marginRate });
}
console.log("Pricing checks passed: formats, known scenarios, invalid inputs, rounding, limits and 1,500 varied cases.");
