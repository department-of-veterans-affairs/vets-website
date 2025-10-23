import { CONTACT_EDIT } from '../constants';

/**
 * Convert an array into a readable list of items
 * @param {String[]} list - Array of items. Empty entries are stripped out
 * @returns {String}
 * @example
 * readableList(['1', 'two'])
 * // => '1 and two'
 * readableList(['1', '2', '3', '4', 'five'])
 * // => '1, 2, 3, 4, and five'
 */
export const readableList = (list, joiner = 'and') => {
  const cleanedList = list.filter(Boolean);
  if (cleanedList.length < 2) {
    return cleanedList.join('');
  }
  return [cleanedList.slice(0, -1).join(', '), cleanedList.slice(-1)[0]].join(
    `${cleanedList.length === 2 ? '' : ','} ${joiner} `,
  );
};

/**
 * @typedef phoneObject
 * @type {Object}
 * @property {String} countryCode - country code (1 digit, usually)
 * @property {String} areaCode - area code (3 digits)
 * @property {String} phoneNumber - phone number (7 digits)
 * @property {String} phoneNumberExt - extension
 * @returns
 */
/**
 * Return a phone number object
 * @param {String} phone - phone number string to convert to an object
 * @return {phoneObject}
 */
export const returnPhoneObject = phone => {
  const result = {
    countryCode: '',
    areaCode: '',
    phoneNumber: '',
    phoneNumberExt: '',
  };
  if (typeof phone === 'string' && phone?.length === 10) {
    result.countryCode = '1';
    result.areaCode = phone.slice(0, 3);
    result.phoneNumber = phone.slice(-7);
  }
  return result;
};

/**
 * Combine area code and phone number in a string
 * @param {phoneObj} phone
 * @returns {String} area code + phone number
 */
export const getPhoneString = (phone = {}) =>
  `${phone?.areaCode || ''}${phone?.phoneNumber || ''}`;

const hashRegex = /#/g;
const phonePattern = '(###) ###-####';
export const getFormattedPhone = phone => {
  const fullString = getPhoneString(phone);
  if (fullString.length === 10) {
    let i = 0;
    // eslint-disable-next-line no-plusplus
    return phonePattern.replace(hashRegex, () => fullString[i++] || '');
  }
  return fullString;
};

// schema allows 1 digit area code & 1 digit phone number
export const hasMobilePhone = formData =>
  getPhoneString(formData?.veteran?.mobilePhone).length >= 2;

/**
 * Set sessionStorage of last edited contact field. We could have used
 * selectMostRecentlyUpdatedField from the VAP service instead of using
 * sessionStorage, but we wouldn't know if the edit was canceled
 * @param {string} key - ID of contact info input
 * @param {string} state - either "updated" or "canceled"
 */
export const setReturnState = (key = '', state = '') =>
  window.sessionStorage.setItem(CONTACT_EDIT, `${key},${state}`);
/**
 * Get ID and state of last edited contact field so we know where to move focus
 * @returns {Array} Array with ID at index zero, and state at index one
 */
export const getReturnState = () =>
  window.sessionStorage.getItem(CONTACT_EDIT) || '';
export const clearReturnState = () =>
  window.sessionStorage.removeItem(CONTACT_EDIT);
