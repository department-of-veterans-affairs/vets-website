import { format } from 'date-fns';
import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

/**
 * Helper that maps an array to an object literal to allow for multiple keys to
 * have the same value
 * @param {Array} arrayToMap - an array of arrays that defines the keys/values to map
 * @returns {Object} - an object literal
 */
export function createLiteralMap(arrayToMap) {
  return arrayToMap.reduce((obj, [value, keys]) => {
    for (const key of keys) {
      Object.defineProperty(obj, key, { value });
    }
    return obj;
  }, {});
}

/**
 * Helper that formats a date string using date-fns. This works around an
 * issue where the `format` method doesn't return the correct date when
 * using a string with dashes (i.e. 2024-01-01)
 * @param {String} val - the date string to parse
 * @param {String} str - the format string to return
 * @returns {String} - the formatted date string
 */
export function formatDate(val, str) {
  return format(new Date(val.replaceAll('-', '/').split('T')[0]), str);
}

/**
 * Helper that visually-masks the Veteran's Social Security number and separates
 * each number so screenreaders will read "ending with 1 2 3 4" instead of
 * "ending with 1,234"
 * @param {String} value - the Social Security number string from the form data
 * @returns {Element} - React element containing the masked string and
 * screenreader-compatible output
 */
export function maskSSN(value = '') {
  if (!value) return srSubstitute('', 'is blank');
  const number = value.toString().slice(-4);
  return srSubstitute(
    `●●●–●●–${number}`,
    `ending with ${number.split('').join(' ')}`,
  );
}

/**
 * Helper that builds a full name string based on provided input values
 * @param {Object} name - the object that stores all the available input values
 * @param {Boolean} outputMiddle - optional param to declare whether to output
 * the middle name as part of the returned string
 * @returns {String} - the name string with all extra whitespace removed
 */
export function normalizeFullName(name = {}, outputMiddle = false) {
  const { first = '', middle = '', last = '', suffix = '' } = name;
  const nameToReturn = outputMiddle
    ? `${first} ${middle !== null ? middle : ''} ${last} ${suffix}`
    : `${first} ${last} ${suffix}`;
  return nameToReturn.replace(/ +(?= )/g, '').trim();
}

/**
 * Helper that replaces specified parts of a string with a dynamic value
 * @param {String} src - the original string to parse
 * @param {String} val - the value to input into the new string
 * @param {String} char - the value to be replaced in the original string
 * @returns {String} - the new string with all replaced values
 */
export function replaceStrValues(src, val, char = '%s') {
  return src && val ? src.toString().replace(char, val) : '';
}
