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
