const assert = require('assert');
const { sortBy, unescape, pick } = require('lodash');
const moment = require('moment-timezone');

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

/**
 * This is currently a dummy function, but we may
 * need it in the future to convert weird uris like
 * `entity:node/27` to something resembling a
 * relative url
 */
function uriToUrl(uri) {
  return uri;
}

module.exports = {
  getDrupalValue,
  createMetaTag,
  unescapeUnicode,
  uriToUrl,

  /**
   * This function takes an object where the keys are integers
   * and returns the object as an array where each index corresponds
   * to the key of the original object. This exists because we encountered
   * an object that looked like `{"0": "foo", "1": "bar", "caption": "Hi!"}`
   *
   * @param {object}
   * @return {array}
   */
  combineItemsInIndexedObject(obj) {
    const values = [];
    for (const [key, value] of Object.entries(obj)) {
      if (Number.isInteger(Number.parseInt(key, 10))) {
        values.push([key, value]);
      }
    }
    return sortBy(values, [item => item[0]]).map(item => item[1]);
  },

  /**
   * Takes a string and applies the following:
   * - Transforms escaped unicode to characters
   *
   * @param {string}
   * @return {string}
   */
  getWysiwygString(value) {
    return unescape(value);
  },

  /**
   * Takes an array meant to contain only one object.
   * If this object exists, an object will be returned matching what is expected for "fieldLink" objects,
   * otherwise null is returned.
   *
   * If the optional parameter is used, the returned object will only contain those attributes.
   *
   * @param {array} fieldLink
   * @param {array} attrs
   * @return {object}
   */
  createLink(fieldLink, attrs = ['url', 'title', 'options']) {
    const { uri, title, options } = fieldLink[0] || {};

    return fieldLink[0]
      ? pick(
          {
            url: { path: uriToUrl(uri) },
            title,
            options,
          },
          attrs,
        )
      : null;
  },

  /**
   * Takes a timestamp like 2019-09-10T13:43:47+00:00
   * and returns the epoch time.
   */
  utcToEpochTime(timeString) {
    return moment.tz(timeString, 'UTC').unix();
  },
};
