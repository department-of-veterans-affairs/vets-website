/**
 * @param {string} phoneString
 */
const formatPhone = phoneString => {
  let returnString = phoneString;
  const match = phoneString.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? '+1 ' : '';
    returnString = [intlCode, match[2], '-', match[3], '-', match[4]].join('');
  }
  return returnString;
};

/**
 * @param {string} demographicString
 */
const formatDemographicString = demographicString => {
  const phoneMatch = demographicString.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

  if (phoneMatch) {
    return formatPhone(demographicString);
  }

  return demographicString;
};

/**
 * @param {string} str
 */

const toCamelCase = str => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toLowerCase() + word.slice(1);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
};

export { formatPhone, formatDemographicString, toCamelCase };
