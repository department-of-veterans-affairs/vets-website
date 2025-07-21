import '../definitions';

/**
 * Combine area code and phone number & extension in a string; Not using the
 * va-telephone component because the va-radio-option description only accepts a
 * string value
 * @param {PhoneObject} phone
 * @returns {String} area code + phone number
 */
export const getPhoneString = (phone = {}) =>
  `${phone?.areaCode || ''}${phone?.phoneNumber || ''}`;

const getExtensionString = phone => {
  const extension = phone.extension || phone.phoneNumberExt;
  return extension ? `, ext. ${extension}` : '';
};

const hashRegex = /#/g;
const phonePattern = '###-###-####';

export const getFormattedPhone = phone => {
  if (!phone || !phone.phoneNumber) {
    return '';
  }

  const extensionString = getExtensionString(phone);

  if (phone.isInternational) {
    // International format: +xx xxxxxxx
    const fullNumber = phone.areaCode
      ? `${phone.areaCode}${phone.phoneNumber}`
      : phone.phoneNumber;
    return `+${phone.countryCode} ${fullNumber}${extensionString}`;
  }

  // Domestic format: xxx-xxx-xxxx
  const fullString = getPhoneString(phone);
  if (fullString.length === 10) {
    let i = 0;

    return (
      // eslint-disable-next-line no-plusplus
      phonePattern.replace(hashRegex, () => fullString[i++] || '') +
      extensionString
    );
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
