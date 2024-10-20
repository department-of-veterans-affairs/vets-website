import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { displayConditionsMet, makeRoadmap } from './display-logic-questions';
import { printErrorMessage, pushToRoute } from './shared';
import { ROUTES } from '../constants';

/** ================================================================
 * Responsible for determining previous question in the flow,
 * logic is added to account for scenarios where we may need
 * to change the route tree by going backward during edit mode.
 *
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 */

export const navigateBackward = (
  router,
  setRouteMap,
  routeMap,
  shortName,
  editMode,
  isForkableQuestion,
  valueHasChanged,
) => {
  const lastRoute = routeMap[routeMap.length - 2];

  if (routeMap.length > 2) {
    if (editMode && isForkableQuestion && valueHasChanged) {
      // When clicking back during edit mode we want to show the previous question in the flow for forkable questions.
      // We edit the route map, save it and push the correct route based on the current question.
      const indexOfQuestion = routeMap.indexOf(ROUTES[shortName]);
      const newRouteMap = routeMap.slice(0, indexOfQuestion);

      setRouteMap(newRouteMap);
      router.push(newRouteMap[newRouteMap.length - 1]);
    } else if (editMode) {
      // For non-forkable questions we want to go back to the review screen.
      router.push(routeMap[routeMap.length - 1]);
    } else {
      //  All other back question logic.
      setRouteMap(routeMap.slice(0, -1));
      router.push(lastRoute);
    }
  } else {
    // Initial question back logic.
    router.push(lastRoute);
  }
};

/** ================================================================
 * Responsible for determining next question in flow, or redirecting to a results screen.
 * Also we build a routemap for proper navigation of back/continue buttons.
 *
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 */
export const navigateForward = (
  SHORT_NAME,
  formResponses,
  router,
  editMode,
  setRouteMap,
  routeMap,
  questionFlowChanged,
  valueHasChanged,
  questionSelectedToEdit,
) => {
  const roadmap = makeRoadmap();
  if (roadmap?.length) {
    const CURRENT_INDEX = roadmap?.indexOf(SHORT_NAME);
    const END_INDEX = roadmap?.length - 1;
    let nextIndex = CURRENT_INDEX + 1;
    const localRoadMap = [...routeMap];

    if (CURRENT_INDEX === END_INDEX) {
      // Results logic

      return;
    }

    while (CURRENT_INDEX !== END_INDEX) {
      const nextShortName = roadmap?.[nextIndex];

      if (nextIndex > END_INDEX) {
        // No questions after this one in the flow have their display conditions met
        // Results logic
        return;
      }

      if (DISPLAY_CONDITIONS?.[nextShortName]) {
        // Found entry in DISPLAY_CONDITIONS for next question.
        // Also accounts for editing answers and if there are answers already saved, we continue routing to review page.
        if (
          displayConditionsMet(nextShortName, formResponses) &&
          !formResponses[nextShortName] &&
          editMode
        ) {
          // This logic builds the routemap of questions that may have been skipped,
          // allowing the usage of the back button to previous questions in the flow.
          if (routeMap[routeMap.length - 1] !== ROUTES?.[nextShortName]) {
            if (valueHasChanged) {
              const index = routeMap.indexOf(ROUTES[SHORT_NAME]);
              const newRouteMap = routeMap.slice(0, index + 1);
              setRouteMap([...newRouteMap, ROUTES?.[nextShortName]]);
            } else {
              setRouteMap([...routeMap, ROUTES?.[nextShortName]]);
            }
          }

          pushToRoute(nextShortName, router);
          return;
        }

        // This handles the edge case of the edit question not being skipped
        // when going thru an edit flow.
        if (questionSelectedToEdit === nextShortName) {
          setRouteMap([...localRoadMap, ROUTES?.[nextShortName]]);
          pushToRoute(nextShortName, router);
          return;
        }

        // Continue through the flow until you reach Review page or
        // or you find a question without an answer.
        if (
          displayConditionsMet(nextShortName, formResponses) &&
          !editMode &&
          formResponses[nextShortName] &&
          questionFlowChanged
        ) {
          if (formResponses[nextShortName]) {
            localRoadMap.push(ROUTES?.[nextShortName]);
          }
          nextIndex += 1;
        } else if (
          displayConditionsMet(nextShortName, formResponses) &&
          !editMode
        ) {
          if (routeMap[routeMap.length - 1] !== ROUTES?.[nextShortName]) {
            setRouteMap([...localRoadMap, ROUTES?.[nextShortName]]);
          }

          pushToRoute(nextShortName, router);
          return;
        } else {
          nextIndex += 1;
        }
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
