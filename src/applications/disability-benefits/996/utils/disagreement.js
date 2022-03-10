import { MAX_LENGTH, SUBMITTED_DISAGREEMENTS } from '../constants';
import { getIssueName } from './helpers';

/**
 * @typedef AreaOfDisagreement~Options
 * @type {object}
 * @property {boolean} serviceConnection
 * @property {boolean} effectiveDate
 * @property {boolean} evaluation
 */
/**
 * @typedef AreaOfDisagreement~Page
 * @type {object}
 * @property {object} attributes - Attributes of issue
 * @property {AreaOfDisagreement~Options} disagreementOptions
 * @property {string} otherEntry - Free text input
 */
/**
 * @typedef FormData~AreaOfDisagreement
 * @type {AreaOfDisagreement~Page[]}
 */

/**
 * Compare currently selected issues with previously selected issues and copy
 * over the area of disagreement selections if the issue persists
 * @param {array} newIssues - currently selected issues
 * @param {array} existingIssues - previously selected issues
 * @returns {FormData~AreaOfDisagreement}
 */
export const copyAreaOfDisagreementOptions = (newIssues, existingIssues) => {
  return newIssues.map(issue => {
    const foundIssue = (existingIssues || []).find(
      entry => getIssueName(entry) === getIssueName(issue),
    );
    if (foundIssue) {
      const { disagreementOptions = {}, otherEntry = '' } = foundIssue;
      return {
        ...issue,
        disagreementOptions,
        otherEntry,
      };
    }
    return issue;
  });
};

/**
 * Calculate schema max length of area of disagreement "other" free text input
 * for a specific page
 * @param {AreaOfDisagreement~Page} formData
 * @returns {number}
 */
export const calculateOtherMaxLength = formData => {
  // Schema has a max length of 90 characters for the areaOfDisagreement value
  // We include fixed text for each selected option with the left over for the
  // free-text "other reason" input to use up the remaining characters
  const options = formData?.disagreementOptions || {};
  const stringLength = Object.keys(options).reduce((totalLength, key) => {
    if (options[key]) {
      // add one for the comma
      return totalLength + SUBMITTED_DISAGREEMENTS[key].length + 1;
    }
    return totalLength;
  }, 0);
  return MAX_LENGTH.DISAGREEMENT_REASON - stringLength;
};
