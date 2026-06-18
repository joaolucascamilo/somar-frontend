// enums.js
// Espelha os enums definidos nos back-ends (StatusOcorrencia, TipoOcorrencia,
// NivelPrioridade) para uso consistente em todo o frontend.

const StatusOcorrencia = {
  1: { nome: 'REGISTRADO', label: 'Registrado', cor: '#3B82F6' },
  2: { nome: 'CANCELADO', label: 'Cancelado', cor: '#6B7280' },
  3: { nome: 'RESOLVIDO', label: 'Resolvido', cor: '#16A34A' },
  4: { nome: 'EM_PROCEDIMENTO', label: 'Em procedimento', cor: '#F59E0B' },
};

const TipoOcorrencia = {
  1: { nome: 'BURACO_VIA', label: 'Buraco em via pública', icone: '🕳️' },
  2: { nome: 'PAVIMENTACAO_DANIFICADA', label: 'Pavimentação danificada', icone: '🛣️' },
  3: { nome: 'FALHA_DRENAGEM', label: 'Falha na drenagem / bueiro entupido', icone: '🌊' },
  4: { nome: 'CALCADA_IRREGULAR', label: 'Calçada irregular', icone: '🚶' },
  5: { nome: 'FALHA_ILUMINACAO', label: 'Falha na iluminação pública', icone: '💡' },
  6: { nome: 'SINALIZACAO_DEFEITUOSA', label: 'Sinalização defeituosa', icone: '🚦' },
  7: { nome: 'ACUMULO_LIXO', label: 'Acúmulo de lixo', icone: '🗑️' },
  99: { nome: 'OUTROS', label: 'Outros', icone: '📌' },
};

const NivelPrioridade = {
  CRITICA: { label: 'Crítica', cor: '#DC2626' },
  ALTA: { label: 'Alta', cor: '#F59E0B' },
  MEDIA: { label: 'Média', cor: '#3B82F6' },
  BAIXA: { label: 'Baixa', cor: '#6B7280' },
};

function formatarData(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}