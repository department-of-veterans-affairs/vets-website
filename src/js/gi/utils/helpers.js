export function getCurrency(value) {
  const isNumeric = (n) => (!Number.isNaN(parseFloat(n)));

  const amount = value && value[0] === '$'
               ? value.substring(1)
               : value;

  return isNumeric(amount) ? +amount : 0;
}
