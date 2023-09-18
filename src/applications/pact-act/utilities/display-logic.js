import { DISPLAY_CONDITIONS } from './display-conditions';
import { ROUTES } from '../constants';

// Create an array of all questions in the flow in order
const ROADMAP = Object.keys(DISPLAY_CONDITIONS);
const END_INDEX = ROADMAP.length - 1;

// Get the position of a given question in the ROADMAP
const ROADMAP_INDEX = SHORT_NAME => ROADMAP.indexOf(SHORT_NAME);

// Get the SHORT_NAME of a given index in the ROADMAP
const ROADMAP_SHORT_NAME = index => ROADMAP[index];

// Evaluates whether a question should display
// Used when navigating forward and backward
export const displayConditionsMet = (SHORT_NAME, formResponses) => {
  const displayConditionsForShortName = DISPLAY_CONDITIONS[SHORT_NAME];
  let displayConditionsAreMet = false;
  const listOfOtherQuestionsToEvaluate = Object.keys(
    displayConditionsForShortName,
  );

  // If display conditions are empty
  if (!listOfOtherQuestionsToEvaluate.length) {
    return true;
  }

  // If question has display conditions, loop through display conditions questions and
  // compare the required responses with the responses in the form data
  for (const questionShortName of listOfOtherQuestionsToEvaluate) {
    const formResponse = formResponses[questionShortName];
    const requiredResponses =
      DISPLAY_CONDITIONS?.[SHORT_NAME]?.[questionShortName];

    if (Array.isArray(formResponse)) {
      // TODO when multi-checkboxes are added
    } else if (!requiredResponses.includes(formResponse)) {
      return false;
    }

    displayConditionsAreMet = true;
  }

  return displayConditionsAreMet;
};

const displayConditionsForIndex = index =>
  DISPLAY_CONDITIONS?.[ROADMAP?.[index]];

const displayConditionsAreMet = (index, formResponses) => {
  return displayConditionsMet(ROADMAP?.[index], formResponses);
};

const pushToRoute = (index, router) => {
  const shortNameForPrev = ROADMAP_SHORT_NAME(index);
  const previousRoute = ROUTES?.[shortNameForPrev];

  if (previousRoute) {
    router.push(previousRoute);
  } else {
    // eslint-disable-next-line no-console
    console.error('Unable to determine question to display');
  }
};

// Responsible for determining next question in flow, or redirecting to a results screen
// Requires SHORT_NAME for current question, form answers and router
export const navigateForward = (SHORT_NAME, formResponses, router) => {
  const CURRENT_INDEX = ROADMAP_INDEX(SHORT_NAME);
  let nextIndex = CURRENT_INDEX + 1;

  if (CURRENT_INDEX === END_INDEX) {
    // TODO go to a results page
  }

  while (CURRENT_INDEX !== END_INDEX) {
    if (displayConditionsForIndex(nextIndex)) {
      // Found entry in DISPLAY_CONDITIONS for next question

      if (nextIndex > END_INDEX) {
        // TODO go to a results page
        // eslint-disable-next-line no-console
        console.error('Insert next question or results page');
        return;
      }

      if (displayConditionsAreMet(nextIndex, formResponses)) {
        pushToRoute(nextIndex, router);
        return;
      }

      nextIndex += 1;
    } else {
      // No entry in DISPLAY_CONDITIONS for next question
      // eslint-disable-next-line no-console
      console.error('Unable to determine next question to display');
      return;
    }
  }
};

// Responsible for determining previous question (answered) in the flow
// Requires SHORT_NAME for current question, form answers and router
export const navigateBackward = (SHORT_NAME, formResponses, router) => {
  const CURRENT_INDEX = ROADMAP_INDEX(SHORT_NAME);
  let previousIndex = CURRENT_INDEX - 1;

  if (CURRENT_INDEX === 0) {
    router.push(ROUTES.HOME);
  }

  while (CURRENT_INDEX > 0) {
    if (displayConditionsForIndex(previousIndex)) {
      // Found entry in DISPLAY_CONDITIONS for previous question

      if (previousIndex < 0) {
        router.push(ROUTES.HOME);
      }

      if (displayConditionsAreMet(previousIndex, formResponses)) {
        pushToRoute(previousIndex, router);
        return;
      }

      previousIndex -= 1;
    } else {
      // No entry in DISPLAY_CONDITIONS for previous question
      // eslint-disable-next-line no-console
      console.error('Unable to determine previous question to display');
      return;
    }
  }
};
