const LABELS = {
  DISPONIVEL: 'Disponível',
  ALUGADO: 'Alugado',
  MANUTENCAO: 'Manutenção',
  ATIVA: 'Ativa',
  FINALIZADA: 'Finalizada'
};

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{LABELS[status] || status}</span>;
}
