import { format, parseISO, isValid } from 'date-fns';
import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

// declare previous year for form questions and content
export const LAST_YEAR = new Date().getFullYear() - 1;

/**
 * Helper that maps an array to an object literal to allow for multiple keys to
 * have the same value
 * @param {Array} arrayToMap - an array of arrays that defines the keys/values to map
 * @returns {Object} - an object literal
 */
export const createLiteralMap = arrayToMap =>
  Object.fromEntries(
    arrayToMap.flatMap(([value, keys]) => keys.map(key => [key, value])),
  );

/**
 * Helper that formats a date string using date-fns. This works around an
 * issue where the `format` method doesn't return the correct date when
 * using a string with dashes (i.e. 2024-01-01)
 * @param {String} val - the date string to parse
 * @param {String} str - the format string to return
 * @returns {String} - the formatted date string
 */
export const formatDate = (val, str = 'yyyy-MM-dd') => {
  if (!val) return null;
  const parsedDate = parseISO(val);
  return isValid(parsedDate) ? format(parsedDate, str) : null;
};

/**
 * Helper that visually-masks the Veteran's Social Security number and separates
 * each number so screenreaders will read "ending with 1 2 3 4" instead of
 * "ending with 1,234"
 * @param {String} value - the Social Security number string from the form data
 * @returns {Element} - React element containing the masked string and
 * screenreader-compatible output
 */
export const maskSSN = (value = '') => {
  if (!value) return srSubstitute('', 'is blank');
  const number = value.slice(-4);
  return srSubstitute(
    `●●●–●●–${number}`,
    `ending with ${[...number].join(' ')}`,
  );
};

/**
 * Helper that builds a full name string based on provided input values
 * @param {Object} name - the object that stores all the available input values
 * @param {Boolean} outputMiddle - optional param to declare whether to output
 * the middle name as part of the returned string
 * @returns {String} - the name string with all extra whitespace removed
 */
export const normalizeFullName = (name = {}, outputMiddle = false) => {
  const { first = '', middle = '', last = '', suffix = '' } = name;
  const nameToReturn = `${first} ${
    outputMiddle && middle !== null ? middle : ''
  } ${last} ${suffix}`.trim();
  return nameToReturn.replace(/\s+/g, ' ');
};

/**
 * Helper that replaces specified parts of a string with a dynamic value
 * @param {String} src - the original string to parse
 * @param {String|Array} val - the value to input into the new string
 * @param {String} char - the value to be replaced in the original string
 * @returns {String} - the new string with all replaced values
 */
export const replaceStrValues = (src, val, char = '%s') => {
  if (!src || !val) return '';
  if (Array.isArray(val)) {
    return val.reduce(
      (result, value) => result.replace(char, value),
      src.toString(),
    );
  }
  return src.toString().replace(char, val);
};
