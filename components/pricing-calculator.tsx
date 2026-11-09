"use client";

import { useState } from "react";
import { ArrowRight, Calculator, RotateCcw } from "lucide-react";
import Link from "@/components/site-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { calculatePricing, MAX_FREIGHT_RATE, parseMoney, parseRate, type ParsedNumber } from "@/lib/pricing";
import styles from "@/app/calculadora/page.module.css";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const percent = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const blank = { acquisition: "", freight: "0", other: "0", tax: "0", fees: "0", margin: "" };
type FieldName = keyof typeof blank;
const fieldNames: FieldName[] = ["acquisition", "freight", "other", "tax", "fees", "margin"];
const currency = (cents: number) => money.format(cents / 100);

export function PricingCalculator() {
  const [fields, setFields] = useState(blank);
  const [freightMode, setFreightMode] = useState<"amount" | "percent">("amount");
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [example, setExample] = useState(false);
  const parsed: Record<FieldName, ParsedNumber> = {
    acquisition: parseMoney(fields.acquisition),
    freight: freightMode === "amount" ? parseMoney(fields.freight) : parseRate(fields.freight, MAX_FREIGHT_RATE),
    other: parseMoney(fields.other),
    tax: parseRate(fields.tax),
    fees: parseRate(fields.fees),
    margin: parseRate(fields.margin),
  };
  const errors: Partial<Record<FieldName, string>> = {};
  for (const name of fieldNames) {
    const entry = parsed[name];
    if (entry.status === "invalid") errors[name] = entry.message;
    if (entry.status === "empty" && touched[name] && (name === "acquisition" || name === "margin")) {
      errors[name] = "Preencha este campo para calcular.";
    }
  }
  if (parsed.acquisition.status === "valid" && parsed.acquisition.value === 0) {
    errors.acquisition = "Informe um custo maior que zero.";
  }
  const value = (name: FieldName) => parsed[name].status === "valid" ? parsed[name].value : 0;
  const ready = parsed.acquisition.status === "valid" && parsed.acquisition.value > 0
    && parsed.margin.status === "valid" && Object.keys(errors).length === 0;
  const outcome = ready ? calculatePricing({
    acquisitionCents: value("acquisition"), freightMode, freightValue: value("freight"),
    otherCents: value("other"), taxRate: value("tax"), feeRate: value("fees"), marginRate: value("margin"),
  }) : null;
  const result = outcome?.ok ? outcome.result : null;
  const totalRate = value("tax") + value("fees") + value("margin");
  const rateError = totalRate >= 10_000 && !["tax", "fees", "margin"].some(name => parsed[name as FieldName].status === "invalid")
    ? "Impostos, despesas sobre a venda e margem desejada precisam somar menos de 100%." : null;
  const generalError = rateError || (outcome && !outcome.ok ? outcome.message : null);

  function update(name: FieldName, next: string) {
    setFields(previous => ({ ...previous, [name]: next }));
    setExample(false);
  }

  function field(name: FieldName, label: string, hint: string, unit: string, placeholder = "0,00") {
    const invalid = Boolean(errors[name]);
    return <div className={styles.field}>
      <label htmlFor={`pricing-${name}`}>{label}</label>
      <div className={styles.inputWrap}>
        <span aria-hidden="true">{unit}</span>
        <Input id={`pricing-${name}`} name={name} type="text" inputMode="decimal" autoComplete="off"
          maxLength={32} placeholder={placeholder} value={fields[name]}
          aria-required={name === "acquisition" || name === "margin"}
          aria-invalid={invalid || undefined}
          aria-describedby={`pricing-${name}-hint${invalid ? ` pricing-${name}-error` : ""}`}
          onChange={event => update(name, event.target.value)}
          onBlur={() => setTouched(previous => ({ ...previous, [name]: true }))} />
      </div>
      <p id={`pricing-${name}-hint`} className={styles.hint}>{hint}</p>
      {invalid && <p id={`pricing-${name}-error`} className={styles.error}>{errors[name]}</p>}
    </div>;
  }

  function useExample() {
    setFields({ acquisition: "10,00", freight: "1,00", other: "0", tax: "5", fees: "3", margin: "30" });
    setFreightMode("amount");
    setTouched({});
    setExample(true);
  }

  function clear() {
    setFields(blank);
    setFreightMode("amount");
    setTouched({});
    setExample(false);
  }

  return <>
    <div className={styles.workspace}>
      <section className={styles.formCard} aria-labelledby="pricing-input-title">
        <div className={styles.cardHeading}>
          <div><p className={styles.step}>01 · Seus números</p><h2 id="pricing-input-title">Quanto custa vender?</h2></div>
          <Calculator aria-hidden="true" />
        </div>
        <p className={styles.unitNote}>Valores por unidade. Se comprou uma caixa, divida o custo e o frete pela quantidade de itens.</p>
        <div className={styles.fieldGrid}>
          {field("acquisition", "Custo de aquisição", "Valor efetivo da mercadoria, sem o frete informado abaixo.", "R$")}
          {field("margin", "Margem sobre a venda (%)", "Margem de contribuição: percentual que sobra após os custos informados, antes das despesas fixas.", "%", "Ex.: 30,00")}
          <div className={styles.freightField}>
            <div className={styles.freightMode}>
              <label htmlFor="pricing-freight-mode">Como informar o frete</label>
              <NativeSelect id="pricing-freight-mode" value={freightMode} onChange={event => {
                setFreightMode(event.target.value as "amount" | "percent");
                update("freight", "0");
              }}>
                <NativeSelectOption value="amount">R$ por unidade</NativeSelectOption>
                <NativeSelectOption value="percent">% do custo de aquisição</NativeSelectOption>
              </NativeSelect>
            </div>
            {field("freight", freightMode === "amount" ? "Frete por unidade" : "Frete sobre a aquisição (%)",
              freightMode === "amount" ? "Parcela do frete correspondente a um item." : "Percentual aplicado ao custo de aquisição, não ao preço de venda.",
              freightMode === "amount" ? "R$" : "%")}
          </div>
          {field("other", "Outros custos variáveis por unidade", "Embalagem e outros custos variáveis por item. Inclua cada custo uma única vez.", "R$")}
          {field("tax", "Impostos sobre a venda (%)", "Este percentual é aplicado sobre o preço de venda. O custo da compra é informado nos campos em reais.", "%")}
          {field("fees", "Despesas sobre a venda (%)", "Soma das taxas de cartão, comissões e outras despesas percentuais sobre a venda.", "%")}
        </div>
        <p className={styles.zeroNote}>Preencha o custo de compra e a margem desejada. Informe também os demais custos que se aplicam à sua operação; use zero quando não existirem.</p>
        <div className={styles.tools}>
          <Button type="button" variant="outline" onClick={useExample}>Usar exemplo</Button>
          <Button type="button" variant="ghost" onClick={clear}><RotateCcw aria-hidden="true" /> Limpar</Button>
        </div>
        {example && <p className={styles.exampleNote}>Exemplo ilustrativo. Substitua pelos valores da sua loja.</p>}
        {generalError && <p className={styles.generalError} role="alert">{generalError}</p>}
      </section>

      <section className={styles.resultCard} aria-labelledby="pricing-result-title">
        <p className={styles.step}>02 · Seu resultado</p>
        <h2 id="pricing-result-title">Preço calculado por unidade</h2>
        <div className={styles.liveResult} aria-live="polite" aria-atomic="true">
          {result ? <>
            <p className={styles.price}>{currency(result.priceCents)}<span>por unidade</span></p>
            <div className={styles.metrics}>
              <div><span>Sobra por venda</span><strong>{currency(result.contributionCents)}</strong><small>Antes das despesas fixas</small></div>
              <div><span>Margem efetiva</span><strong>{percent.format(result.effectiveMarginPercent)}%</strong><small>Sobre o preço de venda</small></div>
            </div>
          </> : <div className={styles.empty}>
            <Calculator aria-hidden="true" />
            <p>{generalError || Object.keys(errors).length ? "Revise os campos para calcular." : "Informe o custo de aquisição e a margem desejada."}</p>
            <span>O resultado acompanha os valores que você informar.</span>
          </div>}
        </div>
        {result && <>
          <div className={styles.breakdown}>
            <h3>Para onde vai o valor da venda</h3>
            <dl>
              <div><dt>Mercadoria</dt><dd>{currency(result.acquisitionCents)}</dd></div>
              <div><dt>Frete</dt><dd>{currency(result.freightCents)}</dd></div>
              <div><dt>Outros custos variáveis</dt><dd>{currency(result.otherCents)}</dd></div>
              <div><dt>Impostos sobre a venda</dt><dd>{currency(result.taxCents)}</dd></div>
              <div><dt>Despesas sobre a venda</dt><dd>{currency(result.feeCents)}</dd></div>
              <div className={styles.contribution}><dt>Sobra por venda</dt><dd>{currency(result.contributionCents)}</dd></div>
              <div className={styles.total}><dt>Preço calculado</dt><dd>{currency(result.priceCents)}</dd></div>
            </dl>
          </div>
          <p className={styles.markup}><strong>Acréscimo sobre o custo (markup): {percent.format(result.markupPercent)}%.</strong> Calculado sobre mercadoria, frete e outros custos: {currency(result.totalCostCents)}.</p>
        </>}
        <p className={styles.resultNote}>A sobra por venda ajuda a pagar aluguel, equipe e outras despesas fixas. O lucro líquido depende também dessas despesas.</p>
      </section>
    </div>

    <details className={styles.explanation}>
      <summary>Entenda a margem e o cálculo</summary>
      <div>
        <p><strong>Margem não é markup.</strong> Um item que custa R$ 100,00 e é vendido a R$ 125,00, sem outras despesas, tem acréscimo de 25% sobre o custo e margem de 20% sobre a venda.</p>
        <p><strong>A fórmula:</strong> custo total por unidade ÷ [1 − (impostos + despesas sobre a venda + margem desejada) ÷ 100]. O custo total reúne mercadoria, frete e outros custos por unidade.</p>
        <p>O preço é arredondado para cima em centavos. Impostos e despesas são arredondados individualmente para o centavo mais próximo; o preço é ajustado quando necessário para alcançar a margem informada. Os valores representam uma estimativa por unidade.</p>
        <p>Use as taxas efetivas da sua operação e compare o preço calculado com o seu mercado. Esta ferramenta não calcula automaticamente o regime tributário nem o lucro líquido da empresa.</p>
        <a href="https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/E809A7FF3D9553E90325714700620C06/$File/NT00031FEA.pdf" target="_blank" rel="noopener noreferrer">Saiba mais sobre margem de contribuição no Sebrae <ArrowRight aria-hidden="true" /></a>
      </div>
    </details>

    {result && <aside className={styles.catalogCta}>
      <div><p className={styles.eyebrow}>Próximo passo para sua loja</p><h2>Planejando o próximo pedido?</h2><p>Conheça as linhas para sua seção churrasco.</p></div>
      <Button asChild><Link href="/catalogos">Conhecer marcas e catálogos <ArrowRight aria-hidden="true" /></Link></Button>
    </aside>}
  </>;
}
