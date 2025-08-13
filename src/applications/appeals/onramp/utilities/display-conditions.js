/** ================================================================
 * If the display conditions contain ONE_OF, check all possible responses for a match
 *
 * @param {object} oneOfChoices
 * Example: {
 *   Q_1_3A_FEWER_60_DAYS: YES,
 *   Q_2_H_1_EXISTING_BOARD_APPEAL: NO,
 * }
 * @param {object} formResponses - all answers in the store
 */
export const evaluateOneOfChoices = (oneOfChoices, formResponses) => {
  for (const choice of Object.keys(oneOfChoices)) {
    // If one of our form responses matches one of the key/value pairs given
    if (oneOfChoices[choice] === formResponses?.[choice]) {
      return true;
    }
  }

  return false;
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
      const oneOfChoicesMet = evaluateOneOfChoices(
        displayConditionsForNextQuestion?.ONE_OF,
        formResponses,
      );

      if (!oneOfChoicesMet) return false;
    } else {
      if (formResponse === undefined) return false;
      if (requiredResponse !== formResponse) return false;
    }
  }

  return true;
};
