/** All money is in integer cents; rates are hundredths of one percent. */
export const MAX_UNIT_COST_CENTS = 100_000_000;
export const RATE_SCALE = 10_000;
export const MAX_FREIGHT_RATE = 100_000;

export type ParsedNumber =
  | { status: "valid"; value: number }
  | { status: "empty" }
  | { status: "invalid"; message: string };

function parseScaled(raw: string, maximum: number, unit: "money" | "rate"): ParsedNumber {
  let text = raw.trim();
  if (!text) return { status: "empty" };
  if (unit === "money") text = text.replace(/^R\$\s*/i, "");
  else text = text.replace(/%$/, "").trim();
  if (text.length > 32) return { status: "invalid", message: "Valor acima do limite permitido." };

  // Brazilian grouping and decimal commas, or an ungrouped decimal point.
  if (/^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(text)) {
    text = text.replace(/\./g, "").replace(",", ".");
  } else if (/^(?:\d+(?:[.,]\d{1,2})?|[.,]\d{1,2})$/.test(text)) {
    text = text.replace(",", ".");
  } else {
    return { status: "invalid", message: "Digite um número como 10,50, com até duas casas decimais. Use zero quando o campo permitir." };
  }

  const [whole = "0", fraction = ""] = text.split(".");
  const scaled = BigInt(whole || "0") * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
  if (scaled > BigInt(maximum)) {
    return { status: "invalid", message: unit === "money"
      ? "O limite por campo é R$ 1.000.000,00."
      : `O limite deste campo é ${maximum / 100}%.` };
  }
  return { status: "valid", value: Number(scaled) };
}

export function parseMoney(raw: string): ParsedNumber {
  return parseScaled(raw, MAX_UNIT_COST_CENTS, "money");
}

export function parseRate(raw: string, maximum = RATE_SCALE): ParsedNumber {
  return parseScaled(raw, maximum, "rate");
}

export interface PricingInput {
  acquisitionCents: number;
  freightMode: "amount" | "percent";
  freightValue: number;
  otherCents: number;
  taxRate: number;
  feeRate: number;
  marginRate: number;
}

export interface PricingResult {
  acquisitionCents: number;
  freightCents: number;
  otherCents: number;
  totalCostCents: number;
  priceCents: number;
  taxCents: number;
  feeCents: number;
  contributionCents: number;
  effectiveMarginPercent: number;
  markupPercent: number;
}

export type PricingOutcome = { ok: true; result: PricingResult } | { ok: false; message: string };

function inRange(value: number, maximum: number) {
  return Number.isSafeInteger(value) && value >= 0 && value <= maximum;
}

const scale = BigInt(RATE_SCALE);
const one = BigInt(1);
const two = BigInt(2);

function roundRate(amount: bigint, rate: number) {
  // Half-up rounding, never a floating-point money operation.
  return (amount * BigInt(rate) + scale / two) / scale;
}

function ceiling(numerator: bigint, denominator: bigint) {
  return (numerator + denominator - one) / denominator;
}

export function calculatePricing(input: PricingInput): PricingOutcome {
  if (!inRange(input.acquisitionCents, MAX_UNIT_COST_CENTS) || input.acquisitionCents === 0) {
    return { ok: false, message: "Informe um custo de aquisição maior que zero." };
  }
  if (input.freightMode !== "amount" && input.freightMode !== "percent") {
    return { ok: false, message: "Escolha como informar o frete." };
  }
  if (!inRange(input.freightValue, input.freightMode === "amount" ? MAX_UNIT_COST_CENTS : MAX_FREIGHT_RATE)
    || !inRange(input.otherCents, MAX_UNIT_COST_CENTS)) {
    return { ok: false, message: "Revise os custos de frete e outros custos por unidade." };
  }
  if (![input.taxRate, input.feeRate, input.marginRate].every(rate => inRange(rate, RATE_SCALE))) {
    return { ok: false, message: "As taxas e a margem devem ficar entre 0% e 100%." };
  }
  const denominator = RATE_SCALE - input.taxRate - input.feeRate - input.marginRate;
  if (denominator <= 0) {
    return { ok: false, message: "Impostos, despesas sobre a venda e margem desejada precisam somar menos de 100%." };
  }

  const acquisition = BigInt(input.acquisitionCents);
  const freight = input.freightMode === "amount"
    ? BigInt(input.freightValue)
    : roundRate(acquisition, input.freightValue);
  const other = BigInt(input.otherCents);
  const cost = acquisition + freight + other;
  const divisor = BigInt(denominator);
  const target = BigInt(input.marginRate);
  let price = ceiling(cost * scale, divisor);

  // Rounding the two sales charges can add up to one cent. The bound below
  // guarantees the requested contribution margin even in the worst case.
  const upperBound = ceiling((cost + one) * scale, divisor);
  let tax = roundRate(price, input.taxRate);
  let fee = roundRate(price, input.feeRate);
  let contribution = price - cost - tax - fee;
  while (contribution * scale < price * target && price < upperBound) {
    price += one;
    tax = roundRate(price, input.taxRate);
    fee = roundRate(price, input.feeRate);
    contribution = price - cost - tax - fee;
  }

  return { ok: true, result: {
    acquisitionCents: input.acquisitionCents,
    freightCents: Number(freight),
    otherCents: input.otherCents,
    totalCostCents: Number(cost),
    priceCents: Number(price),
    taxCents: Number(tax),
    feeCents: Number(fee),
    contributionCents: Number(contribution),
    effectiveMarginPercent: Number(contribution) / Number(price) * 100,
    markupPercent: (Number(price) / Number(cost) - 1) * 100,
  } };
}
