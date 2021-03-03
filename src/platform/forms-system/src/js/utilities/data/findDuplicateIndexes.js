/**
 * Find duplicates in an array of objects and return an array of indexes for the
 *  duplicates only
 * @param {Object[]} arrayFieldData - Data array (ArrayField data)
 * @param {String} dataKey - key of data of interest to find duplicates
 * @return {Array} - Array of indexes of the duplicates only, not the first
 *  entry
 * @example
 * findDuplicateIndexes([{x:'one'},{x:'two'},{x:'one'},{x:'two'}], 'x')
 * // => [2, 3]
 */
export default function(arrayFieldData = [], dataKey = '') {
  if (!dataKey || arrayFieldData?.length === 0) {
    return [];
  }
  const list = arrayFieldData.map(item => item[dataKey]?.toLowerCase() || '');
  return list.reduce((duplicateIndexes, item, index) => {
    // look for duplicates of the first, but don't include the first
    const foundIndex = list.indexOf(item, index + 1);
    if (foundIndex > -1) {
      duplicateIndexes.push(foundIndex);
    }
    return duplicateIndexes;
  }, []);
}
