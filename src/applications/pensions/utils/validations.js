export const isValidCurrency = currencyAmount => {
  const regex = /(?=.*?\d)^(?!\$)(([1-9]\d{0,2}(,\d{3})*|\d+)(\.\d{1,2})?)?$/;
  return regex.test(currencyAmount) || !Number(currencyAmount) < 0;
};
