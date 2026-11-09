# Auditoria Impeccable — Site ARCO v65

**Status:** apenas auditoria (sem alterações de código)  
**Data:** 09/11/2026  
**Alvo:** `https://github.com/Replinkrub/Site-ArcoRep` (branch `main`, commit `67a46e8`)  
**Método:** leitura de código-fonte (homepage, layout, header, footer, calculadora, motion, presença, atendimento, catálogos, representadas) + execução do detector `impeccable detect`  
**Score geral:** 8/24 — **Crítico — falhas fundamentais que impedem uso confiável**

---

## Score de Saúde da Auditoria

| Dimensão | Score (0-4) | Justificativa |
|----------|-------------|---------------|
| Conversão / Negócio | **1** | Formulário de atendimento não envia dados; dependência externa hard-coded; sem captura de lead |
| Segurança / Estabilidade | **1** | `next.config.ts` vazio; dependência `vinext` em beta; placeholder de banco de dados; CNPJ inválido aceito |
| Acessibilidade | **2** | Logo sem `alt` descritivo; foco de teclado não visível; links `target="_blank"` sem aviso visual |
| Performance | **2** | Imagens otimizadas individualmente, mas CSS global pesado; canvas de presença contínuo; sem config de imagem |
| Código / Manutenibilidade | **2** | Código coerente com o produto, mas sem tokens de cor; CSS duplicado; slop de UI genérica detectado; sem testes |
| **Total** | **8/24** | **Crítico** |

---

## Problemas Críticos (P0)

### [P0] Funil de lead não converte — formulário de atendimento é um beco sem saída

**Local:** `app/atendimento/page.tsx`, `components/attendance-form.tsx`, `lib/attendance.ts`

O usuário preenche **10 campos** (nome, telefone, empresa, CNPJ, cidade, estado, segmento, assunto, marca, demanda). A função `buildAttendanceMessage()` apenas monta um texto para WhatsApp. Não há:
- Envio de formulário para backend/webhook/email;
- Confirmação de recebimento para o usuário;
- Gravação do lead em banco ou CRM;
- Rastreamento de conversão (Pixel, GA4, nada).

**Impacto:** O lead preenche tudo e não há evidência de que a ARCO recebeu. Se o usuário não continuar manualmente no WhatsApp, o lead morre silenciosamente.

**Comando sugerido:** `/impeccable harden`

---

### [P0] Dependência absoluta de plataforma externa para o core do negócio

**Local:** `lib/catalog-data.ts` (`arcoContact.orderPlatformUrl` = `https://arcorep.meuspedidos.com.br/entrar`)

A URL do Mercos está **hard-coded** no código-fonte. Não há variável de ambiente, não há fallback.

**Impacto:** Ponto único de falha externo fora do controle do time. Qualquer problema na plataforma externa quebra o fluxo de "fazer pedido" — a ação de maior valor comercial do site.

**Comando sugerido:** `/impeccable harden`

---

### [P0] Lógica de precificação financeira sem testes automatizados

**Local:** `lib/pricing.ts` (`calculatePricing`)

Função que lida com dinheiro (centos, BigInt, arredondamento half-up, ceiling, margem de contribuição, markup). É a única lógica financeira do site e **não há teste unitário** para ela. Nenhum script de `test` existe no `package.json`.

**Impacto:** Um bug de arredondamento ou de lógica de margem gera preço errado para lojistas. Prejuízo direto, reclamação de clientes e perda de confiança.

**Comando sugerido:** `/impeccable harden`

---

### [P0] `next.config.ts` está vazio — sem configuração de produção

**Local:** `next.config.ts`

O arquivo é um stub:
```ts
const nextConfig: NextConfig = { /* config options here */ };
export default nextConfig;
```
Não há:
- `images` (domains, formats, deviceSizes) → imagens não otimizadas pelo Next.js Image;
- `headers` (CSP, X-Frame-Options, X-Content-Type-Options) → site exposto a clickjacking e MIME sniffing;
- `rewrites`/`redirects` → não há canonização de URL;
- `output` → não há standalone ou export configurado.

**Impacto:** Em produção, o Next.js roda com defaults inseguros e sem otimização de imagem. Afeta desempenho, segurança e SEO.

**Comando sugerido:** `/impeccable harden`

---

### [P0] Build de produção depende de dependência em beta

**Local:** `package.json` → `"vinext": "1.0.0-beta.5"`

O build roda via `vinext build`. O `vinext` está em **beta**. Usar dependência beta para build de um site comercial é risco de estabilidade.

**Impacto:** O build pode quebrar a qualquer atualização. Não há versão travada com checksum confiável para produção crítica.

**Comando sugerido:** `/impeccable harden`

---

### [P0] Placeholder de banco de dados no código

**Local:** `vite.config.ts`

```ts
const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";
```

O binding do D1 usa um UUID placeholder fixo. Configuração de banco não ajustada para produção real.

**Impacto:** Se o site depende de D1 (contatos, catálogos, sessões), a conexão pode não funcionar em produção ou apontar para banco inexistente.

**Comando sugerido:** `/impeccable harden`

---

### [P0] Validação de CNPJ tecnicamente incorreta

**Local:** `lib/attendance.ts`

```ts
if (!/^[A-Z0-9]{12}\d{2}$/i.test(data.cnpj.replace(/[.\-/\s]/g, "")))
```

A regex aceita **letras** (`[A-Z0-9]`) nos 12 primeiros caracteres. CNPJ brasileiro é exclusivamente numérico (14 dígitos).

**Impacto:** Usuário pode enviar CNPJ inválido e o sistema aceita. Dados de lead comprometidos, impossível de integrar com sistemas de faturamento.

**Comando sugerido:** `/impeccable harden`

---

## Problemas de Acessibilidade (P1)

### [P1] Logo sem texto alternativo em navegação principal

**Local:** `components/site-header.tsx` e `components/site-footer.tsx`

```tsx
<SiteImage src="/logo-arco-reverse.svg" alt="" width={640} height={640} />
```

O logo é um link para a página inicial, mas `alt=""`. Usuário de leitor de tela não sabe que a imagem é a marca ARCO nem que clicar leva à home.

**Impacto:** Viola WCAG 1.1.1 (Conteúdo não textual).

**Comando sugerido:** `/impeccable clarify`

---

### [P1] Foco de teclado não visível na navegação global

**Local:** `components/site-header.tsx` (nav links, botões WhatsApp, menu mobile)

Não há `:focus-visible` com contraste adequado nos links da nav, botões de ação, nem trigger do menu mobile.

**Impacto:** Viola WCAG 2.4.7 (Focus Visível). Navegação por teclado é inoperável na prática.

**Comando sugerido:** `/impeccable adapt`

---

### [P1] Links abrem em nova aba sem aviso visual

**Local:** `app/page.tsx`, `components/site-footer.tsx`, `app/atendimento/page.tsx`

Múltiplos links usam `target="_blank" rel="noopener noreferrer"` sem indicação visual (ícone de "nova janela" ou texto).

**Impacto:** Viola WCAG 3.2.5 (Mudança por solicitação). Desorientação do usuário.

**Comando sugerido:** `/impeccable clarify`

---

## Problemas de Implementação e Integridade (P1)

### [P1] CSS global não modularizado — 10 arquivos importados no layout raiz

**Local:** `app/layout.tsx`

Todos os arquivos CSS são importados no layout raiz, carregados em **toda página**, mesmo aquelas que não usam. Cores duplicadas (`#0454c6`, `#b42318`, `#061142`) espalhadas por múltiplos arquivos sem token único.

**Impacto:** Bundle de CSS maior que o necessário, impossível de manter consistência de marca, dificulta dark mode futuro, aumenta CLS potencial.

**Comando sugerido:** `/impeccable colorize` + `/impeccable layout`

---

### [P1] "Slop" de UI genérica detectado pelo automatizado

O detector `impeccable detect` encontrou 4 anti-padrões de UI gerada por IA:

| Arquivo | Linha | Problema |
|---------|-------|----------|
| `app/catalogos/catalog.css` | 34 | `border-left: 3px solid #b42318` (side-tab accent) |
| `app/discovery.css` | 109 | `border-left: 3px solid #0454c6` (side-tab accent) |
| `app/home-v2.css` | 1764 | `cubic-bezier(0.22, 1.14, 0.36, 1)` (easing bounce/elástico) |
| `app/home-v2.css` | 475 | Grade decorativa linear-gradient (codex-grid-background) |

**Impacto:** Padrões intercambiáveis com centenas de produtos não relacionados. Dilui a identidade da ARCO (churrasco, Pernambuco, varejo B2B).

**Comando sugerido:** `/impeccable distill` + `/impeccable animate` + `/impeccable layout`

---

### [P1] 21 parceiros exibidos de uma vez na home (cognitive load)

**Local:** `app/page.tsx` (arrays `partners`, `morePartners`, `additionalPartners`)

21 parceiros renderizados simultaneamente na seção de presença. Viola a regra de memória de trabalho (≤4 itens por decisão).

**Impacto:** Sobrecarga cognitiva, decisão paralisada, taxa de rejeição na seção de prova social.

**Comando sugerido:** `/impeccable layout` ou `/impeccable distill`

---

### [P1] Sem tratamento de erro global (Error Boundary)

**Local:** todo o site

Não há `error.tsx`, `global-error.tsx`, nem Error Boundary em componentes críticos (`PricingCalculator`, `AttendanceForm`, `CatalogAccessDialog`).

**Impacto:** Usuário encontra tela branca ou erro não tratado, sem caminho de recuperação.

**Comando sugerido:** `/impeccable harden`

---

### [P1] Canvas de presença consome GPU desnecessariamente

**Local:** `components/home/presence-background.tsx`

Loop `requestAnimationFrame` roda continuamente enquanto a seção está visível. Não há pausa agressiva quando o canvas sai do viewport estrito.

**Impacto:** Performance ruim em mobile, drena bateria e aquece o dispositivo.

**Comando sugerido:** `/impeccable optimize`

---

## Problemas de SEO e Discoverability (P2)

### [P2] Sem sitemap.xml, sem robots.txt configurado

**Local:** `next.config.ts` (vazio)

Não há configuração de `robots.txt`, `sitemap`, ou metadata dinâmica para índice de páginas.

**Impacto:** Motores de busca indexam pior; páginas de marca podem não ser descobertas eficientemente.

### [P2] Sem estrutura de dados estruturado (JSON-LD)

**Local:** todo o site

Não há `Organization`, `LocalBusiness`, `Product`, ou `BreadcrumbList` em JSON-LD.

**Impacto:** Menor visibilidade em busca local (Pernambuco, seção churrasco, supermercados).

---

## Design Specificity (Veredito)

**O resultado parece autoral para o produto ARCO, mas carrega resíduos de UI genérica.**

- **Coerência:** Cópia, tom ("Especialistas na seção churrasco", "Desde 2018 em Pernambuco"), imagens de campo (estoque Cantagallo, ativação em loja) e mapa de Pernambuco com nós de rede são fortemente vinculados ao produto.
- **Sinais de categoria-interchangeável:** Os 4 achados do detector (borda lateral grossa, easing bounce, grade decorativa) são padrões de UI gerada por IA que aparecem em produtos não relacionados.
- **Oportunidade perdida:** A paleta vermelha/preta da carne churrasco não é explorada como sistema de tokens.

---

## Heurísticas de Nielsen (Resumo)

| # | Heurística | Score | Observação |
|---|------------|-------|------------|
| 1 | Visibilidade do status do sistema | 3 | Feedback de carregamento e cálculo da calculadora presente |
| 2 | Correspondência com o mundo real | 3 | Linguagem do varejo (custo, frete, margem, mix) |
| 3 | Controle e liberdade do usuário | 2 | Botão "Limpar" na calculadora; sem undo claro em fluxos |
| 4 | Consistência e padrões | 2 | Componentes de UI consistentes, mas cores hard-coded quebram consistência visual |
| 5 | Prevenção de erros | 3 | Validação de campos na calculadora com mensagens claras |
| 6 | Reconhecimento antes de recordação | 3 | Ícones com rótulos de texto no header |
| 7 | Flexibilidade e eficiência | 1 | Sem atalhos de teclado, sem favoritos recentes |
| 8 | Estética e design minimalista | 2 | Boa hierarquia, mas grade decorativa e bordas laterais adicionam ruído |
| 9 | Reconhecer, diagnosticar e recuperar erros | 3 | Erros de preço exibidos com sugestão de correção |
| 10 | Ajuda e documentação | 2 | Link Sebrae na calculadora; sem ajuda contextual no restante |
| **Total** | | **23/40** | **Aceitável — melhorias necessárias** |

---

## Red Flags por Persona

**Jordan (Primeiro uso):** A home exibe 21 parceiros de uma vez, sem hierarquia clara de quem são os mais relevantes. O primeiro passo não é imediatamente óbvio entre "Ver catálogos", "Fazer pedido" e "Solicitar acesso". Risco de abandono nos primeiros 5 segundos.

**Alex (Power user):** Sem atalhos de teclado. A navegação exige cliques em múltiplos níveis para chegar aos catálogos ou à calculadora. Sem ação em lote.

**Sam (Acessibilidade):** Logo sem `alt` descritivo; foco de teclado não visível; cores hard-coded sem contraste garantido em modo escuro (não há modo escuro).

**Casey (Mobile, distraído):** Ações principais estão no header (topo da tela), fora da zona do polegar. Estado não é preservado se o usuário muda de aba no meio de um cálculo.

---

## O que está Funcionando (Positivo)

1. **Calculadora de preço:** interface de Operate bem executada, validação em tempo real, `aria-live="polite"` no resultado, breakdown claro. A lógica de `calculatePricing` é sofisticada (BigInt, arredondamento half-up) — só precisa de testes.
2. **Respeito a `prefers-reduced-motion`:** tanto `HomeMotion` quanto `PresenceBackground` pausam corretamente.
3. **Cópia autoral:** tom de voz específico do varejo de Pernambuco e seção churrasco — não é genérico.
4. **Imagens otimizadas:** `loading="lazy"`, `fetchPriority="high"`, `srcSet` responsivo, WebP usado.

---

## Plano de Ação (prioridade)

Se quiser executar, recomendar nesta ordem:

1. **[P0] `/impeccable harden`** — corrigir validação de CNPJ; adicionar testes unitários para `calculatePricing`; configurar `next.config.ts` (images, headers, output); travar dependência `vinext` ou migrar build; corrigir placeholder de banco de dados.
2. **[P0] `/impeccable harden`** — consertar formulário de atendimento: envio real, confirmação ao usuário, persistência de lead, não depender apenas do WhatsApp.
3. **[P1] `/impeccable clarify`** — preencher `alt` descritivo nos logos; adicionar aviso visual em links `target="_blank"`.
4. **[P1] `/impeccable adapt`** — foco de teclado visível (`:focus-visible`) na nav e botões.
5. **[P1] `/impeccable colorize`** — extrair cores hard-coded para tokens CSS.
6. **[P1] `/impeccable animate`** — substituir easing elástico por decaimento suave (`ease-out-quart/quint`).
7. **[P1] `/impeccable distill`** — remover grade decorativa e bordas laterais grossas (slop).
8. **[P2] `/impeccable layout`** — modularizar CSS global; agrupar parceiros da home; adicionar Error Boundary; configurar sitemap/robots.txt; adicionar JSON-LD.

---

## Como Consultar Este Documento

Este arquivo fica em `docs/auditoria-impeccable-site-arco.md` no repositório `Replinkrub/Site-ArcoRep`. Em sessões futuras, o Atlas ou qualquer agente pode lê-lo para entender os débitos técnicos e de UX do site antes de planejar novas entregas.
