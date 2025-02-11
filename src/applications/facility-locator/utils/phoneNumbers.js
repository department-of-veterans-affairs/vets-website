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
  // This regex has named capture groups for the international code (optional), area code, prefix, line number, and extension.
  // in regular expressions (?<name>...) is a named capture group, therefore you can reference the group by its name
  // The international code (intl) is optional. Someone may write +1 ac, +1 (ac), 1 (ac), 1-ac, 1.ac or 1ac or just ac, (ac), or ac.
  // the intl need not be separated by space, dash or period from the ac
  // The ac is the area code and is expected to be 3 digits exactly
  // The pfx is the prefix and is expected to be 3 digits exactly
  // The linenum is the line number and is expected to be 4 digits exactly
  // ac/pfx/linenum _can_ be separated by space, dash or period or repeats of those characters
  // The extension is optional and is expected to be a number after the required capture groups
  // The extension is at least separated by an "x" or "ext" or "extension" or "ext." or "x." or "ext." or "extension."
  // Since the intl group is greedy, if there is a number like +63285503888 (the Philippines VA Medical Center)
  // it will be captured as intl=6, ac=328, pfx=550, linenum=3888 because the ac, pfx, and linenum are required to be a certain length
  // However, if it is entered as +063285503888, it will be captured as intl=06, ac=328, pfx=550, linenum=3888
  // This is because the intl group can expand to capture the 0, but the ac, pfx, and linenum groups are required to be a certain length
  // Similarly if it is entered as: +01163285503888 it will be captured as intl=0116, ac=328, pfx=550, linenum=3888
  // At some point we may wish to remove the 0 and 011 from the intl group, but it is unlikely to be entered
  const phoneRegex = /^(?:\+?(?<intl>\d{1,}?)[ -.]*)?\(?(?<ac>\d{3})\)?[- .]*(?<pfx>\d{3})[- .]*(?<linenum>\d{4}),?(?: ?e?xt?e?n?s?i?o?n?\.? ?(?<ext>\d*))?$/i;
  const match = phoneRegex.exec(phone);

  const errorObject = {
    contact: phone,
    extension: undefined,
    processed: false,
    international: false,
    countryCode: '',
  };

  // must have at least match
  if (!match) {
    return errorObject;
  }

  const { intl, ac, pfx, linenum, ext } = match.groups;
  if (!ac || !pfx || !linenum) {
    return errorObject;
  }

  return {
    contact: `${ac}${pfx}${linenum}`,
    extension: ext,
    processed: true,
    international: !!intl,
    countryCode: intl && intl !== '1' ? intl : undefined,
  };
};
