// Utility: shared formatting helpers used by UI and services layers.
export function formatMoney(value) {
  const amount = Number(value || 0);
  return `${amount} ر.س`;
}

export function safeText(value) {
  return value == null ? '' : String(value);
}
