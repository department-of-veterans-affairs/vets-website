/**
 * Capitalizes the first letter of a string.
 * @param {string} str - String to capitalize
 * @returns {string} String with first letter capitalized, or empty string if falsy
 */
export const capitalizeFirst = (str = '') =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

/**
 * Generates a full name string from a fullName object.
 *
 * @param {Object} name - The name components.
 * @param {string} [name.first] - First name.
 * @param {string} [name.middle] - Middle name.
 * @param {string} [name.last] - Last name.
 * @param {string} [name.suffix] - Name suffix (e.g., "Jr.", "III").
 * @param {Object} [options] - Formatting options.
 * @param {boolean} [options.includeMiddle=false] - Whether to include the middle name.
 * @returns {string} The formatted full name.
 */
export const formatFullName = (name = {}, { includeMiddle = false } = {}) => {
  const { first, middle, last, suffix } = name;
  const parts = [first, includeMiddle ? middle : null, last, suffix].filter(
    Boolean,
  );
  return parts.join(' ');
};

/**
 * Adds possessive apostrophe-s to a string.
 * @param {string} str - String to make possessive
 * @returns {string} String with 's appended, or original string if falsy
 */
export const makePossessive = (str = '') => (str ? `${str}\u2019s` : str);

/**
 * Replace placeholder(s) in a string with one or more values.
 *
 * - If `val` is an array, replaces one occurrence per item, left-to-right.
 * - If there are more placeholders than values, leftover placeholders remain.
 * - If there are more values than placeholders, extras are ignored.
 * - Returns an empty string if `src` or `val` is falsy.
 *
 * @param {string|number|boolean} src - Source to convert to string and parse.
 * @param {string|number|boolean|Array<string|number|boolean>} val - Value(s) to insert.
 * @param {string} [char='%s'] - Placeholder token to replace (literal match).
 * @returns {string} String with replacements applied.
 *
 * @example
 * replaceStrValues('Hello, %s!', 'World');        // 'Hello, World!'
 * @example
 * replaceStrValues('%s-%s-%s', ['a', 'b']);      // 'a-b-%s'
 * @example
 * replaceStrValues('X %s Y %s Z', ['1', '2']);   // 'X 1 Y 2 Z'
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
