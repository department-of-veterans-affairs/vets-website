export const checkIntl = (win = window) =>
  typeof win?.Intl?.NumberFormat === 'function';

export const getFormatter = options => {
  const {
    locale = 'en-US',
    currency = 'USD',
    minimumFractionDigits = 2,
    supportsIntl = checkIntl,
    currencySymbol = '$', // only for non-Intl support
    ...otherOptions
  } = options || {};
  if (supportsIntl()) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      ...otherOptions,
    });
  }
  return {
    format: amount => {
      const value = parseFloat(amount);
      return isNaN(value)
        ? amount
        : `${currencySymbol}${value.toLocaleString(locale)}`;
    },
  };
};

/**
 * Format a number as currency.
 * @param {number | string} amount - The amount to format.
 * @param {string} [locale='en-US'] - The locale to use for formatting.
 * @returns {string} The formatted currency string.
 *
 * @example
 * // Returns "$1,234.56"
 * formatCurrency(1234.56);
 *
 * // Returns "1.234,56 €" (non-breaking whitespace before "$")
 * formatCurrency(1234.56, { locale: 'de-DE', currency: 'EUR' });
 *
 * // Returns "not a number"
 * formatCurrency('not a number');
 *
 * // Returns "$0.00"
 * formatCurrency(0);
 *
 * // Returns "-$1,234.56"
 * formatCurrency(-1234.56);
 */
export default function formatCurrency(amount, options = {}) {
  const value = parseFloat(amount);
  if (isNaN(value)) {
    return amount;
  }
  const formatter = getFormatter(options);
  return formatter.format(value);
}
