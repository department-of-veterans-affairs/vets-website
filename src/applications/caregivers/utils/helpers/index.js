/**
 * Helper that builds a full name string based on provided input values
 * @param {Object} name - the object that stores all the available input values
 * @param {Boolean} outputMiddle - optional param to declare whether to output
 * the middle name as part of the returned string
 * @returns {String} - the name string with all extra whitespace removed
 */
export const normalizeFullName = (name = {}, outputMiddle = false) => {
  const { first = '', middle = '', last = '', suffix = '' } = name;
  const nameToReturn = outputMiddle
    ? `${first} ${middle !== null ? middle : ''} ${last} ${suffix}`
    : `${first} ${last} ${suffix}`;
  return nameToReturn.replace(/ +(?= )/g, '').trim();
};

/**
 * Helper that replaces specified parts of a string with a dynamic value
 * @param {String} src - the original string to parse
 * @param {String} val - the value to input into the new string
 * @param {String} char - the value to be replaced in the original string
 * @returns {String} - the new string with all replaced values
 */
export const replaceStrValues = (src, val, char = '%s') => {
  return src && val ? src.toString().replace(char, val) : '';
};
