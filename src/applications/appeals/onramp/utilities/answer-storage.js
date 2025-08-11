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
