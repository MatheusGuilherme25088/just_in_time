const table = document.getElementById('productTable');
const form = document.getElementById('productForm');
const message = document.getElementById('productMessage');
let produtos = [];

function moeda(v) {
  return Number(v).toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
}

async function carregarProdutos(busca='') {
  const response = await fetch('/api/produtos?busca=' + encodeURIComponent(busca));
  if (!response.ok) return;
  produtos = await response.json();
  table.innerHTML = produtos.map(p => `
    <tr>
      <td><strong>${escapeHtml(p.nome)}</strong></td>
      <td>${escapeHtml(p.descricao)}</td>
      <td>${moeda(p.custo)}</td>
      <td>${p.quantidade_estoque}</td>
      <td>${p.estoque_minimo}</td>
      <td>
        <button class="action-btn" onclick="editarProduto(${p.id})">Editar</button>
        <button class="action-btn delete" onclick="excluirProduto(${p.id})">Excluir</button>
      </td>
    </tr>`).join('');
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function limparFormulario() {
  form.reset();
  document.getElementById('productId').value = '';
  document.getElementById('formTitle').textContent = 'Novo produto';
  document.getElementById('cancelBtn').classList.add('hidden');
}

window.editarProduto = (id) => {
  const p = produtos.find(x => x.id === id);
  if (!p) return;
  document.getElementById('productId').value = p.id;
  document.getElementById('nome').value = p.nome;
  document.getElementById('descricao').value = p.descricao;
  document.getElementById('custo').value = p.custo;
  document.getElementById('quantidade_estoque').value = p.quantidade_estoque;
  document.getElementById('estoque_minimo').value = p.estoque_minimo;
  document.getElementById('formTitle').textContent = 'Editar produto';
  document.getElementById('cancelBtn').classList.remove('hidden');
  window.scrollTo({top:document.body.scrollHeight, behavior:'smooth'});
};

window.excluirProduto = async (id) => {
  if (!confirm('Deseja realmente excluir este produto?')) return;
  const response = await fetch('/api/produtos/' + id, {method:'DELETE'});
  const data = await response.json();
  message.textContent = data.mensagem || data.erro;
  message.className = 'message ' + (response.ok ? 'success' : 'error');
  if (response.ok) carregarProdutos(document.getElementById('searchInput').value);
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const body = {
    nome: document.getElementById('nome').value,
    descricao: document.getElementById('descricao').value,
    custo: document.getElementById('custo').value,
    quantidade_estoque: document.getElementById('quantidade_estoque').value,
    estoque_minimo: document.getElementById('estoque_minimo').value
  };

  const response = await fetch(id ? '/api/produtos/' + id : '/api/produtos', {
    method: id ? 'PUT' : 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  const data = await response.json();
  message.textContent = data.mensagem || data.erro;
  message.className = 'message ' + (response.ok ? 'success' : 'error');

  if (response.ok) {
    limparFormulario();
    carregarProdutos(document.getElementById('searchInput').value);
  }
});

document.getElementById('cancelBtn').addEventListener('click', limparFormulario);
document.getElementById('searchBtn').addEventListener('click', () => carregarProdutos(document.getElementById('searchInput').value));
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') carregarProdutos(e.target.value);
});
carregarProdutos();
