import { common } from '../props';

/**
 * Combine area code and phone number & extension in a string; Not using the
 * va-telephone component because the va-radio-option description only accepts a
 * string value
 * @param {PhoneObject} phone
 * @returns {string} area code + phone number
 */
export const getPhoneString = (phone = {}) =>
  `${phone?.areaCode || ''}${phone?.phoneNumber || ''}`;

const hashRegex = /#/g;
const phonePattern = '(###) ###-####';
export const getFormattedPhone = phone => {
  const fullString = getPhoneString(phone);
  if (fullString.length === 10) {
    const ext = phone.extension ? `, ext. ${phone.extension}` : '';
    let i = 0;
    return phonePattern.replace(hashRegex, () => fullString[i++] || '') + ext;
  }
  return fullString;
};

// schema allows 1 digit area code & 1 digit phone number
export const hasHomePhone = formData =>
  getPhoneString(formData?.veteran?.homePhone).length >= 2;
export const hasMobilePhone = formData =>
  getPhoneString(formData?.veteran?.mobilePhone).length >= 2;

/**
 * Check if both home & mobile phone exists, if both exists and they are exactly
 * the same, then don't show the primary phone page
 * @param {Object} formData - full form data
 * @returns {boolean}
 */
export const hasHomeAndMobilePhone = formData =>
  hasHomePhone(formData) &&
  hasMobilePhone(formData) &&
  getFormattedPhone(formData.veteran.homePhone) !==
    getFormattedPhone(formData.veteran.mobilePhone);

hasHomeAndMobilePhone.propTypes = common;
