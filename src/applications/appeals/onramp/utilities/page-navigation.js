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
  const CURRENT_INDEX = allQuestionShortNames.indexOf(SHORT_NAME);
  const END_INDEX = allQuestionShortNames.length - 1;
  let nextIndex = CURRENT_INDEX + 1;

  if (CURRENT_INDEX === END_INDEX) {
    // TODO go to a results page
    // eslint-disable-next-line no-console
    console.log('Temporary message: this goes to a result page not yet built');
    return;
  }

  // We're looking for the next question that has display conditions met
  // so the loop helps us skip the ones that don't
  while (CURRENT_INDEX !== END_INDEX) {
    const nextShortName = allQuestionShortNames?.[nextIndex];

    if (nextIndex > END_INDEX) {
      // TODO go to a results page
      // eslint-disable-next-line no-console
      console.log(
        'Temporary message: this goes to a result page not yet built',
      );
      return;
    }

    const displayConditionsForNextQuestion =
      DISPLAY_CONDITIONS?.[nextShortName];

    if (displayConditionsForNextQuestion) {
      // Found entry in DISPLAY_CONDITIONS for next question
      if (
        displayConditionsMet(formResponses, displayConditionsForNextQuestion)
      ) {
        if (nextShortName) {
          pushToRoute(nextShortName, router);
          return;
        }

        printErrorMessage('Unable to determine page to display');
        return;
      }

      nextIndex += 1;
    } else {
      printErrorMessage('Unable to determine flow');
    }
  }
};

// TODO remove if not needed

/** ================================================================
 * Responsible for determining previous question (answered) in the flow
 *
 * @param {array} allQuestionShortNames - all question SHORT_NAMEs in the app
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 */
// export const navigateBackward = (
//   allQuestionShortNames,
//   SHORT_NAME,
//   formResponses,
//   router,
// ) => {
//   const CURRENT_INDEX = allQuestionShortNames?.indexOf(SHORT_NAME);
//   let previousIndex = CURRENT_INDEX - 1;

//   if (CURRENT_INDEX === 0) {
//     pushToRoute('INTRODUCTION', router);
//     return;
//   }

//   while (CURRENT_INDEX > 0) {
//     const previousShortName = allQuestionShortNames?.[previousIndex];
//     const displayConditionsForPreviousQuestion =
//       DISPLAY_CONDITIONS?.[previousShortName];

//     if (DISPLAY_CONDITIONS?.[previousShortName]) {
//       // Found entry in DISPLAY_CONDITIONS for previous question
//       if (
//         displayConditionsMet(
//           formResponses,
//           displayConditionsForPreviousQuestion,
//         )
//       ) {
//         pushToRoute(previousShortName, router);
//         return;
//       }

//       previousIndex -= 1;
//     } else {
//       // No entry in DISPLAY_CONDITIONS for previous question
//       printErrorMessage('Unable to determine next question to display');
//       return;
//     }
//   }
// };
