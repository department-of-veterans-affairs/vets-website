/**
 * Append an index to each key of the object
 *
 * @param {Object} object - The object whose keys will be modified
 * @param {number} index - The integer which will be appended to the keys
 * @returns {Object} The object with the index appended to each key
 */
export function numerateKeys(object = {}, index) {
  const entries = Object.entries(object);
  return entries.reduce((numerated, [key, value]) => {
    // eslint-disable-next-line no-param-reassign
    numerated[`${key}${index}`] = value;
    return numerated;
  }, {});
}
