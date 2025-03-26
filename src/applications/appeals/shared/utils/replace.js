import { parseISODate } from 'platform/forms-system/src/js/helpers';

import { REGEXP } from '../constants';

/**
 * Detect non-string & return empty string if it isn't
 * @param {*} value
 * @return {string}
 */
const coerceStringValue = value => {
  if (typeof value === 'string') {
    return value;
  }
  return '';
};

/** Replace "percent" with "%" - see va.gov-team/issues/34810
 * Include spacing in regexp so:
 *  "10 percent " => "10% "
 *  "20 percent." => "20%."
 * @param {String} text - Text to replace
 * @returns {String}
 */
const replacePercent = text => text.replace(REGEXP.PERCENT, '%$2');

/**
 * Replace typographical quote with single quote
 * Lighthouse needs ASCII (Windows-1252) characters to build the PDF, but there
 * is no conversion in place (yet)
 * @param {String} text - Text to replace
 * @returns {String}
 */
const replaceApostrophe = text => text.replace(REGEXP.APOSTROPHE, "'");

/**
 * Replace extra whitespace & trim result
 * @param {String} text - Text to replace
 * @returns {String}
 */
export const replaceWhitespace = text =>
  text.replace(REGEXP.WHITESPACE, ' ').trim();

/**
 * Add leading zero to numbers < 10
 * using slice since we have some Veterans using older Safari versions that
 * don't support padStart or Intl.NumberFormat
 * @param {String} part - date part (month or day) to add leading zeros to
 * @returns {String}
 */
const addLeadingZero = part => `00${part || ''}`.slice(-2);

/** ***************** */

const descriptionTransformers = [
  coerceStringValue, // should be first
  // add more here
  replaceWhitespace,
  replacePercent,
];

/**
 * Replace specific content within the issue description
 * @param {String} text - text to modify
 * @returns {String}
 */
export const replaceDescriptionContent = text =>
  descriptionTransformers.reduce(
    (resultingText, transformer) => transformer(resultingText),
    text || '',
  );

const submitTransformers = [
  coerceStringValue, // should be first
  // add more here
  replaceWhitespace,
  replaceApostrophe,
];

/**
 * Replace problematic characters preventing submission to Lighthouse
 * @param {String} text - text to modify
 * @returns {String}
 */
export const replaceSubmittedData = text =>
  submitTransformers.reduce(
    (resultingText, transformer) => transformer(resultingText),
    text || '',
  );

/**
 * Change a date string with no leading zeros (e.g. 2020-1-2) into a date with
 * leading zeros (e.g. 2020-01-02) as expected in the schema
 * @param {String} dateString YYYY-M-D or YYYY-MM-DD date string
 * @returns {String} YYYY-MM-DD date string
 */
export const fixDateFormat = date => {
  const dateString = coerceStringValue(date).replace(REGEXP.WHITESPACE, '');
  if (dateString.length === 10 || dateString === '') {
    return dateString;
  }
  const { day, month, year } = parseISODate(dateString);
  return `${year}-${addLeadingZero(month)}-${addLeadingZero(day)}`;
};
