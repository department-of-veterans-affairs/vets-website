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

module.exports = {
  getDrupalValue,
  createMetaTag,
};
