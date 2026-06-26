// config.js
// URLs base de cada microsserviço. Centralizado aqui para facilitar
// ajustes quando os serviços mudarem de porta/host (ex: deploy).

const CONFIG = {
  REPORT_SERVICE_URL: 'https://report-service-production-00c7.up.railway.app',
  USER_SERVICE_URL: 'https://user-service-production-d5eb.up.railway.app',
  WORKFLOW_SERVICE_URL: 'https://workflow-status-service-production.up.railway.app',
  GEO_SERVICE_URL: 'https://ms-geo-production.up.railway.app',
  PRIORIZACAO_SERVICE_URL: 'https://ms-priorizacao-production.up.railway.app',
};