// config.js
// URLs base de cada microsserviço. Centralizado aqui para facilitar
// ajustes quando os serviços mudarem de porta/host (ex: deploy).

const _isLocal = window.location.hostname === 'localhost' ||
                 window.location.hostname === '127.0.0.1';

const CONFIG = {
  REPORT_SERVICE_URL: _isLocal
    ? 'http://localhost:8081'
    : 'https://report-service-production-00c7.up.railway.app',
  USER_SERVICE_URL: _isLocal
    ? 'http://localhost:8082'
    : 'https://user-service-production-d5eb.up.railway.app',
  WORKFLOW_SERVICE_URL: _isLocal
    ? 'http://localhost:8083'
    : 'https://workflow-status-service-production.up.railway.app',
  GEO_SERVICE_URL: _isLocal
    ? 'http://localhost:8084'
    : 'https://ms-geo-production.up.railway.app',
  PRIORIZACAO_SERVICE_URL: _isLocal
    ? 'http://localhost:8085'
    : 'https://ms-priorizacao-production.up.railway.app',
};