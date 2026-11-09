import type { Metadata } from "next";

import { CatalogExplorer } from "@/components/catalog/catalog-explorer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { resolveCatalogSelection } from "@/lib/brand-pages";

export const metadata: Metadata = {
  title: "Catálogos para lojistas | ARCO Representações",
  description:
    "Catálogos de alimentos, acessórios, utensílios de madeira e equipamentos para churrasco. Consulte as representadas e planeje seu pedido com a ARCO.",
};

export default async function CatalogosPage({ searchParams }: { searchParams: Promise<{ marca?: string | string[]; mercado?: string | string[] }> }) {
  const query = await searchParams;
  const selection = resolveCatalogSelection(typeof query.marca === "string" ? query.marca : undefined, typeof query.mercado === "string" ? query.mercado : undefined);
  return (
    <>
      <SiteHeader />
      <CatalogExplorer initialBrand={selection.brand} initialMarket={selection.market} />
      <SiteFooter />
    </>
  );
}
