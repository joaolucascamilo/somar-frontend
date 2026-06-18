// auth.js
// Gerencia o token JWT e os dados do usuário autenticado.
// O token é salvo no localStorage para persistir entre recarregamentos de página.
//
// IMPORTANTE: localStorage é aceitável aqui porque este é um app real servido
// por um servidor HTTP local (não um artifact do Claude.ai, onde isso é proibido).

const AUTH_TOKEN_KEY = 'somar_token';
const AUTH_USER_KEY = 'somar_user';

const Auth = {
  /**
   * Salva o token e os dados básicos do usuário após login/registro.
   * @param {string} token - JWT retornado pelo user-service
   * @param {object} userData - { id, nome, email, perfil }
   */
  salvarSessao(token, userData) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  getUsuario() {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  estaAutenticado() {
    return !!this.getToken();
  },

  /**
   * Decodifica o payload de um JWT (sem validar assinatura — isso é
   * responsabilidade do back-end). Útil para ler claims como "perfil" e "id"
   * caso não tenhamos guardado o objeto de usuário completo.
   */
  decodificarToken(token) {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Falha ao decodificar token JWT:', e);
      return null;
    }
  },

  getPerfil() {
    const user = this.getUsuario();
    if (user && user.perfil) return user.perfil;
    const token = this.getToken();
    if (!token) return null;
    const claims = this.decodificarToken(token);
    return claims ? claims.perfil : null;
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = '/public/login.html';
  },

  /**
   * Protege uma página: redireciona para login se não autenticado,
   * ou para uma página de "acesso negado" simples se o perfil não bater.
   * @param {string[]} perfisPermitidos - ex: ['ROLE_CIDADAO']
   */
  protegerPagina(perfisPermitidos) {
    if (!this.estaAutenticado()) {
      window.location.href = '/public/login.html';
      return false;
    }
    if (perfisPermitidos && perfisPermitidos.length > 0) {
      const perfil = this.getPerfil();
      if (!perfisPermitidos.includes(perfil)) {
        alert('Você não tem permissão para acessar esta página.');
        window.location.href = '/public/index.html';
        return false;
      }
    }
    return true;
  },
};