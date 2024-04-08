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
