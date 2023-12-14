// If a Veteran is navigating through the flow, then changes a response to a previous answer that affects
// the display of questions after it, the questions that will no longer show should have their answers
// removed from the Redux store. These utilities take care of that.

import { displayConditionsMet, makeRoadmap } from './display-logic-questions';
import { SHORT_NAME_MAP } from '../constants/question-data-map';
import { getNonNullShortNamesFromStore } from './shared';

/**
 * Filter object for a given value (predicate true/false function)
 */
Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});

/**
 * Use ROADMAP to determine if a question SHORT_NAME comes after the current question
 * Not flow-specific (e.g. 1989 or earlier)
 *
 * @param {string} shortName - name for question to evaluate
 * @param {string} currentQuestionShortName
 * @param {object} roadmap - all questions shown in the flow per SERVICE_PERIOD response
 */
const questionIsAfterCurrent = (shortName, currentQuestionShortName, roadmap) =>
  roadmap?.indexOf(shortName) > roadmap?.indexOf(currentQuestionShortName);

/** ================================================================
 * Gathers SHORT_NAMEs with responses in the store that
 * are not in the same SERVICE_PERIOD flow
 * Does not gather current question or anything before it
 *
 * @param {array} nonNullShortNames - SHORT_NAMEs in store with non-null answers (regardless of flow)
 * @param {array} flowSpecificQuestions - SHORT_NAMEs that appear in the same SERVICE_PERIOD flow
 */
export const gatherWrongFlowQuestions = (
  nonNullShortNames,
  flowSpecificQuestions,
) => {
  return nonNullShortNames.filter(
    shortName =>
      shortName !== SHORT_NAME_MAP.SERVICE_PERIOD &&
      !flowSpecificQuestions.includes(shortName),
  );
};

/** ================================================================
 * Gathers questions in the same SERVICE_PERIOD flow that no longer meet their display conditions
 *
 * @param {array} nonNullShortNames - SHORT_NAMEs in store with non-null answers (regardless of flow)
 * @param {string} currentQuestionName - SHORT_NAME for question
 * @param {array} questionsToBeNulled - current list of SHORT_NAMEs that need responses nulled
 * @param {object} responsesToClean - answers in the store
 */
export const gatherDCsNotMetQuestions = (
  nonNullShortNames,
  currentQuestionName,
  questionsToBeNulled,
  responsesToClean,
) => {
  const roadmap = makeRoadmap(
    responsesToClean?.[SHORT_NAME_MAP.SERVICE_PERIOD],
  );

  if (roadmap?.length) {
    const dcsNotMet = shortName => {
      return (
        !questionsToBeNulled?.includes(shortName) &&
        questionIsAfterCurrent(shortName, currentQuestionName, roadmap) &&
        !displayConditionsMet(shortName, responsesToClean)
      );
    };

    return nonNullShortNames.filter(shortName => dcsNotMet(shortName));
  }

  return [];
};

/** ================================================================
 * Gathers question SHORT_NAMEs that:
 *   do not display in the current SERVICE_PERIOD flow and/or
 *   no longer meet their display conditions
 *
 * @param {array} nonNullShortName - SHORT_NAMEs in store with non-null answers (regardless of flow)
 * @param {array} flowSpecificQuestions - SHORT_NAMEs that appear in the same SERVICE_PERIOD flow
 * @param {string} currentQuestionName - SHORT_NAME for question
 * @param {object} responsesToClean - answers in the store
 */
export const gatherQuestionsToReset = (
  nonNullShortNames,
  flowSpecificQuestions,
  currentQuestionName,
  responsesToClean,
) => {
  // Start list of SHORT_NAMEs whose answers are no longer needed
  const questionsToBeNulled = [];

  const wrongFlowQuestions = gatherWrongFlowQuestions(
    nonNullShortNames,
    flowSpecificQuestions,
  );

  const dcsNotMetQuestions = gatherDCsNotMetQuestions(
    nonNullShortNames,
    currentQuestionName,
    wrongFlowQuestions,
    responsesToClean,
  );

  if (wrongFlowQuestions?.length) {
    questionsToBeNulled.push(...wrongFlowQuestions);
  }

  if (dcsNotMetQuestions?.length) {
    questionsToBeNulled.push(...dcsNotMetQuestions);
  }

  return questionsToBeNulled;
};

/** ================================================================
 * Starting function for clearing out responses in the store that are not needed
 * for the current flow. Only run when current question's answer has been changed from previous
 *
 * @param {object} responsesInStore - all answers in the store
 * @param {func} updateCleanedFormStore - Redux action to update the answers in the store
 * @param {string} currentQuestionName - SHORT_NAME for question
 */
export const cleanUpAnswers = (
  responsesInStore,
  updateCleanedFormStore,
  currentQuestionName,
) => {
  const responsesToClean = responsesInStore;
  const servicePeriodResponse = responsesInStore?.SERVICE_PERIOD;

  const flowSpecificQuestions = makeRoadmap(servicePeriodResponse);

  const nonNullShortNames = getNonNullShortNamesFromStore(responsesToClean);
  const questionsToBeNulled = gatherQuestionsToReset(
    nonNullShortNames,
    flowSpecificQuestions,
    currentQuestionName,
    responsesToClean,
  );

  for (const question of questionsToBeNulled) {
    if (responsesToClean?.[question]) {
      responsesToClean[question] = null;
    }
  }

  updateCleanedFormStore(responsesToClean);
};
