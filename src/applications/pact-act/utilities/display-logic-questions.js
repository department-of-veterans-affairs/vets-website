// Determines which question to display

import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { SHORT_NAME_MAP } from '../constants/question-data-map';
import { getServicePeriodResponse } from './shared';

/**
 * Filter object for a given value (predicate true/false function)
 */
Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});

/** ================================================================
 * Make a roadmap (in display order) of SHORT_NAMEs that display in the
 * flow based on SERVICE_PERIOD response (e.g. 1989 or earlier)
 *
 * @param {string} servicePeriodResponse - response for SERVICE_PERIOD in the form store
 */
export const makeRoadmap = servicePeriodResponse => {
  const questionIsInFlow = shortName => {
    const dcsForServicePeriod =
      DISPLAY_CONDITIONS?.[shortName]?.SERVICE_PERIOD_SELECTION?.[
        servicePeriodResponse
      ];

    return shortName === SHORT_NAME_MAP.SERVICE_PERIOD || dcsForServicePeriod;
  };

  return Object.keys(SHORT_NAME_MAP).filter(shortName =>
    questionIsInFlow(shortName),
  );
};

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
 *
 * @param {array} requiredResponses Example: [VIETNAM_REP, VIETNAM_WATERS]
 * @param {object} formResponses - all answers in the store
 * @param {string} shortName
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

    if (questionShortName !== 'ONE_OF' && formResponse === undefined) {
      return false;
    }

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

    if (shortDisplayConditionsMet) {
      return true;
    }

    return checkResponses(formResponses, displayConditionsForPath.LONG);
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

  const responseToServicePeriod = getServicePeriodResponse(formResponses);

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
