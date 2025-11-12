const spelledOutOrdinals = {
  1: 'first',
  2: 'second',
  3: 'third',
  4: 'fourth',
  5: 'fifth',
  6: 'sixth',
  7: 'seventh',
  8: 'eighth',
  9: 'ninth',
  10: 'tenth',
};

const ordinalSuffixes = {
  1: 'st',
  2: 'nd',
  3: 'rd',
};

/**
 * Converts numbers to ordinal form. Returns:
 *  Ordinal words for numbers 1-10, e.g. `1` becomes `first`
 *  Numbers with suffix for 11+, e.g. `23` becomes `23rd`
 *  Ignores fractional part of valid numbers
 *
 * @param {number|string} value
 * @return {string|number} Will return original param if invalid or out-of-range
 */
export default function numberToWords(value) {
  const stringValue = value?.toString();
  const numericValue = parseFloat(stringValue);

  if (
    !value ||
    Number.isNaN(value) ||
    Number.isNaN(stringValue) ||
    numericValue % 1 > 0 ||
    numericValue < 1 ||
    !Number.isFinite(numericValue)
  ) {
    return value;
  }

  // Spell out 1-10
  if (numericValue <= 10) {
    return spelledOutOrdinals[numericValue];
  }

  // For 11+, add numeric suffix
  const finalDigit = numericValue % 10;
  const finalTwoDigits = numericValue % 100;

  // Special handling for 11-13 (always use 'th')
  if (finalTwoDigits >= 11 && finalTwoDigits <= 13) {
    return `${numericValue}th`;
  }

  // Apply suffix based on final digit
  const appliedSuffix = ordinalSuffixes[finalDigit] || 'th';
  return `${numericValue}${appliedSuffix}`;
}
