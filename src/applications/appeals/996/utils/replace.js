import { parseISODate } from 'platform/forms-system/src/js/helpers';

/** Replace "percent" with "%" - see va.gov-team/issues/34810
 * Include spacing in regexp so:
 *  "10 percent " => "10% "
 *  "20 percent." => "20%."
 */
const percentRegex = /(\s|\b)percent(\s|\b)/gi;
const replacePercent = text => text.replace(percentRegex, '%$2');

const transformers = [
  // add more here
  replacePercent,
];

/**
 * Replace specific content within the issue description
 * @param {String} text - text to modify
 * @returns {String}
 */
export const replaceDescriptionContent = text =>
  transformers.reduce(
    (resultingText, transformer) => transformer(resultingText),
    text || '',
  );

/**
 * Replace typographical quote with single quote
 * Lighthouse needs ASCII (Windows-1252) characters to build the PDF, but there
 * is no conversion in place (yet)
 */
const apostropheRegex = /\u2019/g;
const replaceApostrophe = text => text.replace(apostropheRegex, "'");

const submitTransformers = [
  // add more here
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

const whiteSpaceRegex = /\s/g;
// Add leading zero to date month or day; but use slice since we have some
// Veterans using older Safari versions that don't support padStart
const addLeadingZero = part => `00${part || ''}`.slice(-2);

/**
 * Change a date string with no leading zeros (e.g. 2020-1-2) into a date with
 * leading zeros (e.g. 2020-01-02) as expected in the schema
 * @param {String} dateString YYYY-M-D or YYYY-MM-DD date string
 * @returns {String} YYYY-MM-DD date string
 */
export const fixDateFormat = date => {
  const dateString = (date || '').replace(whiteSpaceRegex, '');
  if (dateString.length === 10) {
    return dateString;
  }
  const { day, month, year } = parseISODate(dateString);
  return `${year}-${addLeadingZero(month)}-${addLeadingZero(day)}`;
};
