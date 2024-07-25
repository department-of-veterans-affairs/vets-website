import { startOfToday, addYears, isAfter, isValid } from 'date-fns';

import {
  getNextPagePath,
  checkValidPagePath,
} from 'platform/forms-system/src/js/routing';

import {
  processContestableIssues,
  isDisqualifyingIssue,
} from '../../shared/utils/issues';
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
 * - remove issues that are disqualifying
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

    const date = parseDateToDateObj(approxDecisionDate, FORMAT_YMD_DATE_FNS);
    if (
      !ratingIssueSubjectText ||
      isDisqualifyingIssue(ratingIssueSubjectText, description) ||
      !isValid(date)
    ) {
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

/**
 * Redirect from "/opt-in" to "/authorization" in HLR update
 * Remove once HLR update is 100% released
 * @param {Object} formData - Form data from save-in-progress
 * @param {Array} savedForms - Array of form IDs
 * @param {String} returnUrl - URL of last saved page
 * @param {Object} formConfig - Full form config
 * @param {Object} router - React router
 */
export const onFormLoaded = props => {
  const { formData } = props;
  let { returnUrl } = props;

  // Check feature for showing new HLR content & check the return URL
  // "/authorization" will replace "/opt-in" path
  if (showNewHlrContent(formData) && returnUrl === '/opt-in') {
    returnUrl = '/authorization';
  } else if (hideNewHlrContent(formData) && returnUrl === '/authorization') {
    // return to opt in page if toggle is disabled
    returnUrl = '/opt-in';
  }

  // Check valid return URL; copied from RoutedSavableApp
  const isValidReturnUrl = checkValidPagePath(
    props.routes[props.routes.length - 1].pageList,
    formData,
    returnUrl,
  );
  if (isValidReturnUrl) {
    props.router.push(returnUrl);
  } else {
    // redirect back to first page after introduction if returnUrl isn't
    // recognized as a valid path within the form
    const nextPagePath = getNextPagePath(
      props.routes[props.routes.length - 1].pageList,
      formData,
      '/introduction',
    );
    props.router.push(nextPagePath);
  }
};
