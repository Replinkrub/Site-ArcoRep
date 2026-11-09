import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PricingCalculator } from "@/components/pricing-calculator";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Calculadora de precificação | ARCO Representações",
  description: "Calcule o preço de venda por unidade com custo, frete, impostos, despesas e margem de contribuição. Ferramenta aberta para lojistas, sem cadastro.",
};

export default function CalculatorPage() {
  return <>
    <SiteHeader />
    <main className={styles.page}>
      <div className={`page-shell ${styles.shell}`}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Ferramenta para o lojista · acesso livre</p>
          <h1>Seu preço, com a margem à vista.</h1>
          <p>Informe os custos por unidade e a margem desejada. Veja o preço calculado e a sobra antes das despesas fixas. Sem cadastro.</p>
        </header>
        <PricingCalculator />
      </div>
    </main>
    <SiteFooter />
  </>;
}
