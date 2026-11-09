import { whatsappUrl, type CatalogBrand } from "./catalog-data";

export type CatalogContact = {
  name: string; phone: string; company: string; city: string;
  state: string; segment: string; demand: string;
};

export function catalogInquiryMessage(brand: CatalogBrand, contact: CatalogContact | null = null) {
  return [
    "Olá, Antonio. Conheci os produtos pelo site da ARCO e quero orientação para minha loja.",
    `Marca de interesse: ${brand.name}`,
    ...(contact ? [
      "", `Nome: ${contact.name.trim()}`, `WhatsApp: ${contact.phone.trim()}`,
      `Empresa: ${contact.company.trim()}`, `Cidade/UF: ${contact.city.trim()} / ${contact.state}`,
      `Tipo de empresa: ${contact.segment}`,
      ...(contact.demand.trim() ? ["", contact.demand.trim()] : []),
    ] : []),
  ].join("\n");
}

export function catalogInquiryWhatsappUrl(brand: CatalogBrand, contact: CatalogContact | null = null) {
  return whatsappUrl(catalogInquiryMessage(brand, contact));
}
