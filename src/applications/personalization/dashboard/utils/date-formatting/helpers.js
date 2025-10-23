/**
 *
 * @param {string} date in the format of 'year-month-day' e.g. 2023-12-07
 * @returns {string} in the format of 'year/month/day' e.g. 2023/12/07
 */

export const replaceDashesWithSlashes = date => {
  return date.replace(/-/g, '/');
};
