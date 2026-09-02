# ENTREGA 08 — Casos de Teste de Software

## Ferramentas e ambiente
- Sistema operacional: Windows 11 64 bits
- Navegador: Google Chrome
- Backend: Node.js 22+
- Banco: MySQL 8+
- Testes de API: Insomnia
- Editor: Visual Studio Code

## CT01 — RF01.1
**Descrição:** verificar campos de e-mail e senha.  
**Pré-condição:** sistema acessível.  
**Passos:** acessar login; verificar campos.  
**Resultado esperado:** e-mail e senha visíveis.

## CT02 — RF01.2
**Descrição:** validar login correto.  
**Pré-condição:** usuário cadastrado.  
**Passos:** informar `admin@justintime.com` e `123456`; clicar Entrar.  
**Resultado esperado:** login aceito e sessão criada.

## CT03 — RF01.4
**Descrição:** testar credenciais inválidas.  
**Passos:** informar senha incorreta; clicar Entrar.  
**Resultado esperado:** mensagem de erro e permanência na tela de login.

## CT04 — RF02.1
**Descrição:** verificar nome do usuário.  
**Passos:** realizar login; abrir painel.  
**Resultado esperado:** nome do usuário aparece no topo.

## CT05 — RF02.2/RF02.3
**Descrição:** verificar navegação.  
**Passos:** clicar Cadastro de Produtos; voltar; clicar Gestão de Produção.  
**Resultado esperado:** interfaces correspondentes são abertas.

## CT06 — RF02.4
**Descrição:** testar logout.  
**Passos:** clicar Sair.  
**Resultado esperado:** sessão encerrada e redirecionamento ao login.

## CT07 — RF03.1
**Descrição:** listar produtos automaticamente.  
**Passos:** abrir cadastro de produtos.  
**Resultado esperado:** tabela preenchida sem cadastro manual.

## CT08 — RF03.3
**Descrição:** buscar produto.  
**Passos:** informar parte do nome e clicar Buscar.  
**Resultado esperado:** tabela apresenta apenas registros correspondentes.

## CT09 — RF03.4
**Descrição:** cadastrar produto.  
**Passos:** preencher campos válidos e salvar.  
**Resultado esperado:** produto aparece na tabela e no banco.

## CT10 — RF03.5
**Descrição:** editar produto.  
**Passos:** clicar Editar; alterar dados; salvar.  
**Resultado esperado:** dados atualizados no banco e tabela.

## CT11 — RF03.6
**Descrição:** excluir produto sem movimentação.  
**Passos:** clicar Excluir e confirmar.  
**Resultado esperado:** produto removido.

## CT12 — RF03.7
**Descrição:** validar cadastro.  
**Passos:** deixar nome vazio ou informar número inválido.  
**Resultado esperado:** sistema rejeita os dados e informa o erro.

## CT13 — RF04.1
**Descrição:** verificar ordenação.  
**Passos:** abrir Gestão de Produção.  
**Resultado esperado:** produtos aparecem em ordem alfabética.

## CT14 — RF04.3/RF04.6
**Descrição:** registrar fabricação.  
**Passos:** selecionar produto; FABRICADO; quantidade; data; registrar.  
**Resultado esperado:** estoque aumenta e movimentação é registrada.

## CT15 — RF04.3/RF04.7
**Descrição:** registrar pedido.  
**Passos:** selecionar produto; PEDIDO; quantidade; data; registrar.  
**Resultado esperado:** estoque diminui e movimentação é registrada.

## CT16 — RF04.8
**Descrição:** impedir estoque negativo.  
**Passos:** fazer pedido maior que o estoque.  
**Resultado esperado:** operação recusada.

## CT17 — RF04.9/RF04.10
**Descrição:** testar estoque mínimo.  
**Passos:** realizar pedido que deixe estoque abaixo do mínimo.  
**Resultado esperado:** sistema atualiza o estoque e apresenta alerta.

## CT18 — RF04.11
**Descrição:** verificar auditoria da movimentação.  
**Passos:** registrar movimentação; consultar histórico.  
**Resultado esperado:** produto, usuário, tipo, quantidade e data aparecem.

## Registro de execução
| CT | Status | Observação |
|---|---|---|
| CT01 | Pendente de execução | Executar no ambiente local |
| CT02 | Pendente de execução | Executar no ambiente local |
| CT03 | Pendente de execução | Executar no ambiente local |
| CT04 | Pendente de execução | Executar no ambiente local |
| CT05 | Pendente de execução | Executar no ambiente local |
| CT06 | Pendente de execução | Executar no ambiente local |
| CT07 | Pendente de execução | Executar no ambiente local |
| CT08 | Pendente de execução | Executar no ambiente local |
| CT09 | Pendente de execução | Executar no ambiente local |
| CT10 | Pendente de execução | Executar no ambiente local |
| CT11 | Pendente de execução | Executar no ambiente local |
| CT12 | Pendente de execução | Executar no ambiente local |
| CT13 | Pendente de execução | Executar no ambiente local |
| CT14 | Pendente de execução | Executar no ambiente local |
| CT15 | Pendente de execução | Executar no ambiente local |
| CT16 | Pendente de execução | Executar no ambiente local |
| CT17 | Pendente de execução | Executar no ambiente local |
| CT18 | Pendente de execução | Executar no ambiente local |
