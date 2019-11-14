const { unescape } = require('lodash');
/**
 * A very specific helper function that expects to receive an
 * array with one item which is an object with a single `value` property
 *
 */
function getDrupalValue(arr) {
  if (arr.length === 0) return null;
  if (arr.length === 1) return arr[0].value;
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

/**
 * If `value` is a string, it will remove all `\r`, and `\t` characters from it.
 *
 * @return {string}
 */
function removeLinebreaks(value) {
  return typeof value === 'string' ? value.replace(/(\r|\t)/gm, '') : value;
}

module.exports = {
  getDrupalValue,
  createMetaTag,
  removeLinebreaks,

  /**
   * Takes a string and applies the following:
   * - removes carriage returns, newlines, & tabs
   * - transforms escaped unicode to characters
   *
   * @param {string}
   * @return {string}
   */
  getWysiwygString(value) {
    return unescape(removeLinebreaks(value));
  },
};
