import { isValid, startOfDay, isBefore } from 'date-fns';

import { AMA_DATE } from '../constants';

import { processContestableIssues } from '../../shared/utils/issues';
import { parseDateToDateObj } from '../../shared/utils/dates';
import '../../shared/definitions';
import { FORMAT_YMD_DATE_FNS } from '../../shared/constants';

/**
 * Filter out ineligible contestable issues:
 * - remove issues with an invalid decision date
 * - remove issues that are deferred
 * @param {ContestableIssues} - Array of both eligible & ineligible contestable
 *  issues, plus legacy issues
 * @return {ContestableIssues} - filtered list
 */
export const getEligibleContestableIssues = issues => {
  const result = (issues || []).filter(issue => {
    const {
      approxDecisionDate,
      ratingIssueSubjectText = '',
      description = '',
    } = issue?.attributes || {};

    const isDeferred = [ratingIssueSubjectText, description]
      .join(' ')
      .includes('deferred');
    return (
      !isDeferred &&
      ratingIssueSubjectText &&
      approxDecisionDate &&
      isValid(parseDateToDateObj(approxDecisionDate, FORMAT_YMD_DATE_FNS))
    );
  });
  return processContestableIssues(result);
};

const amaCutoff = startOfDay(parseDateToDateObj(AMA_DATE, FORMAT_YMD_DATE_FNS));
/**
 * Are there any legacy appeals in the API, or did the Veteran manually add an
 * issue of unknown legacy status?
 * @param {Number} legacyCount - legacy appeal array size
 * @returns {Boolean}
 */
export const mayHaveLegacyAppeals = ({
  legacyCount = 0,
  contestedIssues = [],
  additionalIssues = [],
} = {}) => {
  if (legacyCount > 0 || additionalIssues?.length > 0) {
    return true;
  }
  return contestedIssues?.some(issue => {
    const decisionDate = startOfDay(
      parseDateToDateObj(
        issue.attributes.approxDecisionDate,
        FORMAT_YMD_DATE_FNS,
      ),
    );
    return isBefore(decisionDate, amaCutoff);
  });
};
