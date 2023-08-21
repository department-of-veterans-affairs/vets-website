/**
 * Convert an array into a readable list of items; and we're using an Oxford
 * comma (https://design.va.gov/content-style-guide/punctuation#commas)
 * @param {String[]} list - Array of items. Empty entries are stripped out
 * @param {String} joiner - conjunction, e.g. 'and' or 'or'
 * @returns {String}
 * @example
 * readableList(['1', 'two'])
 * // => '1 and two'
 * readableList(['1', '2', '3', '4', 'five'])
 * // => '1, 2, 3, 4, and five'
 */
const readableList = (list, joiner = 'and') => {
  const cleanedList = list.filter(Boolean);
  if (cleanedList.length < 2) {
    return cleanedList.join('');
  }
  return [cleanedList.slice(0, -1).join(', '), cleanedList.slice(-1)[0]].join(
    `${cleanedList.length === 2 ? '' : ','} ${joiner} `,
  );
};

export default readableList;
