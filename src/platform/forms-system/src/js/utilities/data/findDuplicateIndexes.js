/**
 * Find duplicates in an array of objects and return an array of indexes for the
 *  duplicates only
 * @param {Object[]} arrayFieldData - Data array (ArrayField data)
 * @param {String} dataKey - key of data of interest to find duplicates
 * @return {Number[]} - Array of indexes of the duplicates only, not the first
 *  entry
 * @example
 * findDuplicateIndexes([{x:'one'},{x:'two'},{x:'one'},{x:'two'}], 'x')
 * // => [2, 3]
 */
export default function(arrayFieldData = [], dataKey) {
  if (!dataKey || arrayFieldData.length === 0) {
    return [];
  }
  const list = arrayFieldData.map(item => (item[dataKey] || '').toLowerCase());
  // This reduce funtion will cycle through the list and look for a _single_
  // duplicate of the currently indexed item, so even if there is more than one
  // duplicate of a single item, or multiple duplicates of multiple items, it
  // will include them in the returned array
  return list.reduce((duplicateIndexes, item, index) => {
    // look for duplicates of the first, but don't include the first
    const foundIndex = list.indexOf(item, index + 1);
    if (foundIndex > -1) {
      duplicateIndexes.push(foundIndex);
    }
    return duplicateIndexes;
  }, []);
}
