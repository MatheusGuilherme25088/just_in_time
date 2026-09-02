const productSelect = document.getElementById('produto');
const productionForm = document.getElementById('productionForm');
const productionMessage = document.getElementById('productionMessage');
const productionTable = document.getElementById('productionTable');

document.getElementById('data_movimentacao').value = new Date().toISOString().slice(0,10);

async function carregarProdutos() {
  const response = await fetch('/api/produtos');
  if (!response.ok) return;
  const produtos = await response.json();
  // A API já retorna em ordem alfabética; a ordenação também é feita aqui para evidenciar o requisito.
  produtos.sort((a,b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  productSelect.innerHTML = produtos.map(p =>
    `<option value="${p.id}">${escapeHtml(p.nome)} — estoque: ${p.quantidade_estoque}</option>`
  ).join('');
}

async function carregarHistorico() {
  const response = await fetch('/api/producao');
  if (!response.ok) return;
  const rows = await response.json();
  productionTable.innerHTML = rows.map(r => `
    <tr>
      <td>${escapeHtml(r.produto)}</td>
      <td><span class="tag ${r.tipo === 'FABRICADO' ? 'in' : 'out'}">${r.tipo === 'FABRICADO' ? 'FABRICADO / ENTRADA' : 'PEDIDO / SAÍDA'}</span></td>
      <td>${r.quantidade}</td>
      <td>${new Date(r.data_movimentacao + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
      <td>${escapeHtml(r.usuario)}</td>
    </tr>`).join('');
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

productionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('/api/producao', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      produto_id: productSelect.value,
      tipo: document.getElementById('tipo').value,
      quantidade: document.getElementById('quantidade').value,
      data_movimentacao: document.getElementById('data_movimentacao').value
    })
  });

  const data = await response.json();
  productionMessage.textContent = data.mensagem || data.erro;
  productionMessage.className = 'message ' + (response.ok ? 'success' : 'error');

  if (response.ok) {
    if (data.estoqueAbaixo) {
      alert(`ATENÇÃO: o estoque de "${data.produto}" ficou abaixo do mínimo configurado (${data.estoqueMinimo} unidades). Estoque atual: ${data.novoEstoque}.`);
    }
    productionForm.reset();
    document.getElementById('data_movimentacao').value = new Date().toISOString().slice(0,10);
    await carregarProdutos();
    await carregarHistorico();
  }
});

carregarProdutos();
carregarHistorico();
