const form = document.getElementById('loginForm');
const message = document.getElementById('loginMessage');

fetch('/api/sessao').then(r => {
  if (r.ok) window.location.href = 'index.html';
}).catch(() => {});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  message.textContent = 'Entrando...';
  message.className = 'message';

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: document.getElementById('email').value.trim(),
        senha: document.getElementById('senha').value
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.erro || 'Falha no login.');
    window.location.href = 'index.html';
  } catch (error) {
    message.textContent = error.message;
    message.className = 'message error';
  }
});
