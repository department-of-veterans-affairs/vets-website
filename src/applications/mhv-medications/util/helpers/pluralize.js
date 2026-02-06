/**
 * Pluralizes a phrase based on the count provided
 * @param {number} count the count of the items being pluralized
 * @param {string} singular the singular form of the word
 * @param {string} plural the plural form of the word
 * @returns singular or plural form based on the count
 */
const pluralize = (count, singular, plural) =>
  count === 1 ? singular : plural;

export default pluralize;
