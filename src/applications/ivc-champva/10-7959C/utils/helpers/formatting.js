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
