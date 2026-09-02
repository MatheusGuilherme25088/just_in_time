DROP DATABASE IF EXISTS preparacao_db;
CREATE DATABASE preparacao_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE preparacao_db;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    custo DECIMAL(10,2) NOT NULL,
    quantidade_estoque INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 0,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_custo CHECK (custo >= 0),
    CONSTRAINT chk_estoque CHECK (quantidade_estoque >= 0),
    CONSTRAINT chk_minimo CHECK (estoque_minimo >= 0)
);

CREATE TABLE producao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo ENUM('FABRICADO','PEDIDO') NOT NULL,
    quantidade INT NOT NULL,
    data_movimentacao DATE NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_producao_produto FOREIGN KEY (produto_id) REFERENCES produto(id),
    CONSTRAINT fk_producao_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    CONSTRAINT chk_quantidade CHECK (quantidade > 0)
);

-- Senha dos usuários de teste: 123456
-- Hash bcrypt correspondente.
INSERT INTO usuario (nome, email, senha) VALUES
('Administrador', 'admin@justintime.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('João Silva', 'joao@justintime.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Maria Souza', 'maria@justintime.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

INSERT INTO produto (nome, descricao, custo, quantidade_estoque, estoque_minimo) VALUES
('Nicho MDF', 'Nicho decorativo de MDF', 25.90, 18, 5),
('Prateleira MDF', 'Prateleira de parede em MDF', 39.90, 12, 4),
('Organizador MDF', 'Organizador de mesa em MDF', 32.50, 8, 3);

INSERT INTO producao (produto_id, usuario_id, tipo, quantidade, data_movimentacao) VALUES
(1, 1, 'FABRICADO', 20, '2026-09-01'),
(2, 2, 'PEDIDO', 3, '2026-09-01'),
(3, 3, 'FABRICADO', 10, '2026-09-02');
