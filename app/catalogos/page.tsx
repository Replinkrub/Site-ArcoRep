import type { Metadata } from "next";

import { CatalogExplorer } from "@/components/catalog/catalog-explorer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Catálogos | ARCO Representações",
  description:
    "Consulte os catálogos das marcas representadas pela ARCO, filtre por categoria e fale com a equipe comercial.",
};

export default function CatalogosPage() {
  return (
    <>
      <SiteHeader />
      <CatalogExplorer />
      <SiteFooter />
    </>
  );
}
