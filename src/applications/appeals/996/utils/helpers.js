import { startOfToday, addYears, isAfter, isValid } from 'date-fns';

import { processContestableIssues } from '../../shared/utils/issues';
import { parseDateToDateObj } from '../../shared/utils/dates';
import '../../shared/definitions';
import { FORMAT_YMD_DATE_FNS } from '../../shared/constants';

/**
 * Determine if we're in the v1 flow using the save-in-progress data
 * @param {*} formData
 * @returns boolean
 */
export const isVersion1Data = formData => !!formData?.zipCode5;

/**
 * Filter out ineligible contestable issues:
 * - remove issues more than one year past their decision date
 * - remove issues that are deferred
 * @param {ContestableIssues} - Array of both eligible & ineligible contestable
 *  issues, plus legacy issues
 * @return {ContestableIssues} - filtered list
 */
export const getEligibleContestableIssues = issues => {
  const today = startOfToday();
  const result = (issues || []).filter(issue => {
    const {
      approxDecisionDate = '',
      ratingIssueSubjectText = '',
      description = '',
    } = issue?.attributes || {};

    const isDeferred = [ratingIssueSubjectText, description]
      .join(' ')
      .includes('deferred');
    const date = parseDateToDateObj(approxDecisionDate, FORMAT_YMD_DATE_FNS);
    if (isDeferred || !isValid(date) || !ratingIssueSubjectText) {
      return false;
    }
    return isAfter(addYears(date, 1), today);
  });
  return processContestableIssues(result);
};

/**
 * Are there any legacy appeals in the API, or did the Veteran manually add an
 * issue of unknown legacy status?
 * @param {Number} legacyCount - legacy appeal array size
 * @returns {Boolean}
 */
export const mayHaveLegacyAppeals = ({
  legacyCount = 0,
  additionalIssues,
} = {}) => legacyCount > 0 || additionalIssues?.length > 0;

export const showNewHlrContent = formData => formData.hlrUpdatedContent;
export const hideNewHlrContent = formData => !formData.hlrUpdatedContent;
