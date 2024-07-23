/**
 * Return "Yes", "No" or "Not selected" from value; the value will be
 * @param {boolean|undefined} value - Boolean value or undefined
 * @param {string} yes = 'Yes' - text to show for truthy values
 * @param {string} no = 'No' - text to show for falsy values
 * @returns {string}
 */
export const showValueOrNotSelected = (value, yes = 'Yes', no = 'No') => {
  if (typeof value !== 'undefined' && value !== null) {
    return value ? yes : no;
  }
  return 'Not selected';
};
