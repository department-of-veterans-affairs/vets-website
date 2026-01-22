/**
 * Detect non-string & return empty string if it isn't
 * @param {*} value
 * @return {string}
 */
export const coerceStringValue = value => {
  if (typeof value === 'string') {
    return value;
  }
  return '';
};

/**
 * Add leading zero to numbers < 10
 * using slice since we have some Veterans using older Safari versions that
 * don't support padStart or Intl.NumberFormat
 * @param {String} part - date part (month or day) to add leading zeros to
 * @returns {String}
 */
export const addLeadingZero = part => `00${part || ''}`.slice(-2);
