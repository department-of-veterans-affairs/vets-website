import { DISPLAY_CONDITIONS } from './display-conditions';
import { ROUTES } from '../constants';

// Create an array of all questions in the flow in order
const ROADMAP = Object.keys(DISPLAY_CONDITIONS);

// Get the position of a given question in the ROADMAP
const ROADMAP_INDEX = SHORT_NAME => ROADMAP.indexOf(SHORT_NAME);

// Get the SHORT_NAME of a given index in the ROADMAP
const ROADMAP_SHORT_NAME = index => ROADMAP[index];

// Evaluates whether a question should display
// Used when navigating forward and backward
export const areDisplayConditionsMet = (SHORT_NAME, formResponses) => {
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

// Responsible for determining next question in flow, or redirecting to a results screen
// Requires SHORT_NAME for current question, form answers in Redux store, and router for pushing to new URLs
export const navigateForward = (SHORT_NAME, formResponses, router) => {
  const currentIndex = ROADMAP_INDEX(SHORT_NAME);
  let nextIndex = null;

  if (currentIndex !== ROADMAP.length - 1) {
    nextIndex = currentIndex + 1;
  } else {
    // TODO go to a results page
  }

  while (nextIndex <= ROADMAP.length - 1) {
    if (!areDisplayConditionsMet(ROADMAP[nextIndex], formResponses)) {
      nextIndex += 1;
    } else {
      const shortName = ROADMAP_SHORT_NAME(nextIndex);
      const nextRoute = ROUTES[shortName];

      if (shortName && nextRoute) {
        router.push(nextRoute);
        return;
      }

      // eslint-disable-next-line no-console
      console.error('Unable to determine next question to display');
      return;
    }
  }
};
