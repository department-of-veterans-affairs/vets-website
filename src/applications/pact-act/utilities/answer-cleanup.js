// If a Veteran is navigating through the flow, then changes a response to a previous answer that affects
// the display of questions after it, the questions that will no longer show should have their answers
// removed from the Redux store. These utilities take care of that.

import { DISPLAY_CONDITIONS } from './display-conditions';
import { displayConditionsMet, ROADMAP, ROADMAP_INDEX } from './display-logic';
import { SHORT_NAME_MAP } from '../constants/question-data-map';

/**
 * Use ROADMAP to determine if a question SHORT_NAME comes after the current question
 * Not flow-specific (e.g. 1989 or earlier)
 *
 * @param {string} shortName - name for question to evaluate
 * @param {string} currentQuestionShortName
 */
const questionIsAfterCurrent = (shortName, currentQuestionShortName) =>
  ROADMAP_INDEX(shortName) > ROADMAP_INDEX(currentQuestionShortName);

/** ================================================================
 * Gather a list (in display order) of SHORT_NAMEs that come after the current question
 * based on SERVICE_PERIOD response (e.g. 1989 or earlier)
 *
 * @param {string} servicePeriodResponse - response for SERVICE_PERIOD in the form store
 */
export const gatherFlowSpecificQuestions = servicePeriodResponse => {
  const flowSpecificQuestions = [];

  for (const questionName of ROADMAP) {
    const paths = DISPLAY_CONDITIONS?.[questionName]?.SERVICE_PERIOD_SELECTION;
    const mayShowInCurrentFlow = paths?.[servicePeriodResponse];

    if (mayShowInCurrentFlow) {
      flowSpecificQuestions.push(questionName);
    }
  }

  return flowSpecificQuestions;
};

/** ================================================================
 * Return SHORT_NAMEs with answers in the store
 *
 * @param {object} responsesToClean - all answers in the store
 */
export const getNonNullShortNamesFromStore = responsesToClean => {
  const shortNames = Object.keys(responsesToClean);
  const nonNullShortNames = [];

  for (const shortName of shortNames) {
    if (responsesToClean[shortName] !== null) {
      nonNullShortNames.push(shortName);
    }
  }

  return nonNullShortNames;
};

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
  const questionsToNull = [];

  for (const nonNullShortName of nonNullShortNames) {
    if (
      nonNullShortName !== SHORT_NAME_MAP.SERVICE_PERIOD &&
      !flowSpecificQuestions.includes(nonNullShortName)
    ) {
      questionsToNull.push(nonNullShortName);
    }
  }

  return questionsToNull;
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
  const questionsToNull = [];

  for (const shortName of nonNullShortNames) {
    if (
      !questionsToBeNulled?.includes(shortName) &&
      questionIsAfterCurrent(shortName, currentQuestionName) &&
      !displayConditionsMet(shortName, responsesToClean)
    ) {
      questionsToNull.push(shortName);
    }
  }

  return questionsToNull;
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

  const flowSpecificQuestions = gatherFlowSpecificQuestions(
    servicePeriodResponse,
  );

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
