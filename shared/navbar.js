// navbar.js
// Monta o header dinamicamente, ajustando os links conforme o usuário
// está deslogado, é cidadão ou é agente da prefeitura.
// Uso: incluir uma <div id="navbar-root"></div> e chamar montarNavbar('id-da-pagina-ativa')

function montarNavbar(paginaAtiva = '') {
  const root = document.getElementById('navbar-root');
  if (!root) return;

  const autenticado = Auth.estaAutenticado();
  const perfil = autenticado ? Auth.getPerfil() : null;
  const usuario = autenticado ? Auth.getUsuario() : null;

  let linksEsquerda = `<a href="/public/index.html" data-id="home">Início</a>
                        <a href="/public/mapa.html" data-id="mapa">Mapa público</a>`;

  let linksDireita = '';

  if (!autenticado) {
    linksDireita = `
      <a href="/public/login.html" data-id="login">Entrar</a>
      <a href="/public/cadastro.html" class="btn btn-primario" data-id="cadastro" style="padding:8px 18px;">Criar conta</a>
    `;
  } else if (perfil === 'ROLE_CIDADAO') {
    linksEsquerda += `<a href="/cidadao/registrar.html" data-id="registrar">Registrar ocorrência</a>
                       <a href="/cidadao/minhas-ocorrencias.html" data-id="minhas">Minhas ocorrências</a>`;
    linksDireita = `
      <a href="/cidadao/perfil.html" data-id="perfil">${usuario?.nome ? usuario.nome.split(' ')[0] : 'Meu perfil'}</a>
      <a href="#" id="btn-logout" class="btn btn-secundario" style="padding:8px 18px;">Saída</a>
    `;
  } else if (perfil === 'ROLE_AGENTE_PREFEITURA') {
    linksEsquerda += `<a href="/agente/dashboard.html" data-id="dashboard">Painel</a>
                       <a href="/agente/ocorrencias.html" data-id="ocorrencias-agente">Ocorrências</a>`;
    linksDireita = `
      <span style="color: var(--grafite-400); font-size: 0.85rem;">Agente · ${usuario?.nome ?? ''}</span>
      <a href="#" id="btn-logout" class="btn btn-secundario" style="padding:8px 18px;">Saída</a>
    `;
  }

  root.innerHTML = `
    <div class="faixa-topo"></div>
    <header class="header">
      <div class="container">
        <a href="/public/index.html" class="marca">
          <span class="selo">TCC</span>
          <span class="nome">SOMAR</span>
        </a>
        <nav class="nav-links" aria-label="Navegação principal">
          ${linksEsquerda}
          ${linksDireita}
        </nav>
      </div>
    </header>
  `;

  // Marca o link ativo
  if (paginaAtiva) {
    const ativo = root.querySelector(`[data-id="${paginaAtiva}"]`);
    if (ativo) ativo.classList.add('ativo');
  }

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
    });
  }
}