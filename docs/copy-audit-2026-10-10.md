# Aplicação da auditoria de copy — 10/10/2026

Base: auditoria da versão 60, aprovada para aplicação. Escopo: textos das seis páginas públicas, navegação, rodapé, formulários e estado vazio dos contatos internos.

## Aplicado

- IN01–IN02: rótulos correspondentes aos destinos existentes; fechamento inclui primeiro pedido, novas linhas e reposição.
- IN03–IN05: acompanhamento descrito pelo histórico de pedidos; exposição como orientação; registros de lojas apresentados como trajetória. Números preservados como base comercial e portfólio, sem alegar clientes ativos ou pronta entrega.
- QS01–QS04: apresentação pelo benefício ao lojista, distinção entre acesso e solicitação de acesso, fechamento para lojas e prova de atuação mais direta.
- CA01–CA05: revenda e uso na operação, dados necessários antes do acesso, iniciativa do visitante no WhatsApp, confirmação de condições antes do fechamento e carregamento com rótulo correto.
- FAQ01 e FAQ04: escolha e orientação antes da solicitação de acesso; atalhos para orientação e acesso; instrução do catálogo objetiva, sem promessa de rapidez.
- AT01–AT05: utilidade do atendimento, CNPJ obrigatório explícito, acesso de compra, descrição neutra da necessidade e erros compreensíveis. Erros de validação do servidor nomeiam os campos a revisar no aviso; falhas técnicas orientam nova tentativa. Não se anunciam marcações de campo que não existem.
- PC01–PC06: preço calculado, margem de contribuição explicada junto ao percentual, sobra antes das despesas fixas, custos aplicáveis e exemplo de entrada numérica. Fórmulas e validações numéricas preservadas.
- GL01–GL03: atendimento descrito como formulário seguido de WhatsApp; rótulos de acesso padronizados; calculadora de preço no menu móvel, rodapé e nomes acessíveis. No cabeçalho de desktop, textos compactos conservam o significado nos nomes acessíveis.
- INT01: estado vazio descreve contatos salvos.
- Cards: Cantagallo explicita revenda; ArtMill elimina instrução repetida; demais descrições mantidas. Metadados de Catálogos e Atendimento alinhados ao conteúdo.

## Dependências comerciais mantidas

- FAQ02: a nova pergunta sobre quem fatura e entrega não foi publicada. A resposta exige confirmação por representada e do tratamento de pedidos de várias marcas. O texto sobre o Mercos orienta a confirmar as marcas disponíveis para a empresa.
- FAQ03: as condições continuam sendo consultadas por marca, valor e destino. Não foram incluídos mínimos, fretes, prazos ou regras de crédito sem uma fonte vigente e um responsável por atualização.
- Não foram acrescentadas promessas de retorno automático, prazo de atendimento, instalação, assistência ou resultados comerciais. As descrições dos números de base e portfólio mantêm o enquadramento aprovado, sem nova consulta à carteira.

## Verificação

Revisar o diff, executar a checagem de tipos e os scripts existentes de contatos e precificação; gerar o build de produção antes de publicar. Os testes de contatos usam SQLite temporário e requisições locais simuladas, sem dados de produção.
