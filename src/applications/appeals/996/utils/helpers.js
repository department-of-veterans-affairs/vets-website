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

export const showConferenceContact = formData =>
  formData.informalConferenceChoice === 'yes';
export const showConferenceVeteranPage = formData =>
  formData.informalConferenceChoice === 'yes' &&
  formData.informalConference === 'me';
export const showConferenceRepPages = formData =>
  formData.informalConferenceChoice === 'yes' &&
  formData.informalConference === 'rep';

export const checkNeedsFormDataUpdate = props => {
  const { formData } = props;
  const confContact = formData.informalConference;

  let confYesNo = formData.informalConferenceChoice;

  // *** Convert old informalConference data to new split values; not using a
  // migration because this is behind a feature toggle
  if (confYesNo === 'no' || confContact === 'no') {
    confYesNo = 'no';
  } else if (confYesNo === 'yes' || ['me', 'rep'].includes(confContact)) {
    confYesNo = 'yes';
  }
  formData.informalConferenceChoice = confYesNo;
  formData.informalConference = confContact;
};

/**
 * Redirect from "/opt-in" to "/authorization" in HLR update
 * Remove once HLR update is 100% released
 * @param {Object} formData - Form data from save-in-progress
 * @param {Array} savedForms - Array of form IDs
 * @param {String} returnUrl - URL of last saved page
 * @param {Object} formConfig - Full form config
 * @param {Object} router - React router
 */
export const checkNeedsRedirect = props => {
  const { formData, routes, router } = props;
  let { returnUrl } = props;

  const socOptIn = '/opt-in';
  const socAuth = '/authorization';

  // *** Check feature for showing new HLR content & check the return URL
  // "/authorization" will replace "/opt-in" path
  if (props.returnUrl === socOptIn) {
    returnUrl = socAuth;
  }

  // Check valid return URL; copied from RoutedSavableApp
  const isValidReturnUrl = checkValidPagePath(
    routes[routes.length - 1].pageList,
    formData,
    returnUrl,
  );

  if (isValidReturnUrl) {
    // Push to router if we changed the returnUrl
    router.push(returnUrl);
  } else {
    // redirect back to first page after introduction if returnUrl isn't
    // recognized as a valid path within the form
    const nextPagePath = getNextPagePath(
      routes[routes.length - 1].pageList,
      formData,
      '/introduction',
    );
    router.push(nextPagePath);
  }
};

export const onFormLoaded = props => {
  checkNeedsFormDataUpdate(props);
  checkNeedsRedirect(props);
};
