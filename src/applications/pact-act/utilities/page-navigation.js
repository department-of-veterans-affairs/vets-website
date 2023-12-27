import { ROUTES } from '../constants';
import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { displayConditionsMet, makeRoadmap } from './display-logic-questions';
import { determineResultsPage } from './display-logic-results';
import {
  getServicePeriodResponse,
  printErrorMessage,
  pushToRoute,
} from './shared';
import { SHORT_NAME_MAP } from '../constants/question-data-map';

/** ================================================================
 * Responsible for determining next question in flow, or redirecting to a results screen
 *
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 * @param {func} updateCurrentPage - action for setting the question SHORT_NAME in the store for breadcrumbs
 */
export const navigateForward = (
  SHORT_NAME,
  formResponses,
  router,
  updateCurrentPage,
) => {
  const roadmap = makeRoadmap(getServicePeriodResponse(formResponses));

  if (roadmap?.length) {
    const CURRENT_INDEX = roadmap?.indexOf(SHORT_NAME);
    const END_INDEX = roadmap?.length - 1;
    let nextIndex = CURRENT_INDEX + 1;

    if (CURRENT_INDEX === END_INDEX) {
      determineResultsPage(formResponses, router, updateCurrentPage);
      return;
    }

    while (CURRENT_INDEX !== END_INDEX) {
      const nextShortName = roadmap?.[nextIndex];

      if (nextIndex > END_INDEX) {
        // No questions after this one in the flow have their display conditions met
        // Most likely a results page should show
        determineResultsPage(formResponses, router, updateCurrentPage);
        return;
      }

      if (DISPLAY_CONDITIONS?.[nextShortName]) {
        // Found entry in DISPLAY_CONDITIONS for next question
        if (displayConditionsMet(nextShortName, formResponses)) {
          pushToRoute(nextShortName, router, updateCurrentPage);
          return;
        }

        nextIndex += 1;
      } else {
        // No entry in DISPLAY_CONDITIONS for next question
        printErrorMessage('Unable to determine next question to display');
        return;
      }
    }
  } else {
    printErrorMessage('Unable to determine flow');
  }
};

/** ================================================================
 * Responsible for determining previous question (answered) in the flow
 *
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 * @param {func} updateCurrentPage - action for setting the question SHORT_NAME in the store for breadcrumbs
 */
export const navigateBackward = (
  SHORT_NAME,
  formResponses,
  router,
  updateCurrentPage,
) => {
  const roadmap = makeRoadmap(getServicePeriodResponse(formResponses));

  if (roadmap?.length) {
    const CURRENT_INDEX = roadmap?.indexOf(SHORT_NAME);
    let previousIndex = CURRENT_INDEX - 1;

    if (CURRENT_INDEX === 0) {
      updateCurrentPage(SHORT_NAME_MAP.HOME);
      router.push(ROUTES.HOME);
    }

    while (CURRENT_INDEX > 0) {
      const previousShortName = roadmap?.[previousIndex];

      if (DISPLAY_CONDITIONS?.[previousShortName]) {
        // Found entry in DISPLAY_CONDITIONS for previous question
        if (displayConditionsMet(previousShortName, formResponses)) {
          pushToRoute(previousShortName, router, updateCurrentPage);
          return;
        }

        previousIndex -= 1;
      } else {
        // No entry in DISPLAY_CONDITIONS for previous question
        printErrorMessage('Unable to determine next question to display');
        return;
      }
    }
  } else {
    printErrorMessage('Unable to determine flow');
  }
};
