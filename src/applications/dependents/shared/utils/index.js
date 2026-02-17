import { parseISO, isValid, differenceInMonths } from 'date-fns';

import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';

import { getFormatedDate, calculateAge } from './dates';

export { getFormatedDate, calculateAge };

export const VIEW_DEPENDENTS_WARNING_KEY = 'viewDependentsWarningClosedAt';

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
 * Make a name possessive by adding an apostrophe
 * @param {String} name - The name to make possessive
 * @returns {String} - The possessive form of the name
 * @example makeNamePossessive('Alex') => "Alex's"
 * @example makeNamePossessive('Chris') => "Chris'"
 */
export const makeNamePossessive = name =>
  `${name}’${name.toLowerCase().endsWith('s') ? '' : 's'}`;

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
 * Check if field value is missing
 * @param {any} value - Any non-object or non-array field value
 * @returns {boolean} True if field is missing, false otherwise
 */
export function isFieldMissing(value) {
  return value === undefined || value === null || value === '';
}

/**
 * Check if an object is empty
 * @param {object} obj - The object to check
 * @returns {boolean} - Returns true if the object & any nested objects are
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

/**
 * Check if the dependents warning has been hidden
 * @returns {boolean} True if the warning has been hidden, false otherwise
 */
export function getIsDependentsWarningHidden() {
  const rawStoredDate = localStorage.getItem(VIEW_DEPENDENTS_WARNING_KEY);
  if (!rawStoredDate) {
    return false;
  }

  const dateClosed = parseISO(rawStoredDate);
  const monthsSinceClosed = differenceInMonths(new Date(), dateClosed);

  // If it has been more than 6 months since the warning was closed, show it
  // again
  if (monthsSinceClosed >= 6) {
    localStorage.removeItem(VIEW_DEPENDENTS_WARNING_KEY);
    return false;
  }
  return isValid(dateClosed);
}

/**
 * Hide the dependents warning by storing the current date in localStorage
 * @returns {void}
 */
export function hideDependentsWarning() {
  localStorage.setItem(VIEW_DEPENDENTS_WARNING_KEY, new Date().toISOString());
}
