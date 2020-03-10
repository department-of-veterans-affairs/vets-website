const ordinals = {
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
  11: 'eleventh',
  12: 'twelveth',
  13: 'thirteenth',
  14: 'fourteenth',
  15: 'fifteenth',
  16: 'sixteenth',
  17: 'seventeenth',
  18: 'eighteenth',
  19: 'nineteenth',
  20: 'twentieth',
  30: 'thirtieth',
  // add more as needed
};

const tens = {
  20: 'twenty',
  30: 'thirty',
  // add more as needed
};

const endings = {
  1: 'st',
  2: 'nd',
  3: 'rd',
};

/**
 * Limited version of a converter of numbers to words. Returns:
 *  Ordinal names of numbers from 1 to 39 from a one-based index, e.g.
 *   `21` becomes `twenty-first`
 *   `39' becomes `thirty-nineth`
 *  Ignores fractional part of valid numbers
 *  Numbers > 39 & < 100 get an 'st', 'nd', 'rd' or 'th' ending, e.g. `40th`
 *
 * @param {number|string} value
 * @return {string|number} Will return original param if invalid or out-of-range
 */
export default function numberToWords(value) {
  const string = value?.toString();
  const number = parseFloat(string);

  if (
    !value ||
    isNaN(value) ||
    isNaN(string) ||
    // ignore fractions
    number % 1 > 0 ||
    // limit range
    number < 1 ||
    !isFinite(number)
  ) {
    return value;
  }

  if (number <= 20) {
    return ordinals[number];
  }
  const remainder = number % 10;
  const tensValue = parseInt(number / 10, 10) * 10;

  if (!remainder) {
    // return original number if words aren't set up
    return ordinals[number] || `${number}th`;
  }
  return tens[tensValue]
    ? `${tens[tensValue]}-${ordinals[number - tensValue]}`
    : `${number}${endings[remainder] || 'th'}`;
}
