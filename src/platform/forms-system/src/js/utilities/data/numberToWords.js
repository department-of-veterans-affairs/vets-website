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
  11: 'eleven',
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
 * Limited version of a converter of numbers to words
 * Returns ordinal names of numbers from 1 to 39 from a one-based index, e.g.
 * `21` becomes `twenty-first`
 * `39' becomes `thirty-nineth`
 * Numbers > 39 get an 'st', 'nd', 'rd' or 'th' ending, e.g. `40th`
 *
 * @param {number|string} number
 * @param {number} modifier - add or subtract value from number
 * @return {string}
 */
export default function numberToWords(number, modifier = 0) {
  const num = number?.toString().replace(/[^\d.]/g, '');
  const integer = parseInt(num, 10) + modifier;
  if (isNaN(num)) {
    return number;
  }
  if (integer <= 20) {
    return ordinals[integer];
  }
  const remainder = number % 10;
  const tensValue = parseInt(integer / 10, 10) * 10;
  if (!remainder) {
    // return original number if words aren't set up
    return ordinals[integer] || `${integer}th`;
  }
  return tens[tensValue]
    ? `${tens[tensValue]}-${ordinals[integer - tensValue]}`
    : `${integer}${endings[remainder] || 'th'}`;
}
