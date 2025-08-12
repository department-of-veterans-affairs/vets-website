// Creates form object with basic structure
// Example:
// {
//   Q_1_1_CLAIM_DECISION: null,
//   CLAIM_TIMELINE_1_2: null,
// }
export const createFormStore = ALL_QUESTIONS => {
  if (Object.keys(ALL_QUESTIONS).length === 0) {
    return {};
  }

  const storeObject = {};

  for (const question of ALL_QUESTIONS) {
    storeObject[question] = null;
  }

  return storeObject;
};

// Return updated form structure with reassigned value for SHORT_NAME
export const setShortNameValue = (SHORT_NAME, state, value) => {
  return {
    ...state,
    form: {
      ...state.form,
      [SHORT_NAME]: value,
    },
  };
};

/** ================================================================
 * Clear out responses in the store that are not needed for the current flow.
 * Only run when current question's answer has been changed from previous;
 * everything ahead of it is cleared out.
 *
 * @param {array} allQuestionShortNames - all question SHORT_NAMEs in the app
 * @param {func} updateCleanedFormStore - Redux action to update the answers in the store
 * @param {string} currentQuestionName - SHORT_NAME for question
 */
export const cleanUpAnswers = (
  allQuestionShortNames,
  updateCleanedFormStore,
  currentQuestionName,
) => {
  const currentQuestionIndex = allQuestionShortNames.indexOf(
    currentQuestionName,
  );

  const formUpdate = {};
  const questionsAhead = allQuestionShortNames.slice(currentQuestionIndex + 1);

  questionsAhead.forEach(question => {
    formUpdate[question] = null;
  });

  updateCleanedFormStore(formUpdate);
};
