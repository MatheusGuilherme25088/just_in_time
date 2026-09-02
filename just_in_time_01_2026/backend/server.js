require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'just-in-time-chave-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 }
}));

app.use(express.static(path.join(__dirname, '..', 'frontend')));

function autenticado(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: 'Usuário não autenticado.' });
  }
  next();
}

app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe email e senha.' });
    }

    const [rows] = await pool.query(
      'SELECT id, nome, email, senha FROM usuario WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Email ou senha inválidos.' });
    }

    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    };

    res.json({ mensagem: 'Login realizado com sucesso.', usuario: req.session.usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno ao realizar login.' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ mensagem: 'Logout realizado com sucesso.' });
  });
});

app.get('/api/sessao', (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ autenticado: false });
  }
  res.json({ autenticado: true, usuario: req.session.usuario });
});

app.get('/api/produtos', autenticado, async (req, res) => {
  try {
    const busca = (req.query.busca || '').trim();
    let sql = `SELECT id, nome, descricao, custo, quantidade_estoque, estoque_minimo
               FROM produto`;
    const params = [];

    if (busca) {
      sql += ' WHERE nome LIKE ? OR descricao LIKE ?';
      params.push(`%${busca}%`, `%${busca}%`);
    }

    sql += ' ORDER BY nome ASC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar produtos.' });
  }
});

function validarProduto(body) {
  const { nome, descricao, custo, quantidade_estoque, estoque_minimo } = body;
  if (!nome?.trim() || !descricao?.trim()) return 'Nome e descrição são obrigatórios.';
  if (custo === '' || Number(custo) < 0 || !Number.isFinite(Number(custo))) return 'Custo inválido.';
  if (quantidade_estoque === '' || !Number.isInteger(Number(quantidade_estoque)) || Number(quantidade_estoque) < 0) return 'Quantidade em estoque inválida.';
  if (estoque_minimo === '' || !Number.isInteger(Number(estoque_minimo)) || Number(estoque_minimo) < 0) return 'Estoque mínimo inválido.';
  return null;
}

app.post('/api/produtos', autenticado, async (req, res) => {
  try {
    const erro = validarProduto(req.body);
    if (erro) return res.status(400).json({ erro });

    const { nome, descricao, custo, quantidade_estoque, estoque_minimo } = req.body;
    const [result] = await pool.query(
      `INSERT INTO produto (nome, descricao, custo, quantidade_estoque, estoque_minimo)
       VALUES (?, ?, ?, ?, ?)`,
      [nome.trim(), descricao.trim(), Number(custo), Number(quantidade_estoque), Number(estoque_minimo)]
    );
    res.status(201).json({ id: result.insertId, mensagem: 'Produto cadastrado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar produto.' });
  }
});

app.put('/api/produtos/:id', autenticado, async (req, res) => {
  try {
    const erro = validarProduto(req.body);
    if (erro) return res.status(400).json({ erro });

    const { nome, descricao, custo, quantidade_estoque, estoque_minimo } = req.body;
    const [result] = await pool.query(
      `UPDATE produto
       SET nome=?, descricao=?, custo=?, quantidade_estoque=?, estoque_minimo=?
       WHERE id=?`,
      [nome.trim(), descricao.trim(), Number(custo), Number(quantidade_estoque), Number(estoque_minimo), req.params.id]
    );

    if (!result.affectedRows) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json({ mensagem: 'Produto atualizado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar produto.' });
  }
});

app.delete('/api/produtos/:id', autenticado, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM produto WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json({ mensagem: 'Produto excluído com sucesso.' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ erro: 'Não é possível excluir um produto que possui movimentações registradas.' });
    }
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir produto.' });
  }
});

app.get('/api/producao', autenticado, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pr.id, pr.produto_id, p.nome AS produto, u.nome AS usuario,
             pr.tipo, pr.quantidade, pr.data_movimentacao
      FROM producao pr
      INNER JOIN produto p ON p.id = pr.produto_id
      INNER JOIN usuario u ON u.id = pr.usuario_id
      ORDER BY pr.data_movimentacao DESC, pr.id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar movimentações.' });
  }
});

app.post('/api/producao', autenticado, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { produto_id, tipo, quantidade, data_movimentacao } = req.body;
    const qtd = Number(quantidade);

    if (!produto_id || !['FABRICADO', 'PEDIDO'].includes(tipo)) {
      return res.status(400).json({ erro: 'Produto e tipo de movimentação são obrigatórios.' });
    }
    if (!Number.isInteger(qtd) || qtd <= 0) {
      return res.status(400).json({ erro: 'A quantidade deve ser um número inteiro maior que zero.' });
    }
    if (!data_movimentacao) {
      return res.status(400).json({ erro: 'Informe a data da movimentação.' });
    }

    await connection.beginTransaction();

    const [produtos] = await connection.query(
      'SELECT id, nome, quantidade_estoque, estoque_minimo FROM produto WHERE id=? FOR UPDATE',
      [produto_id]
    );

    if (!produtos.length) {
      await connection.rollback();
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    const produto = produtos[0];
    let novoEstoque = produto.quantidade_estoque;

    if (tipo === 'FABRICADO') {
      novoEstoque += qtd;
    } else {
      if (qtd > produto.quantidade_estoque) {
        await connection.rollback();
        return res.status(400).json({ erro: 'Estoque insuficiente para realizar o pedido.' });
      }
      novoEstoque -= qtd;
    }

    await connection.query(
      'UPDATE produto SET quantidade_estoque=? WHERE id=?',
      [novoEstoque, produto_id]
    );

    await connection.query(
      `INSERT INTO producao (produto_id, usuario_id, tipo, quantidade, data_movimentacao)
       VALUES (?, ?, ?, ?, ?)`,
      [produto_id, req.session.usuario.id, tipo, qtd, data_movimentacao]
    );

    await connection.commit();

    const estoqueAbaixo = tipo === 'PEDIDO' && novoEstoque < produto.estoque_minimo;

    res.status(201).json({
      mensagem: tipo === 'FABRICADO' ? 'Produção registrada com sucesso.' : 'Pedido registrado com sucesso.',
      novoEstoque,
      estoqueAbaixo,
      estoqueMinimo: produto.estoque_minimo,
      produto: produto.nome
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ erro: 'Erro ao registrar movimentação.' });
  } finally {
    connection.release();
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.listen(PORT, () => {
  console.log(`Sistema Just in Time rodando em http://localhost:${PORT}`);
});
