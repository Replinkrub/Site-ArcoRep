"use client";

import { lazy, Suspense, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rememberedCatalogAccess, type CatalogAccess } from "@/lib/catalog-access";
import type { CatalogBrand } from "@/lib/catalog-data";
import type { CatalogContact } from "@/lib/catalog-inquiry";

const CatalogAccessDialog = lazy(() => import("./catalog-access-dialog"));

export function CatalogAccessButton({ brand, segment, label = "Ver catálogo", className = "" }: { brand: CatalogBrand; segment?: string; label?: string; className?: string }) {
  const [selection, setSelection] = useState<{ trigger: HTMLButtonElement; access: CatalogAccess | null } | null>(null);
  const [contact, setContact] = useState<CatalogContact | null>(null);
  return <>
    <Button type="button" className={className} onClick={event => setSelection({ trigger: event.currentTarget, access: rememberedCatalogAccess() ?? (contact ? "contact" : null) })} aria-label={`${label} de ${brand.name}`}>{label}<ArrowRight aria-hidden="true" /></Button>
    {selection && <Suspense fallback={<p className="catalog-opening-status" role="status">Carregando acesso ao catálogo…</p>}>
      <CatalogAccessDialog brand={brand} access={selection.access} contact={contact} initialSegment={segment} onContactSaved={setContact} trigger={selection.trigger} onClose={() => setSelection(null)} />
    </Suspense>}
  </>;
}
