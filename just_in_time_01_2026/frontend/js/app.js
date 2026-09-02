async function verificarSessao() {
  const response = await fetch('/api/sessao');
  if (!response.ok) {
    if (!location.pathname.endsWith('login.html') && location.pathname !== '/') {
      location.href = 'login.html';
    }
    return null;
  }
  const data = await response.json();
  const userName = document.getElementById('userName');
  if (userName) userName.textContent = data.usuario.nome;
  return data.usuario;
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!location.pathname.endsWith('login.html')) {
    await verificarSessao();
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await fetch('/api/logout', {method:'POST'});
      location.href = 'login.html';
    });
  }
});
