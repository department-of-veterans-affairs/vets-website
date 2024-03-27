export const createFormStore = shortNameMap => {
  const storeObject = {};

  for (const question of Object.keys(shortNameMap)) {
    if (!question.includes('HOME') && !question.includes('RESULTS')) {
      storeObject[question] = null;
    }
  }

  return storeObject;
};
export const setShortNameValue = (SHORT_NAME, newFormContents, state) => {
  return {
    ...state,
    form: {
      ...state.form,
      [SHORT_NAME]: newFormContents,
    },
  };
};

export const updateFormValue = (SHORT_NAME, state, action) => {
  return setShortNameValue(SHORT_NAME, action.payload, state);
};
