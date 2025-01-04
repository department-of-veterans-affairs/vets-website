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
  const phoneRegex = /^(?:\+?(?<intl>\d{1,}?)[ -.]*)?\(?(?<ac>\d{3})\)?[- .]*(?<pfx>\d{3})[- .]*(?<linenum>\d{4}),?(?: ?e?xt?e?n?s?i?o?n?\.? ?(?<ext>\d*))?$/i;
  const match = phoneRegex.exec(phone);
  const { intl, ac, pfx, linenum, ext } = match?.groups;
  // must have at least ac, pfx, and linenum
  if (!match || !ac || !pfx || !linenum) {
    return {
      contact: phone,
      extension: '',
      processed: false,
      international: false,
      countryCode: '',
    };
  }

  return {
    contact: `${ac}${pfx}${linenum}`,
    extension: ext,
    processed: true,
    international: !!intl,
    countryCode: intl && intl !== '1' ? intl : undefined,
  };
};
