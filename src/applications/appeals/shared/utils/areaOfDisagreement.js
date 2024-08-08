import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

import {
  MAX_LENGTH,
  SUBMITTED_DISAGREEMENTS,
  DISAGREEMENT_TYPES,
} from '../constants';
import { getIssueName } from './issues';

/**
 * @typedef AreaOfDisagreementOptions
 * @type {object}
 * @property {boolean} serviceConnection
 * @property {boolean} effectiveDate
 * @property {boolean} evaluation
 */
/**
 * @typedef AreaOfDisagreementPage
 * @type {object}
 * @property {object} attributes - Attributes of issue
 * @property {AreaOfDisagreementOptions} disagreementOptions
 * @property {string} otherEntry - Free text input
 */
/**
 * @typedef FormDataAreaOfDisagreement
 * @type {AreaOfDisagreementPage[]}
 */

/**
 * Compare currently selected issues with previously selected issues and copy
 * over the area of disagreement selections if the issue persists
 * @param {array} newIssues - currently selected issues
 * @param {array} existingIssues - previously selected issues
 * @returns {FormDataAreaOfDisagreement}
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
 * @param {AreaOfDisagreementPage} areaOfDisagreement
 * @returns {number}
 */
export const calculateOtherMaxLength = areaOfDisagreement => {
  // Schema has a max length of 90 characters for the areaOfDisagreement value
  // We include fixed text for each selected option with the left over for the
  // free-text "other reason" input to use up the remaining characters
  const options = areaOfDisagreement?.disagreementOptions || {};
  const stringLength = Object.keys(options).reduce((totalLength, key) => {
    if (key !== 'otherEntry' && options[key]) {
      // add one for the comma
      return totalLength + SUBMITTED_DISAGREEMENTS[key].length + 1;
    }
    return totalLength;
  }, 0);
  return MAX_LENGTH.DISAGREEMENT_REASON - stringLength;
};

export const disagreeWith = (data = {}, { prefix = 'Disagree with' } = {}) => {
  const list = Object.keys(DISAGREEMENT_TYPES).map(type => {
    if (type === 'otherEntry') {
      return data?.otherEntry || '';
    }
    return data?.disagreementOptions?.[type]
      ? DISAGREEMENT_TYPES[type]?.toLowerCase()
      : '';
  });
  return `${prefix} ${readableList(list)}`.trim();
};
