import { DISPLAY_CONDITIONS } from './display-conditions';
import { SHORT_NAME_MAP } from '../constants/question-data-map';
import { ROUTES } from '../constants';

/** ================================================================
 * ROADMAP: Array of all question SHORT_NAMEs in order, regardless of whether they will display
 * ROADMAP_INDEX: Index of given SHORT_NAME
 * ROADMAP_SHORT_NAME: SHORT_NAME of given ROADMAP index
 */
export const ROADMAP = Object.keys(SHORT_NAME_MAP);
const END_INDEX = ROADMAP.length - 1;
export const ROADMAP_INDEX = SHORT_NAME => ROADMAP.indexOf(SHORT_NAME);
const ROADMAP_SHORT_NAME = index => ROADMAP[index];

/** ================================================================
 * Check form responses to see if they match the requirements in DISPLAY_CONDITIONS
 *
 * @param {array} requiredResponses Example: [NO, NOT_SURE]
 * @param {string} formResponse - answer in the store
 */
export const responseMatchesRequired = (requiredResponses, formResponse) => {
  return requiredResponses?.includes(formResponse);
};

/** ================================================================
 * Check form responses against an array of checkbox responses to see if they match
 * the requirements in DISPLAY_CONDITIONS
 */
export const validateMultiCheckboxResponses = (
  requiredResponses,
  formResponses,
  shortName,
) => {
  for (const checkbox of requiredResponses) {
    if (responseMatchesRequired(formResponses?.[shortName], checkbox)) {
      return true;
    }
  }

  return false;
};

/** ================================================================
 * If the display conditions contain ONE_OF, check all possible responses for a match
 *
 * @param {object} oneOfChoices
 *   Example: {
 *     BURN_PIT_2_1: [YES],
 *     BURN_PIT_2_1_1: [YES]
 *   }
 * @param {object} formResponses - all answers in the store
 */
export const evaluateOneOfChoices = (oneOfChoices, formResponses) => {
  for (const choice of Object.keys(oneOfChoices)) {
    if (
      Array.isArray(oneOfChoices[choice]) &&
      validateMultiCheckboxResponses(
        oneOfChoices[choice],
        formResponses,
        choice,
      )
    ) {
      return true;
    }

    if (
      responseMatchesRequired(oneOfChoices[choice], formResponses?.[choice])
    ) {
      return true;
    }
  }

  return false;
};

/** ================================================================
 * Check display conditions for each question against the answer in the store
 *
 * @param {object} formResponses - all answers in the store
 * @param {object} displayConditionsForPath (see simple and complex below)
 */
export const checkResponses = (formResponses, displayConditionsForPath) => {
  const questionRequirements = Object.keys(displayConditionsForPath);

  for (const questionShortName of questionRequirements) {
    const formResponse = formResponses?.[questionShortName];
    const requiredResponses = displayConditionsForPath[questionShortName];

    if (questionShortName !== 'ONE_OF') {
      if (Array.isArray(formResponse)) {
        return validateMultiCheckboxResponses(
          requiredResponses,
          formResponses,
          questionShortName,
        );
      }

      if (!responseMatchesRequired(requiredResponses, formResponse)) {
        return false;
      }
    } else {
      const oneOfChoicesMet = evaluateOneOfChoices(
        displayConditionsForPath?.ONE_OF,
        formResponses,
      );

      if (!oneOfChoicesMet) {
        return false;
      }
    }
  }

  return true;
};

/** ================================================================
 * Given display conditions, either:
 *   (simple) evaluate an object of questions, seeking true for all questions
 *   (complex) separately evaluate each SHORT / LONG path, seeking true for either
 *
 * @param {object} formResponses - all answers in the store
 * @param {object} displayConditionsForPath
 *   Simple example: {
 *     BURN_PIT_2_1: [YES],
 *     BURN_PIT_2_1_1: [YES]
 *   }
 *
 *   Complex example: {
 *     SHORT: {
 *       SERVICE_PERIOD: [DURING_BOTH_PERIODS],
 *       ONE_OF: {
 *         BURN_PIT_2_1: [YES],
 *         BURN_PIT_2_1_1: [YES],
 *       },
 *     },
 *     LONG: {
 *      SERVICE_PERIOD: [DURING_BOTH_PERIODS],
 *      BURN_PIT_2_1: [NO, NOT_SURE],
 *      BURN_PIT_2_1_1: [NO, NOT_SURE],
 *      BURN_PIT_2_1_2: [YES, NO, NOT_SURE],
 *    }
 *  }
 */
export const evaluateNestedAndForkedDCs = (
  formResponses,
  displayConditionsForPath,
) => {
  if (displayConditionsForPath?.SHORT) {
    const shortDisplayConditionsMet = checkResponses(
      formResponses,
      displayConditionsForPath.SHORT,
    );

    const longDisplayConditionsMet = checkResponses(
      formResponses,
      displayConditionsForPath.LONG,
    );

    return shortDisplayConditionsMet || longDisplayConditionsMet;
  }

  return checkResponses(formResponses, displayConditionsForPath);
};

/** ================================================================
 * Starting function for evaluating whether a question should display
 *
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 */
export const displayConditionsMet = (SHORT_NAME, formResponses) => {
  const displayConditionsForShortName = DISPLAY_CONDITIONS[SHORT_NAME];

  if (!Object.keys(displayConditionsForShortName).length) {
    return true;
  }

  const responseToServicePeriod =
    formResponses?.[SHORT_NAME_MAP.SERVICE_PERIOD];

  const pathsForShortName =
    displayConditionsForShortName?.SERVICE_PERIOD_SELECTION;
  const pathsFromServicePeriod = Object.keys(pathsForShortName);
  let displayConditionsForPath = pathsForShortName[responseToServicePeriod];

  if (displayConditionsForPath?.FORK) {
    displayConditionsForPath = pathsForShortName[responseToServicePeriod].FORK;
  }

  if (
    !pathsFromServicePeriod.includes(responseToServicePeriod) ||
    !pathsFromServicePeriod
  ) {
    // Question doesn't have:
    //   a path matching response to SERVICE_PERIOD
    //   SERVICE_PERIOD_SELECTION at all; all questions should - this handles human error
    return false;
  }

  return evaluateNestedAndForkedDCs(formResponses, displayConditionsForPath);
};

/** ================================================================
 * Given a ROADMAP index, gets DISPLAY_CONDITIONS
 */
const displayConditionsForIndex = index => {
  return DISPLAY_CONDITIONS?.[ROADMAP?.[index]];
};

/**
 * Move to given route or error if route not found
 * @param {number} index - index within ROADMAP to go to
 * @param {object} router - contains push function for routing
 */
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

/** ================================================================
 * Responsible for determining next question in flow, or redirecting to a results screen
 *
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 * @param {object} router - contains push function for routing
 */
export const navigateForward = (SHORT_NAME, formResponses, router) => {
  const CURRENT_INDEX = ROADMAP_INDEX(SHORT_NAME);
  let nextIndex = CURRENT_INDEX + 1;

  if (CURRENT_INDEX === END_INDEX) {
    // TODO go to a results page
  }

  while (CURRENT_INDEX !== END_INDEX) {
    // Found entry in DISPLAY_CONDITIONS for next question
    if (displayConditionsForIndex(nextIndex)) {
      if (displayConditionsMet(ROADMAP?.[nextIndex], formResponses)) {
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

/** ================================================================
 * Responsible for determining previous question (answered) in the flow
 *
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 * @param {object} router - contains push function for routing
 */
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

      if (displayConditionsMet(ROADMAP?.[previousIndex], formResponses)) {
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
