import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

/**
 * Return formatted full name from name object
 * @param {Object} name - An object containing first, middle, and last names
 * @param {String} name.first - first name
 * @param {String} name.middle - middle name
 * @param {String} name.last - last name
 * @param {String} name.suffix - name suffix
 * @returns {String} - The full name formatted as "first middle last, suffix"
 */
export const getFullName = ({ first, middle, last, suffix } = {}) =>
  [first || '', middle || '', last || ''].filter(Boolean).join(' ') +
  (suffix ? `, ${suffix}` : '');

/**
 * Separate each number so the screen reader reads "number ending with 1 2 3 4"
 * instead of "number ending with 1,234"
 * @param {String} id - The last four digits of a Social Security Number
 * @param {String} [mask] - The mask to apply before the last four digits
 * @returns {String} - The masked Social Security Number or VA file number
 */
export const maskID = (id = '', mask = '●●●–●●-') => {
  const lastFour = id.toString().slice(-4);
  return srSubstitute(
    `${mask || ''}${lastFour}`,
    `ending with ${lastFour.split('').join(' ')}`,
  );
};

/**
 * Check if an object is empty
 * @param {Any} obj
 * @returns {Boolean} - Returns true if the object & any nested objects are
 * empty, false otherwise
 */
export function isEmptyObject(obj) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    return (
      Object.keys(obj)?.length === 0 ||
      Object.values(obj)?.filter(
        item =>
          typeof item === 'object' ? !isEmptyObject(item) : Boolean(item),
      )?.length === 0 ||
      false
    );
  }
  return false;
}

export const getRootParentUrl = rootUrl => rootUrl.split(/\b\//)[0];
