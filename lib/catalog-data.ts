export type CatalogItem = {
  title: string;
  description: string;
  type: "PDF" | "Drive" | "Link";
  href?: string;
  fileSize?: string;
};

export type CatalogBrand = {
  name: string;
  slug: string;
  categories: string[];
  description: string;
  logo?: string;
  railLogo?: string;
  coverImage?: string;
  coverAlt?: string;
  featured?: boolean;
  searchTerms?: string[];
  whatsappMessage: string;
  catalogs: CatalogItem[];
};

export const catalogCategories = [
  { value: "all", label: "Todas" },
  { value: "acessorios", label: "Acessórios" },
  { value: "sais-e-temperos", label: "Alimentos e temperos" },
  { value: "tabuas-de-madeira", label: "Utensílios de madeira" },
  { value: "equipamentos", label: "Equipamentos" },
] as const;

export const catalogBrands: CatalogBrand[] = [
  {
    name: "Empório Cantagallo",
    slug: "emporio-cantagallo",
    categories: ["sais-e-temperos"],
    description:
      "Sais de parrilla, temperos, farofas, molhos e torresmos para revenda na seção churrasco.",
    logo: "/brands/logos/cantagallo.webp",
    railLogo: "/brands/logos/cantagallo-dark.webp",
    coverImage: "/catalog/covers/cantagallo.webp",
    coverAlt: "Sal de parrilla Cantagallo em uma churrasqueira acesa",
    featured: true,
    searchTerms: ["sal de parrilla", "dry rub", "torresmo", "acendedor"],
    whatsappMessage:
      "Olá, Antonio. Vi o Empório Cantagallo no site da ARCO e quero orientação para comprar produtos da marca para minha loja.",
    catalogs: [
      {
        title: "Catálogo geral Cantagallo",
        description: "Linha completa de produtos para churrasco.",
        type: "PDF",
        href: "/catalog/files/cantagallo-2026.dc469a82ba.pdf",
        fileSize: "18,2 MB",
      },
    ],
  },
  {
    name: "Monte Novo",
    slug: "monte-novo",
    categories: ["tabuas-de-madeira"],
    description:
      "Tábuas, gamelas e petisqueiras em madeira para preparo, serviço e composição de kits.",
    logo: "/brands/logos/monte-novo.webp",
    coverImage: "/catalog/covers/monte-novo.webp",
    coverAlt: "Tábua Monte Novo servindo carne preparada para churrasco",
    featured: true,
    whatsappMessage:
      "Olá, Antonio. Vi a Monte Novo no site da ARCO e quero orientação para comprar produtos da marca para minha loja.",
    catalogs: [
      {
        title: "Catálogo geral Monte Novo",
        description: "Todas as linhas de peças em madeira.",
        type: "PDF",
        href: "/catalog/files/monte-novo-2026.ce6b3c3536.pdf",
        fileSize: "8,6 MB",
      },
    ],
  },
  {
    name: "Prime Grill",
    slug: "prime-grill",
    categories: ["acessorios"],
    description:
      "Limpa grelhas, escovas, acendedores e acessórios para o preparo e a limpeza da churrasqueira.",
    logo: "/brands/logos/prime-grill.webp",
    coverImage: "/catalog/covers/prime-grill.webp",
    coverAlt: "Limpa grelhas Prime Grill em uso junto à churrasqueira",
    featured: true,
    searchTerms: ["limpa grelhas", "limpa grelha", "escova", "acendedores"],
    whatsappMessage:
      "Olá, Antonio. Vi a Prime Grill no site da ARCO e quero orientação para comprar produtos da marca para minha loja.",
    catalogs: [
      {
        title: "Catálogo geral Prime Grill",
        description: "Linha completa de acessórios para churrasco.",
        type: "PDF",
        href: "/catalog/files/prime-grill.7fc4d1d127.pdf",
        fileSize: "2,8 MB",
      },
    ],
  },
  {
    name: "ArtMill",
    slug: "artmill",
    categories: ["acessorios", "equipamentos"],
    description:
      "Grelhas, espetos, parrillas e pit smokers para churrasco e defumação.",
    logo: "/brands/logos/artmill.webp",
    searchTerms: ["pit smoker", "fogo de chão", "parrilla"],
    whatsappMessage:
      "Olá, Antonio. Vi a ArtMill no site da ARCO e quero orientação para comprar produtos da marca para minha loja.",
    catalogs: [
      {
        title: "Acessórios ArtMill (2025)",
        description: "Catálogo de acessórios para churrasco.",
        type: "PDF",
        href: "/catalog/files/artmill-acessorios-2025.bd1750451f.pdf",
        fileSize: "9,7 MB",
      },
      {
        title: "Pits e fogo de chão ArtMill (2024)",
        description: "Pits, fogo de chão e parrillas.",
        type: "PDF",
        href: "/catalog/files/artmill-pits-2024.5cba4dd29a.pdf",
        fileSize: "14,4 MB",
      },
    ],
  },
  {
    name: "ADM Metais",
    slug: "adm-metais",
    categories: ["acessorios"],
    description:
      "Grelhas, espetos, discos e acessórios metálicos para ampliar a linha de utensílios de churrasco.",
    logo: "/brands/logos/adm-metais.webp",
    whatsappMessage:
      "Olá, Antonio. Vi a ADM Metais no site da ARCO e quero orientação para comprar produtos da marca para minha loja.",
    catalogs: [
      {
        title: "Catálogo geral ADM Metais",
        description: "Linha de grelhas, espetos, discos e acessórios.",
        type: "PDF",
        href: "/catalog/files/adm-metais.e7b386c5b8.pdf",
        fileSize: "7,2 MB",
      },
    ],
  },
  {
    name: "Orved Brock",
    slug: "orved-brock",
    categories: ["equipamentos"],
    description:
      "Embaladoras a vácuo e equipamentos para a operação de açougues, frigoríficos e cozinhas profissionais.",
    logo: "/brands/logos/orved-brock.webp",
    coverImage: "/catalog/covers/orved-brock.webp",
    coverAlt: "Seladora a vácuo Orved Brock em operação profissional",
    whatsappMessage:
      "Olá, Antonio. Vi a Orved Brock no site da ARCO e quero orientação para comprar produtos da marca para minha loja.",
    catalogs: [
      {
        title: "Catálogo geral Orved Brock",
        description: "Soluções de vácuo, conservação e processamento.",
        type: "PDF",
        href: "/catalog/files/orved-brock-2025.d861adeb50.pdf",
        fileSize: "6,6 MB",
      },
    ],
  },
];

export const catalogFaq = [
  {
    question: "Os catálogos têm preço?",
    answer:
      "Alguns catálogos trazem valores de referência ou são de edições anteriores. Antes de fechar a compra, confirme preços, disponibilidade, pagamento, frete e prazo com a ARCO.",
  },
  {
    question: "Como recebo o catálogo de uma marca?",
    answer:
      "Em Catálogos, escolha a marca e toque em Ver catálogo. Se já compra com a ARCO, confirme e acesse. No primeiro contato, informe os dados de contato e da empresa. Depois, visualize ou baixe o PDF no site.",
  },
  {
    question: "A ARCO vende para pessoa física?",
    answer:
      "Nosso atendimento é voltado a empresas com CNPJ, para revenda ou uso na operação. Entre os clientes estão supermercados, açougues, empórios e lojas especializadas.",
  },
  {
    question: "A ARCO ajuda a escolher o mix?",
    answer:
      "Sim. Conte o tipo de loja, o público, o espaço disponível e as linhas que já trabalha. Essas informações ajudam a indicar produtos para o primeiro pedido, a reposição ou a ampliação do mix.",
  },
  {
    question: "Como faço para comprar?",
    answer:
      "Conheça as linhas nos catálogos ou fale com a ARCO para escolher os produtos e conferir condições. Para comprar no Mercos, solicite o acesso da empresa. Após a liberação, consulte preços e envie o pedido.",
  },
];

export const arcoContact = {
  whatsappNumber: "5581998310980",
  whatsappMessage:
    "Olá, Antonio. Quero falar com a equipe comercial da ARCO.",
  orderPlatformUrl: "https://arcorep.meuspedidos.com.br/entrar",
  registrationUrl: "https://arcorep.meuspedidos.com.br/solicitar-acesso",
  instagramUrl: "https://www.instagram.com/arco.rep/",
};

export function whatsappUrl(message = arcoContact.whatsappMessage) {
  return `https://wa.me/${arcoContact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
