export function formatMoney(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('pt-BR');
}

export function calculateDays(start, end) {
  const diff = new Date(end) - new Date(start);
  return Math.max(1, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}
