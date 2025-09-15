import { RESPONSES, SHORT_NAME_MAP } from '../constants/question-data-map';

/** ================================================================
 * If the display conditions contain ONE_OF or NONE_OF,
 * check all possible responses for a match
 * If any match, return true
 *
 * @param {object} batchOfChoices
 * Example: {
 *   Q_1_3A_FEWER_60_DAYS: YES,
 *   Q_2_IS_1B_NEW_EVIDENCE: NO,
 * }
 * @param {object} formResponses - all answers in the store
 */
export const evaluateBatchOfChoices = (batchOfChoices, formResponses) => {
  for (const choice of Object.keys(batchOfChoices)) {
    const formResponse = formResponses?.[choice];

    if (
      Array.isArray(batchOfChoices[choice]) &&
      batchOfChoices[choice].includes(formResponse)
    ) {
      return true;
    }

    if (batchOfChoices[choice] === formResponse) {
      return true;
    }
  }

  return false;
};

/**
 * Evaluates whether the user has indicated that their condition
 * has worsened and they disagree with a decision
 */
export const isCFIVariant = formResponses => {
  const {
    Q_1_2A_2_DISAGREE_DECISION,
    Q_2_IS_4_DISAGREE_DECISION,
  } = SHORT_NAME_MAP;

  return (
    formResponses[Q_1_2A_2_DISAGREE_DECISION] === RESPONSES.YES ||
    formResponses[Q_2_IS_4_DISAGREE_DECISION] === RESPONSES.YES
  );
};

/** ================================================================
 * Evaluate whether a question should display
 *
 * @param {object} formResponses - all answers in the store
 * @param {object} displayConditionsForNextQuestion - display conditions for the next question
 */
export const displayConditionsMet = (
  formResponses,
  displayConditionsForNextQuestion,
) => {
  // If a question has an empty object for display conditions, it will always show
  if (!Object.keys(displayConditionsForNextQuestion).length) {
    return true;
  }

  const questionRequirements = Object.keys(displayConditionsForNextQuestion);

  // Loop through each question in the display conditions and look for a mismatch
  // If we don't find out, we can safely say the display conditions are met
  for (const questionShortName of questionRequirements) {
    const formResponse = formResponses?.[questionShortName];
    const requiredResponse =
      displayConditionsForNextQuestion[questionShortName];

    if (Array.isArray(requiredResponse)) {
      if (!requiredResponse.includes(formResponse)) return false;
    } else if (questionShortName === 'ONE_OF') {
      const foundMatch = evaluateBatchOfChoices(
        displayConditionsForNextQuestion?.ONE_OF,
        formResponses,
      );

      // For ONE_OF, we're looking for a match
      if (!foundMatch) return false;
    } else if (questionShortName === 'NONE_OF') {
      const foundMatch = evaluateBatchOfChoices(
        displayConditionsForNextQuestion?.NONE_OF,
        formResponses,
      );

      // For NONE_OF, we don't want a match
      if (foundMatch) return false;
    } else if (questionShortName === 'FORK') {
      // Not extracted to its own function because it would be
      // mutually recursive with displayConditionsMet
      const forkChoices = Object.keys(
        displayConditionsForNextQuestion?.FORK || {},
      );

      for (const forkChoice of forkChoices) {
        const forkChoiceDCs =
          displayConditionsForNextQuestion?.FORK?.[forkChoice] || {};

        if (displayConditionsMet(formResponses, forkChoiceDCs)) {
          return true;
        }
      }

      return false;
    } else {
      if (formResponse === undefined) return false;
      if (requiredResponse !== formResponse) return false;
    }
  }

  return true;
};
