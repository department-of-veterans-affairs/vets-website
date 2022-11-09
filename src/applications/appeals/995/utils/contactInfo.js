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
export const getFormatedPhone = phone => {
  const fullString = getPhoneString(phone);
  if (fullString.length === 10) {
    let i = 0;
    return phonePattern.replace(hashRegex, () => fullString[i++] || '');
  }
  return '';
};

export const hasHomePhone = formData =>
  getPhoneString(formData?.veteran?.homePhone).length === 10;
export const hasMobilePhone = formData =>
  getPhoneString(formData?.veteran?.mobilePhone).length === 10;

export const hasHomeAndMobilePhone = formData =>
  hasHomePhone(formData) && hasMobilePhone(formData);
