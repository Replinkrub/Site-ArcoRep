# Catálogos e contatos comerciais

- A vitrine é pública. A pergunta de cliente acontece ao abrir um catálogo.
- A resposta “já sou cliente” é uma autodeclaração, não autenticação de cadastro.
- A preferência do navegador dura 90 dias e não contém dados de contato.
- O formulário curto salva nome, WhatsApp, empresa, cidade/UF, segmento, marca, observação opcional e data no D1. Não exige CNPJ.
- Após salvar, o visitante recebe confirmação e pode abrir uma mensagem no WhatsApp com a marca e os dados já preenchidos. O contato permanece no D1 mesmo se ele não abrir ou não enviar a mensagem. A opção de cadastro comercial permanece no Mercos.
- Os dados preenchidos no catálogo permanecem somente na memória da página para orientar a conversa e consultar outras marcas nessa visita. Recarregar a página remove esses dados do navegador; a preferência de acesso continua sem informações pessoais.
- O atendimento salva a demanda completa antes de abrir o WhatsApp. Enviar a mensagem no WhatsApp continua sendo uma ação do visitante.
- A API valida os campos no servidor, exige origem do próprio site, limita o corpo a 8 KiB e impede duplicidade por ID de solicitação. Pedidos excessivos do mesmo IP recebem uma resposta temporária; o IP fica armazenado somente como hash.
- O painel `/comercial/contatos` e a exportação `/api/contatos/exportar` usam a identidade encaminhada pela plataforma e uma lista restrita definida pela variável secreta `ARCO_ADMIN_EMAIL`. Sem configuração ou sem a conta permitida, o acesso é negado. O painel exige entrada com ChatGPT; não usa senha própria.
- A exportação inclui os 10.000 contatos mais recentes, em CSV com UTF-8 e separador `;`. Campos são escapados e fórmulas de planilha são neutralizadas. APIs privadas respondem com `no-store`.

## Origem dos contatos

A Home e a navegação priorizam conhecer produtos; clientes atuais mantêm acesso direto ao Mercos. As rotas, os PDFs e a regra de acesso dos catálogos continuam iguais.

A primeira entrada na aba é lembrada por até 24 horas e acompanha os dois formulários. O navegador guarda somente caminho da página (sem consulta), domínio externo de referência e os parâmetros `utm_source`, `utm_medium` e `utm_campaign`. Nenhum nome, telefone ou CNPJ é incluído nessa preferência. Falhas no armazenamento do navegador usam a entrada atual e não bloqueiam o contato.

Os cinco campos novos são opcionais no envio e anuláveis no D1. Os registros existentes permanecem intactos. A migração `0001_freezing_ultimo.sql` somente acrescenta colunas; a versão anterior do site continua compatível com a tabela ampliada.

O campo `source` continua significando o formulário utilizado, não o canal de marketing. O painel mostra origem não identificada quando não há parâmetro de campanha nem domínio de referência. Não atribuímos esses casos automaticamente a tráfego direto. As cinco colunas de atribuição são acrescentadas depois das colunas originais do CSV.

Contato salvo, conversa enviada, oportunidade qualificada e pedido realizado são resultados distintos. A qualificação e o pedido devem ser confirmados pela equipe comercial; esta entrega não presume esses resultados nem contabiliza visitas ou abandono de formulário.

## Representadas e mercados

`/catalogos` continua mostrando todas as marcas por padrão, sem passagem obrigatória por uma landing page. A busca e as categorias permanecem na vitrine; filtros adicionais por marca e mercado ficam em um painel expansível. Links com `marca` ou `mercado` válidos abrem a seleção correspondente e oferecem a opção de voltar a todos os catálogos. Valores desconhecidos são ignorados.

`/representadas` reúne as seis marcas e `/representadas/[slug]` apresenta as linhas, aplicações e orientação comercial de cada uma. Os botões de catálogo abrem o mesmo diálogo usado na vitrine, inclusive os dois arquivos da ArtMill. Todas as páginas mantêm um link direto para todos os catálogos e acesso ao Mercos. Marcas inexistentes respondem com página não encontrada.

Os mercados da Home abrem catálogos relacionados, sem criar outra etapa obrigatória. `lib/brand-pages.ts` concentra conteúdo e relações entre marcas e mercados; os PDFs, nomes e imagens continuam vindo de `lib/catalog-data.ts`. Os links de atendimento podem preencher marca e tipo de empresa, sempre editáveis pelo visitante. O tipo de empresa também é preservado no formulário de catálogo quando a navegação vem de um mercado.

A preferência anônima de acesso é compartilhada entre vitrine e páginas de representadas. Não são acrescentados dados pessoais ao armazenamento do navegador. Captura, registro da primeira entrada, painel comercial e exportação preservam o fluxo existente, sem novas tabelas ou migrações.

## Arquivos publicados

Os sete PDFs são ativos estáticos, não carregados na abertura da página. Os nomes incluem o hash do conteúdo para evitar conflito de cache nas atualizações. Os originais no Drive continuam intactos. A vitrine controla o fluxo de captação; os PDFs continuam públicos e compartilháveis por URL.

`catalog-assets.json` registra o arquivo de origem, os hashes e os tamanhos publicados. Cinco PDFs mantêm os bytes originais; as cópias da ArtMill foram reduzidas preservando a orientação, a quantidade de páginas e os links. O catálogo de acessórios usa imagens a 180 dpi; textos e elementos vetoriais permanecem no PDF. O catálogo de pits foi regravado sem reduzir a resolução das imagens.

Para atualizar: recuperar o novo original, validar todas as páginas e links, manter cada arquivo abaixo de 25 MiB, gerar um novo nome com hash e atualizar `lib/catalog-data.ts` e o registro de ativos. A publicação aplica as migrações D1 antes de enviar o Worker; migrações já aplicadas não devem ser reescritas.
