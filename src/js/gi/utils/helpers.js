export function formatCurrency(value) {
  const str = Math.round(+value).toString();
  return `$${str.replace(/\d(?=(\d{3})+$)/g, '$&,')}`;
}
