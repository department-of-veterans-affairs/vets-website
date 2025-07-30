// Creates form object with basic structure
// Example:
// {
//   CLAIM_DECISION_1_1: null,
//   CLAIM_TIMELINE_1_2: null,
// }
export const createFormStore = shortNameMap => {
  const storeObject = {};

  for (const question of Object.keys(shortNameMap)) {
    if (!question.includes('HOME') && !question.includes('RESULTS')) {
      storeObject[question] = null;
    }
  }

  return storeObject;
};

// Return updated form structure with reassigned value for SHORT_NAME
export const setShortNameValue = (SHORT_NAME, newFormContents, state) => {
  return {
    ...state,
    form: {
      ...state.form,
      [SHORT_NAME]: newFormContents,
    },
  };
};

// Make adjustments to form store and set the new value
export const updateFormValue = (SHORT_NAME, state, action) => {
  // Radio button responses
  return setShortNameValue(SHORT_NAME, action.payload, state);
};
