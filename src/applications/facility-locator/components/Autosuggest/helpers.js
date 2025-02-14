/**
 * itemToString - returns the string to display for an item in the typeahead
 * @param {Object|String} item either a string or an object with a `toDisplay` property
 * @returns {String} the string to display
 */
export const itemToString = item => {
  return typeof item === 'string' ? item : item?.toDisplay || '';
};
