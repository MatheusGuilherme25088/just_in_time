# ENTREGA 01 — Lista de Requisitos Funcionais

## RF01 — Interface de autenticação
- **RF01.1** — Solicitar e-mail e senha.
- **RF01.2** — Validar as credenciais informadas com os dados cadastrados no banco.
- **RF01.3** — Criar sessão para o usuário autenticado.
- **RF01.4** — Informar erro quando o e-mail ou senha forem inválidos.
- **RF01.5** — Redirecionar o usuário autenticado para a interface principal.

## RF02 — Interface principal
- **RF02.1** — Exibir o nome do usuário autenticado.
- **RF02.2** — Disponibilizar acesso ao cadastro de produtos.
- **RF02.3** — Disponibilizar acesso à gestão de produção.
- **RF02.4** — Permitir logout e redirecionar para o login.

## RF03 — Cadastro de produto
- **RF03.1** — Listar automaticamente os produtos cadastrados em tabela.
- **RF03.2** — Exibir nome, descrição, custo, estoque e estoque mínimo.
- **RF03.3** — Permitir buscar produtos por nome ou descrição.
- **RF03.4** — Permitir cadastrar novo produto.
- **RF03.5** — Permitir editar produto existente.
- **RF03.6** — Permitir excluir produto existente.
- **RF03.7** — Validar campos obrigatórios e valores numéricos.
- **RF03.8** — Permitir retornar à interface principal.

## RF04 — Gestão de produção
- **RF04.1** — Listar produtos em ordem alfabética.
- **RF04.2** — Permitir selecionar o produto movimentado.
- **RF04.3** — Permitir selecionar movimentação FABRICADO (entrada) ou PEDIDO (saída).
- **RF04.4** — Permitir informar a data da movimentação.
- **RF04.5** — Permitir informar a quantidade movimentada.
- **RF04.6** — Aumentar o estoque ao registrar FABRICADO.
- **RF04.7** — Diminuir o estoque ao registrar PEDIDO.
- **RF04.8** — Impedir saída superior ao estoque disponível.
- **RF04.9** — Verificar automaticamente o estoque mínimo após uma saída.
- **RF04.10** — Exibir alerta quando o estoque ficar abaixo do mínimo.
- **RF04.11** — Registrar usuário responsável, tipo, quantidade e data da movimentação.
