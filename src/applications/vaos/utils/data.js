/**
 * Converts an array of items into an object with item.id as
 * the key, and item as the value
 *
 * @export
 * @param {Array<Object>} items
 * @param {string} [idProp='id'] The id to use, defaulted to id
 * @returns {Object} An object with id keys and item values
 */
export function arrayToObject(items, idProp = 'id') {
  return (
    items?.reduce(
      (current, next) => ({
        ...current,
        [next[idProp]]: next,
      }),
      {},
    ) || {}
  );
}

/**
 * Returns an array with any duplicate values removed
 *
 * @export
 * @param {Array} items
 * @returns {Array} items array with duplicates removed
 */
export function dedupeArray(items) {
  return Array.from(new Set(items)).filter(i => !!i);
}

/**
 * Returns an array with any duplicate id objects removed
 *
 * @export
 * @param {Array} items
 * @returns {Array} array with objects of unique ids
 */
export function removeDuplicateId(items) {
  return items.filter(
    (ele, index) => index === items.findIndex(element => element.id === ele.id),
  );
}

/**
 * Takes an object with string keys and promise values,
 * waits for them all to complete, then returns an object
 * with the same string keys and the resolved promise values
 *
 * @export
 * @param {Object} data An object with string keys and promise values
 * @returns {Object} An object with string keys and resolved promise values
 */
export async function promiseAllFromObject(data) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const results = await Promise.all(values);

  return keys.reduce(
    (resultsObj, key, i) => ({
      ...resultsObj,
      [key]: results[i],
    }),
    {},
  );
}
