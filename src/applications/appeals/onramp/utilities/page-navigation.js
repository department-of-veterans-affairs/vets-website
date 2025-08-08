import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { displayConditionsMet } from './display-conditions';
import { ROUTES } from '../constants';
import { printErrorMessage } from '.';

/** ================================================================
 * Move to given route or error if route not found
 * @param {number} shortName - question to route to
 */
export const pushToRoute = (shortName, router) => {
  const newRoute = ROUTES?.[shortName];

  if (newRoute) {
    router.push(newRoute);
  } else {
    printErrorMessage('Unable to determine page to display');
  }
};

/** ================================================================
 * Responsible for determining next question in flow, or redirecting to a results page
 *
 * @param {array} allQuestionShortNames - all question SHORT_NAMEs in the app
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 */
export const navigateForward = (
  allQuestionShortNames,
  SHORT_NAME,
  formResponses,
  router,
) => {
  const currentIndex = allQuestionShortNames.indexOf(SHORT_NAME);
  const endIndex = allQuestionShortNames.length - 1;
  let nextIndex = currentIndex + 1;

  if (currentIndex === endIndex) {
    // TODO go to a results page
    // eslint-disable-next-line no-console
    console.log('Temporary message: this goes to a result page not yet built');
    return;
  }

  // We're looking for the next question that has display conditions met
  // so the loop helps us skip the ones that don't
  for (let i = currentIndex + 1; i < endIndex; i++) {
    const nextShortName = allQuestionShortNames?.[nextIndex];

    if (nextIndex > endIndex) {
      // TODO go to a results page
      // or log an error here that none of the display conditions were met within the loop
      // eslint-disable-next-line no-console
      console.log(
        'Temporary message: this goes to a result page not yet built',
      );
      return;
    }

    const displayConditionsForNextQuestion =
      DISPLAY_CONDITIONS?.[nextShortName];

    if (displayConditionsForNextQuestion) {
      if (
        displayConditionsMet(formResponses, displayConditionsForNextQuestion)
      ) {
        pushToRoute(nextShortName, router);
        return;
      }

      nextIndex += 1;
    } else {
      printErrorMessage('Unable to determine flow');
    }
  }
};
