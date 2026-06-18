// api.js
// Cliente HTTP central. Toda chamada aos microsserviços passa por aqui,
// para padronizar headers, tratamento de erro e injeção do token JWT.

const Api = {
  /**
   * Faz uma requisição HTTP e trata erros de forma padronizada.
   * @param {string} url
   * @param {object} options - mesmas opções do fetch (method, body, headers)
   * @param {boolean} autenticado - se true, injeta o header Authorization
   */
  async request(url, options = {}, autenticado = true) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (autenticado) {
      const token = Auth.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    let response;
    try {
      response = await fetch(url, { ...options, headers });
    } catch (networkError) {
      // Erro de rede / CORS bloqueado / serviço fora do ar
      throw new ApiError(
        0,
        `Não foi possível conectar ao servidor (${url}). Verifique se o serviço está rodando e se o CORS está configurado.`,
        null
      );
    }

    if (response.status === 204) {
      return null; // No Content
    }

    let body = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await response.json().catch(() => null);
    } else {
      body = await response.text().catch(() => null);
    }

    if (!response.ok) {
      const mensagem =
        (body && (body.mensagem || body.message || body.erro)) ||
        `Erro ${response.status} ao chamar ${url}`;
      throw new ApiError(response.status, mensagem, body);
    }

    return body;
  },

  get(url, autenticado = true) {
    return this.request(url, { method: 'GET' }, autenticado);
  },

  post(url, data, autenticado = true) {
    return this.request(
      url,
      { method: 'POST', body: JSON.stringify(data) },
      autenticado
    );
  },

  put(url, data, autenticado = true) {
    return this.request(
      url,
      { method: 'PUT', body: JSON.stringify(data) },
      autenticado
    );
  },

  delete(url, autenticado = true) {
    return this.request(url, { method: 'DELETE' }, autenticado);
  },
};

class ApiError extends Error {
  constructor(status, mensagem, body) {
    super(mensagem);
    this.status = status;
    this.body = body;
  }
}