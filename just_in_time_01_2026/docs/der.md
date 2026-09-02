# ENTREGA 02 — DER

## Entidades

### USUARIO
- id_usuario
- nome
- email
- senha
- criado_em

### PRODUTO
- id_produto
- nome
- descricao
- custo
- quantidade_estoque
- estoque_minimo
- criado_em

### PRODUCAO
- id_producao
- produto_id (FK)
- usuario_id (FK)
- tipo
- quantidade
- data_movimentacao
- criado_em

## Relacionamentos
- USUARIO 1:N PRODUCAO
- PRODUTO 1:N PRODUCAO

O registro de PRODUCAO pertence obrigatoriamente a um USUARIO e a um PRODUTO.
