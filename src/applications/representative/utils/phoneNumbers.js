/**
 * @typedef {Object} ParsedPhoneNumber
 * @property {string} formattedPhoneNumber - 9-digit number with dashes added
 * @property {string} extension - the extension, can be any number of digits
 * @property {string} contact - the "raw" phone number, used to populate the tel: link
 */

/**
 * Parses a phone number string for use with the Telephone component.
 * @param phone {String} "raw" phone number. The first 9 digits are treated as the "main" number.
 * Any remaining digits are treated as the extension.
 * Non-digits preceding the extension are ignored.
 * @returns {ParsedPhoneNumber}
 */

export const parsePhoneNumber = phone => {
  const phoneUS = phone.replace(/^1-/, '');
  const re = /^(\d{3})[ -]*?(\d{3})[ -]*?(\d{4})\s?(\D*)?[ ]?(\d*)?/;
  const extension = phoneUS.replace(re, '$5').replace(/\D/g, '');
  const formattedPhoneNumber = extension
    ? phoneUS.replace(re, '$1-$2-$3 x$5').replace(/x$/, '')
    : phoneUS.replace(re, '$1-$2-$3');
  const contact = phoneUS.replace(re, '$1$2$3');

  return { formattedPhoneNumber, extension, contact };
};
