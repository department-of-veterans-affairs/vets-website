import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { displayConditionsMet, makeRoadmap } from './display-logic-questions';
import { printErrorMessage, pushToRoute } from './shared';

export const navigateBackward = router => {
  router.goBack();
};

/** ================================================================
 * Responsible for determining next question in flow, or redirecting to a results screen
 *
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 */
export const navigateForward = (SHORT_NAME, formResponses, router) => {
  const roadmap = makeRoadmap();

  if (roadmap?.length) {
    const CURRENT_INDEX = roadmap?.indexOf(SHORT_NAME);
    const END_INDEX = roadmap?.length - 1;
    let nextIndex = CURRENT_INDEX + 1;

    if (CURRENT_INDEX === END_INDEX) {
      // Results logic

      return;
    }

    while (CURRENT_INDEX !== END_INDEX) {
      const nextShortName = roadmap?.[nextIndex];

      if (nextIndex > END_INDEX) {
        // No questions after this one in the flow have their display conditions met
        // Most likely a results page should show

        // Results logic
        return;
      }

      if (DISPLAY_CONDITIONS?.[nextShortName]) {
        // Found entry in DISPLAY_CONDITIONS for next question.
        // Also accounts for editing answers and if there are answers already saved, we continue routing to review page.
        if (
          displayConditionsMet(nextShortName, formResponses) &&
          !formResponses[nextShortName]
        ) {
          pushToRoute(nextShortName, router);
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
