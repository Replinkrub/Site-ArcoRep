# Calculadora de precificação ARCO

Rota pública: `/calculadora`. O cálculo acontece no navegador, sem cadastro, armazenamento dos valores, API de IA ou alteração de dados comerciais.

## Regras

- Aquisição, frete em reais e outros custos são informados por unidade. Dividir custos da caixa/lote pela quantidade antes de preencher.
- Aquisição deve representar o custo efetivo, incluindo custos/impostos da compra aplicáveis ainda não separados. O frete informado em seu próprio campo não deve ser repetido na aquisição.
- Frete aceita reais por unidade **ou** percentual sobre aquisição, sem somar as duas modalidades. A mudança de modalidade zera o frete para evitar reinterpretar um valor como outra unidade.
- Impostos e despesas percentuais incidem sobre o preço de venda. As alíquotas são informadas pelo lojista; não há cálculo de regime tributário.
- A margem desejada é a margem de contribuição: parcela da venda após mercadoria, frete, outros custos variáveis, impostos e despesas da venda. A sobra cobre despesas fixas e, depois delas, o lucro líquido.
- Custo total = aquisição + frete + outros custos por unidade.
- Preço-base = custo total / (1 − impostos − despesas percentuais − margem desejada), com taxas em frações de 1.
- Impostos + despesas percentuais + margem precisam somar menos de 100%. Entradas inválidas bloqueiam o resultado e removem o preço anterior.
- Dinheiro usa centavos inteiros; percentuais usam centésimos de ponto percentual. Operações financeiras e comparação da margem usam `BigInt`.
- Frete percentual, impostos e despesas são arredondados individualmente para centavos, com metade arredondada para cima. O preço-base é arredondado para cima; quando necessário, sobe mais centavos até a contribuição efetiva atingir a meta. São estimativas por unidade; arredondamento agregado de uma operação pode variar.
- Taxas/custos opcionais vazios equivalem a zero. Aquisição e margem são obrigatórios; margem zero é permitida. Não há meta comercial nem taxa tributária sugerida por padrão.
- Markup apresentado como acréscimo percentual sobre o custo total; não equivale à margem sobre a venda.
- Limites: até R$ 1.000.000,00 em cada custo monetário, até 100% em cada taxa sobre a venda/margem (sujeitas à soma), até 1.000% no frete sobre aquisição. O parser aceita vírgula brasileira, ponto decimal sem agrupamento e agrupamento brasileiro (`1.234,56`).

## Exemplo e verificação

Exemplo ilustrativo: aquisição R$ 10,00, frete R$ 1,00, impostos 5%, despesas 3%, margem 30%. Preço R$ 17,75; impostos R$ 0,89; despesas R$ 0,53; contribuição R$ 5,33; margem efetiva aproximadamente 30,03%.

`node scripts/check-pricing.mjs` testa o motor real, formatos, exemplos, soma de 100%, entradas inválidas, centavos, limite e 1.500 casos variados. Inclui uma situação em que R$ 191,67 precisa subir a R$ 191,68 para cumprir a margem após arredondar duas taxas. `node scripts/check-contact-flow.mjs` verifica os fluxos comerciais anteriores em banco temporário.

Base conceitual: [Sebrae — Como calcular a margem de contribuição](https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/E809A7FF3D9553E90325714700620C06/$File/NT00031FEA.pdf). As alíquotas históricas do material não são usadas pela ferramenta.

A calculadora adiciona somente a rota e links no menu/rodapé. Home, catálogo, Mercos, formulários, contatos, permissões, banco, dependências e infraestrutura são preservados. A chamada comercial após um resultado leva aos catálogos existentes.
