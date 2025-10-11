/**
 * Removes object properties with values of null or undefined and
 * returns new object
 *
 * @export
 * @param {Object} obj
 * @returns {Object} An object with keys that do not have either null or undefined values
 */
export function removeEmpty(obj) {
  return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}
