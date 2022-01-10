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
