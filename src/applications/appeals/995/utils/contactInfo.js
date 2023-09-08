import { CONTACT_EDIT } from '../constants';

import '../../shared/definitions';

/**
 * Return a phone number object
 * @param {String} phone - phone number string to convert to an object
 * @return {PhoneObject}
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
 * @param {PhoneObject} phone
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
    return phonePattern.replace(hashRegex, () => fullString[i++] || '');
  }
  return fullString;
};

// schema allows 1 digit area code & 1 digit phone number
export const hasHomePhone = formData =>
  getPhoneString(formData?.veteran?.homePhone).length >= 2;
export const hasMobilePhone = formData =>
  getPhoneString(formData?.veteran?.mobilePhone).length >= 2;

export const hasHomeAndMobilePhone = formData =>
  hasHomePhone(formData) && hasMobilePhone(formData);

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
