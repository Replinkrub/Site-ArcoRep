import { catalogBrands, type CatalogBrand } from "./catalog-data";
import { segments } from "./form-options";
import { cantagalloLines } from "./cantagallo";

export const markets = [
  { slug: "supermercados", title: "Supermercados e mercadinhos", shortTitle: "Supermercados", segment: segments[0], image: "/category-execution.webp", alt: "Exposição de produtos para churrasco em supermercado", description: "Alimentos e utensílios para compor a seção churrasco e planejar a reposição." },
  { slug: "acougues", title: "Açougues e casas de carne", shortTitle: "Açougues", segment: segments[1], image: "/partners/boi-quente.webp", alt: "Fachada da casa de carnes Boi Quente", description: "Temperos, acompanhamentos e equipamentos para revenda e para a operação." },
  { slug: "emporios", title: "Empórios e lojas especializadas", shortTitle: "Empórios", segment: segments[2], image: "/partners/emporio-do-churrasco.webp", alt: "Fachada do Empório do Churrasco", description: "Produtos para preparo, serviço e composição do mix de uma loja especializada." },
  { slug: "alimentacao", title: "Restaurantes e operações de alimentos", shortTitle: "Uso profissional", segment: segments[4], image: "/catalog/covers/orved-brock.webp", alt: "Equipamento Orved Brock para a operação profissional", description: "Utensílios e equipamentos para preparo, serviço e conservação de alimentos." },
] as const;

export type Market = typeof markets[number];
export type MarketSlug = Market["slug"];
type BrandPage = { headline: string; introduction: string; markets: MarketSlug[]; lines: { title: string; description: string }[]; guidance: string };

export const brandPages: Record<string, BrandPage> = {
  "emporio-cantagallo": {
    headline: "Cantagallo na seção churrasco da sua loja.",
    introduction: "Sais de parrilla, farofas, molhos e complementos para revenda. Explore as linhas e monte o pedido com a orientação da ARCO em Pernambuco.",
    markets: ["supermercados", "acougues", "emporios"],
    lines: cantagalloLines.map(({ title, description }) => ({ title, description })),
    guidance: "Conte quais linhas já vende e como organiza sua seção churrasco. A partir disso, podemos avaliar o primeiro mix, novas opções ou a reposição.",
  },
  "monte-novo": {
    headline: "Madeira que acompanha o preparo e a mesa.",
    introduction: "Tábuas, gamelas e petisqueiras Monte Novo para conhecer, comparar e escolher conforme o perfil de compra da sua loja.",
    markets: ["supermercados", "acougues", "emporios", "alimentacao"],
    lines: [
      { title: "Tábuas", description: "Peças para preparo e serviço, com opções apresentadas no catálogo da marca." },
      { title: "Gamelas", description: "Utensílios de madeira para preparar e servir alimentos." },
      { title: "Petisqueiras", description: "Peças para compor a mesa e avaliar combinações de presentes e kits." },
    ],
    guidance: "Informe se procura peças para revenda, composição de kits ou uso na operação. A ARCO ajuda a selecionar as linhas e consultar as condições da marca.",
  },
  "artmill": {
    headline: "Do espeto ao pit smoker.",
    introduction: "Explore acessórios, parrillas e equipamentos ArtMill. Os catálogos de acessórios e de pits permanecem disponíveis em um único acesso.",
    markets: ["supermercados", "acougues", "emporios", "alimentacao"],
    lines: [
      { title: "Grelhas e espetos", description: "Acessórios para compor a linha de churrasco da loja ou da operação." },
      { title: "Parrillas e fogo de chão", description: "Equipamentos e soluções de preparo apresentados no catálogo da marca." },
      { title: "Pit smokers", description: "Equipamentos para churrasco e defumação, com catálogo específico." },
    ],
    guidance: "Para equipamentos, descreva o uso pretendido e o espaço disponível. A ARCO encaminha a consulta de modelos, especificações e condições com a representada.",
  },
  "adm-metais": {
    headline: "Utensílios de metal para ampliar o mix.",
    introduction: "Grelhas, espetos, discos e acessórios ADM Metais para conhecer as possibilidades de revenda e de uso no preparo dos alimentos.",
    markets: ["supermercados", "acougues", "emporios", "alimentacao"],
    lines: [
      { title: "Grelhas", description: "Consulte no catálogo os modelos da linha de churrasco." },
      { title: "Espetos", description: "Utensílios para avaliar conforme o preparo e o perfil de compra." },
      { title: "Discos e acessórios", description: "Outras peças metálicas para complementar a seleção da loja." },
    ],
    guidance: "Indique os tipos de utensílio que procura e se a compra é para revenda ou uso na operação. Vamos conferir as opções e as condições da marca.",
  },
  "orved-brock": {
    headline: "Equipamentos para a rotina dos alimentos.",
    introduction: "Conheça as soluções Orved Brock de embalagem a vácuo, conservação e processamento para operações profissionais.",
    markets: ["supermercados", "acougues", "alimentacao"],
    lines: [
      { title: "Embalagem a vácuo", description: "Embaladoras para consultar conforme a aplicação e a rotina da operação." },
      { title: "Conservação", description: "Soluções da marca voltadas ao manejo e à conservação de alimentos." },
      { title: "Processamento", description: "Equipamentos apresentados no catálogo para avaliar com orientação comercial." },
    ],
    guidance: "Descreva o alimento, a aplicação e a rotina de uso. Essas informações ajudam a encaminhar a consulta de equipamento e especificações com a representada.",
  },
};

export function getMarket(slug: string | undefined | null) { return markets.find(market => market.slug === slug); }
export function brandPath(brand: Pick<CatalogBrand, "slug">) { return `/representadas/${brand.slug}`; }
export function catalogPath(brand?: string, market?: string) {
  const params = new URLSearchParams();
  if (brand && catalogBrands.some(item => item.slug === brand)) params.set("marca", brand);
  if (getMarket(market)) params.set("mercado", market!);
  return `/catalogos${params.size ? `?${params}` : ""}`;
}
export function brandsForMarket(market: MarketSlug) { return catalogBrands.filter(brand => brandPages[brand.slug]?.markets.includes(market)); }
export function resolveCatalogSelection(brand?: string, market?: string) {
  return { brand: catalogBrands.some(item => item.slug === brand) ? brand! : "", market: getMarket(market)?.slug ?? "" };
}
