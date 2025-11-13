import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { displayConditionsMet } from './display-conditions';
import { ROUTES } from '../constants';
import { printErrorMessage } from '.';
import { isNonDR } from '../constants/results-data-map';

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

const determineResultsPage = (
  allResultsShortNames,
  formResponses,
  router,
  updateResultsPage,
) => {
  for (const resultPage of allResultsShortNames) {
    const displayConditionsForResultPage = DISPLAY_CONDITIONS?.[resultPage];

    if (displayConditionsMet(formResponses, displayConditionsForResultPage)) {
      updateResultsPage(resultPage);

      if (isNonDR.includes(resultPage)) {
        pushToRoute('RESULTS_NON_DR', router);
      } else {
        pushToRoute('RESULTS_DR', router);
      }
      return;
    }
  }

  printErrorMessage('Unable to determine results page');
};

/** ================================================================
 * Responsible for determining next question in flow, or redirecting to a results page
 *
 * @param {array} allQuestionShortNames - all question SHORT_NAMEs in the app
 * @param {array} allResultsShortNames - all results SHORT_NAMEs in the app
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 * @param {func} updateResultsPage - function to update results page in the store
 */
export const navigateForward = (
  allQuestionShortNames,
  allResultsShortNames,
  SHORT_NAME,
  formResponses,
  router,
  updateResultsPage,
) => {
  const currentIndex = allQuestionShortNames.indexOf(SHORT_NAME);
  const endIndex = allQuestionShortNames.length - 1;
  let nextIndex = currentIndex + 1;

  if (currentIndex === endIndex) {
    determineResultsPage(
      allResultsShortNames,
      formResponses,
      router,
      updateResultsPage,
    );
    return;
  }

  // We're looking for the next question that has display conditions met
  // so the loop helps us skip the ones that don't
  // We allow one additional loop after we run out of questions
  // to check if we're at a results page
  for (let i = currentIndex + 1; i <= endIndex + 1; i++) {
    const nextShortName = allQuestionShortNames?.[nextIndex];

    if (nextIndex > endIndex) {
      determineResultsPage(
        allResultsShortNames,
        formResponses,
        router,
        updateResultsPage,
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
