import { RESPONSES } from '../constants/question-data-map';
import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { BATCH_MAP } from '../constants/question-batch-map';
import { NONE } from '../constants/display-conditions/results-screens';
import {
  getServicePeriodResponse,
  printErrorMessage,
  pushToRoute,
} from './shared';

/** ================================================================
 * Find batch (category) for question SHORT_NAME
 */
export const getQuestionBatch = shortName => {
  for (const batch of Object.keys(BATCH_MAP)) {
    if (BATCH_MAP[batch]?.includes(shortName)) {
      return batch;
    }
  }

  return null;
};

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
 * Removes all answers in the store that are not "Yes"
 *
 * @param {object} formResponses - all answers in the store
 */
export const filterForYesResponses = formResponses => {
  return Object.keys(
    Object.filter(formResponses, response => response === RESPONSES.YES),
  );
};

/** ================================================================
 * Evaluate formResponses and decide which results page to show
 *
 * @param {object} formResponses - all answers in the store
 */
export const determineResultsPage = (formResponses, router) => {
  const responseToServicePeriod = getServicePeriodResponse(formResponses);

  const allResultsDCs = DISPLAY_CONDITIONS?.RESULTS;
  const yesShortNames = filterForYesResponses(formResponses);

  for (const resultsPage of Object?.keys(allResultsDCs)) {
    const pageDCsForFlow =
      allResultsDCs[resultsPage]?.SERVICE_PERIOD_SELECTION?.[
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
