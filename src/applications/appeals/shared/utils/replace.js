import { parseISODate } from 'platform/forms-system/src/js/helpers';
import { REGEXP } from '../constants';
import { addLeadingZero, coerceStringValue } from '.';

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