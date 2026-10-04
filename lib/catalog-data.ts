export type CatalogItem = {
  title: string;
  description: string;
  type: "PDF" | "Drive" | "Link";
  href?: string;
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
  { value: "sais-e-temperos", label: "Sais e temperos" },
  { value: "tabuas-de-madeira", label: "Tábuas de madeira" },
  { value: "equipamentos", label: "Equipamentos" },
] as const;

export const catalogBrands: CatalogBrand[] = [
  {
    name: "Empório Cantagallo",
    slug: "emporio-cantagallo",
    categories: ["sais-e-temperos"],
    description:
      "Sais, temperos, farofas, molhos e complementos para uma seção churrasco com forte apelo de gôndola.",
    logo: "/brands/logos/cantagallo.webp",
    railLogo: "/brands/logos/cantagallo-dark.png",
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
        href: "https://drive.google.com/file/d/1lNmGti3PTVF1yGQYjXcY9yWc7f76a2M2/view?usp=drivesdk",
      },
    ],
  },
  {
    name: "Monte Novo",
    slug: "monte-novo",
    categories: ["tabuas-de-madeira"],
    description:
      "Tábuas, gamelas, petisqueiras e peças em madeira para exposição, presentes e composição de kits.",
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
        href: "https://drive.google.com/file/d/1GESIr5XnRGhwXE7fxqj11FigAYM6KGnS/view?usp=drivesdk",
      },
    ],
  },
  {
    name: "Prime Grill",
    slug: "prime-grill",
    categories: ["acessorios"],
    description:
      "Acessórios para churrasco, acendimento e limpeza que complementam a venda e aumentam a cesta.",
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
        href: "https://drive.google.com/file/d/1UD11QbdrDLt7obqdlMYQg1cgMeTCzZRD/view?usp=drivesdk",
      },
    ],
  },
  {
    name: "ArtMill",
    slug: "artmill",
    categories: ["acessorios", "equipamentos"],
    description:
      "Grelhas, espetos, parrillas, pits e acessórios robustos para churrasco e preparo profissional.",
    logo: "/brands/logos/artmill.webp",
    searchTerms: ["pit smoker", "fogo de chão", "parrilla"],
    whatsappMessage:
      "Olá, Antonio. Vi a ArtMill no site da ARCO e quero orientação para comprar produtos da marca para minha loja.",
    catalogs: [
      {
        title: "Acessórios ArtMill (2025)",
        description: "Catálogo de acessórios para churrasco.",
        type: "PDF",
        href: "https://drive.google.com/file/d/1G3v06Txecw7Ue-wTgYD8RuMMky7ut2p3/view?usp=drivesdk",
      },
      {
        title: "Pits e fogo de chão ArtMill (2024)",
        description: "Pits, fogo de chão e parrillas.",
        type: "PDF",
        href: "https://drive.google.com/file/d/1fiskcK3P3ys8az_S-64MJB6fXwvw9E_r/view?usp=drivesdk",
      },
    ],
  },
  {
    name: "ADM Metais",
    slug: "adm-metais",
    categories: ["acessorios"],
    description:
      "Grelhas, espetos, discos e acessórios metálicos com foco em durabilidade, variedade e exposição.",
    logo: "/brands/logos/adm-metais.webp",
    whatsappMessage:
      "Olá, Antonio. Vi a ADM Metais no site da ARCO e quero orientação para comprar produtos da marca para minha loja.",
    catalogs: [
      {
        title: "Catálogo geral ADM Metais",
        description: "Linha de grelhas, espetos, discos e acessórios.",
        type: "PDF",
        href: "https://drive.google.com/file/d/1d5B_ip_ohNZVRA5Ety3Sl2lKC_p4jgcf/view?usp=drivesdk",
      },
    ],
  },
  {
    name: "Orved Brock",
    slug: "orved-brock",
    categories: ["equipamentos"],
    description:
      "Equipamentos para embalar, conservar e agregar valor à operação de açougues, frigoríficos e food service.",
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
        href: "https://drive.google.com/file/d/1RonIL6y3UvUMzZV_TXuds0tjG42k6dH8/view?usp=drivesdk",
      },
    ],
  },
];

export const catalogFaq = [
  {
    question: "Os catálogos têm preço?",
    answer:
      "Alguns materiais podem trazer valores de referência. Confirme preços, condições, frete e prazo atuais na plataforma de pedidos ou com a equipe comercial.",
  },
  {
    question: "Como recebo o catálogo de uma marca?",
    answer:
      "Escolha a marca e clique em Ver catálogo para abrir o arquivo no Google Drive. A ArtMill tem catálogos separados de acessórios e de pits e fogo de chão.",
  },
  {
    question: "A ARCO vende para pessoa física?",
    answer:
      "O atendimento comercial é voltado a empresas com CNPJ, como supermercados, açougues, empórios e lojas especializadas.",
  },
  {
    question: "A ARCO ajuda a escolher o mix?",
    answer:
      "Sim. A recomendação considera perfil da loja, espaço, público, categoria trabalhada e potencial de giro.",
  },
  {
    question: "Como faço para comprar?",
    answer:
      "Clientes cadastrados podem acessar a plataforma de pedidos. Se ainda não é cliente, solicite seu cadastro com CNPJ e e-mail.",
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
