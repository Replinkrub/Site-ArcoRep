# Site ARCO — exportação do código-fonte

Versão 65. Exportado em 09/11/2026 diretamente do repositório de origem do Site ARCO.
Última alteração do código: 05/11/2026, às 09h41 (horário de Brasília).
Commit: `bc8683f205a9089e8b300335a7c11fdd67bd0e9b`.
Site: https://arco-representacoes.antonioaquino.chatgpt.site

## Conteúdo

O pacote contém o código completo versionado, os assets locais, sete catálogos PDF, vídeo, imagens, configurações, dependências declaradas e lockfile, esquema e migrações do banco e scripts de verificação existentes.

Inclui a home, páginas das representadas, catálogo com filtros, atendimento, gravação e consulta de leads, exportação CSV administrativa e calculadora. Nenhum código de aplicação foi alterado nesta exportação.

O arquivo `EXPORTACAO-ARCO.json` registra a origem e o SHA-256 de cada arquivo original incluído. O único arquivo versionado omitido é `tsconfig.tsbuildinfo`, cache gerado pelo TypeScript.

## Para atualizar o GitHub manualmente

1. Extraia o ZIP.
2. Abra a pasta `Site_ARCO_v65`.
3. No repositório `Replinkrub/Site-ArcoRep`, crie uma branch para revisar a atualização.
4. Envie o conteúdo dessa pasta para a raiz da branch. As pastas `app`, `components`, `public`, `scripts` e os arquivos `package.json` e `package-lock.json` devem ficar na raiz. Não envie apenas o ZIP nem crie outra pasta `Site_ARCO_v65` dentro do repositório. Inclua também os arquivos cujo nome começa com ponto.
5. Confira as diferenças antes de abrir ou integrar um Pull Request. A exportação não compara nem remove automaticamente arquivos antigos existentes no GitHub.

## Uso local

Requer Node.js 22.13.0 ou superior, conforme `package.json`. A partir da pasta do projeto:

```sh
npm ci
npm run dev
```

O projeto usa Vinext, React e Cloudflare Workers. O primeiro comando instala as dependências; `node_modules` não acompanha o ZIP. Um checkout novo usa automaticamente o perfil portátil.

Verificações já existentes no projeto, disponíveis após instalar as dependências:

```sh
node scripts/check-contact-flow.mjs
node scripts/check-pricing.mjs
node scripts/check-discovery.mjs
node scripts/check-presence.mjs
npm run lint
npm run build
```

Nesta exportação foram conferidos a origem, a correspondência com a versão 65, o inventário de arquivos, a integridade do ZIP e os hashes do conteúdo, além de uma busca por padrões de credenciais. As dependências não foram instaladas e os testes funcionais, lint e build não foram executados novamente.

## Configuração e dados de produção

A aplicação usa o binding `DB` do Cloudflare D1 para contatos e o fluxo de login do ChatGPT fornecido pela hospedagem Sites. A autorização administrativa usa a variável `ARCO_ADMIN_EMAIL`; seu valor de produção não foi exportado.

Os schemas e as migrações estão incluídos. O banco de produção, os contatos/leads reais, as credenciais, as sessões de login e os valores das variáveis de ambiente não fazem parte do ZIP. Também não foram incluídos o histórico `.git`, caches locais ou dependências instaladas.

Subir os arquivos no GitHub armazena o código. Executar os fluxos com banco e autenticação em outra hospedagem exige configurar ou adaptar esses serviços. Esta exportação não altera a publicação atual nem o repositório GitHub.
