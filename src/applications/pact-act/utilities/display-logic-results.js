// Determines which results page to display

import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { NONE } from '../constants/display-conditions/results-pages';
import { SHORT_NAME_MAP } from '../constants/question-data-map';
import {
  filterForYesResponses,
  getQuestionBatch,
  getServicePeriodResponse,
  printErrorMessage,
  pushToRoute,
} from './shared';

/** ================================================================
 * Compares all "Yes" responses in the form flow to the requirements for each results
 * page based on service period response.
 * @param {array} yesShortNames - list of SHORT_NAMEs in the store with a "Yes" response
 * @param {object} pageDCsForFlow - display conditions for one results page for this service period flow
 */
export const responsesMatchResultsDCs = (yesShortNames, pageDCsForFlow) => {
  const onlyYesResponse = pageDCsForFlow?.ONLY;

  // Results page requires "Yes" response for specific question category (i.e. Camp Lejeune)
  if (onlyYesResponse) {
    if (yesShortNames?.length > 1) {
      return false;
    }

    return onlyYesResponse?.includes(getQuestionBatch(yesShortNames[0]));
  }

  const yesFromGroup = pageDCsForFlow?.YES;

  // Results page does not display if there are any "Yes" responses
  if (yesFromGroup === NONE) {
    return !yesShortNames?.length;
  }

  // Results page accepts a "Yes" response from one or more categories
  for (const shortName of yesShortNames) {
    const questionBatch = getQuestionBatch(shortName);

    if (!questionBatch) {
      return false;
    }

    if (yesFromGroup?.includes(questionBatch)) {
      return true;
    }
  }

  return false;
};

/** ================================================================
 * Evaluate formResponses and decide which results page to show
 *
 * @param {object} formResponses - all answers in the store
 */
export const determineResultsPage = (formResponses, router) => {
  const responseToServicePeriod = getServicePeriodResponse(formResponses);
  const { RESULTS_4 } = SHORT_NAME_MAP;

  const resultsPages = DISPLAY_CONDITIONS?.RESULTS;
  const yesShortNames = filterForYesResponses(formResponses);

  // Because Results 4 requires answers to specific questions rather than any answer in a batch,
  // it must be evaluated first when determining the results page as other results pages'
  // display conditions may also be true
  const pageDCsForResults4 =
    resultsPages?.[RESULTS_4]?.SERVICE_PERIOD_SELECTION?.[
      responseToServicePeriod
    ].YES;

  if (pageDCsForResults4) {
    let goToResults4 = false;

    for (const question of pageDCsForResults4) {
      if (yesShortNames.includes(question)) {
        goToResults4 = true;
        break;
      }
    }

    if (goToResults4) {
      pushToRoute(RESULTS_4, router);
      return;
    }
  }

  const filteredResultsPages = Object.keys(resultsPages).filter(
    page => page !== RESULTS_4,
  );

  for (const resultsPage of filteredResultsPages) {
    const pageDCsForFlow =
      resultsPages[resultsPage]?.SERVICE_PERIOD_SELECTION?.[
        responseToServicePeriod
      ];

    if (
      pageDCsForFlow &&
      responsesMatchResultsDCs(yesShortNames, pageDCsForFlow)
    ) {
      pushToRoute(resultsPage, router);
      return;
    }
  }

  printErrorMessage('Unable to determine results page');
};
