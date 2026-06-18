// config.js
// URLs base de cada microsserviço. Centralizado aqui para facilitar
// ajustes quando os serviços mudarem de porta/host (ex: deploy).

const CONFIG = {
  REPORT_SERVICE_URL: 'http://localhost:8081',      // report-service / ms-ocorrencias
  USER_SERVICE_URL: 'http://localhost:8082',         // user-service / ms-usuarios
  WORKFLOW_SERVICE_URL: 'http://localhost:8083',     // workflow-status-service
  GEO_SERVICE_URL: 'http://localhost:8084',          // ms-geo
  PRIORIZACAO_SERVICE_URL: 'http://localhost:8085',  // ms-priorizacao
};