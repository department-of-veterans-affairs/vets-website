const assert = require('assert');
const { unescape, snakeCase } = require('lodash');

/**
 * Takes a string with escaped unicode code points and replaces them
 * with the unicode characters. E.g. '\u2014' -> '—'
 *
 * @param {String} string
 * @return {String}
 */
function unescapeUnicode(string) {
  assert(
    typeof string === 'string',
    `Expected type String in unescapeUnicode, but found ${typeof string}: ${string}`,
  );
  return string.replace(/\\u(\d{2,4})/g, (wholeMatch, codePoint) =>
    String.fromCharCode(`0x${codePoint}`),
  );
}

/**
 * A very specific helper function that expects to receive an
 * array with one item which is an object with a single `value` property
 *
 */
function getDrupalValue(arr) {
  if (arr.length === 0) return null;
  if (arr.length === 1)
    return typeof arr[0].value === 'string'
      ? unescapeUnicode(arr[0].value)
      : arr[0].value;
  // eslint-disable-next-line no-console
  console.warn(`Unexpected argument: ${arr.toString()}`);
  return null;
}

function createMetaTag(type, key, value) {
  return {
    type,
    key,
    value,
  };
}

module.exports = {
  getDrupalValue,
  createMetaTag,
  unescapeUnicode,

  /**
   * Takes a string and applies the following:
   * - Transforms escaped unicode to characters
   * - Unescapes HTML entities
   *
   * @param {string}
   * @return {string}
   */
  getWysiwygString(value) {
    return unescape(value);
  },

  /**
   * Finds the property name containing the UUID.
   *
   * @param {Object} parent - The entity to look in
   * @param {string} uuid - The UUID to search for
   * @return {string} - The snake_cased property name the UUID is
   *                    found in
   * @return {undefined} - If the UUID is not found
   */
  getRawParentFieldName(parent, uuid) {
    let rawParentFieldName;
    Object.keys(parent).forEach(key => {
      if (!Array.isArray(parent[key])) return;

      parent[key].forEach(prop => {
        if (prop.target_uuid === uuid) rawParentFieldName = snakeCase(key);
      });
    });

    return rawParentFieldName;
  },
};
