export function createPreferenceBody(preferences, emailAddress) {
  return {
    ...preferences,
    emailAddress,
    notificationFrequency: 'Each new message',
    emailAllowed: true,
  };
}

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
  return Array.from(new Set(items));
}
