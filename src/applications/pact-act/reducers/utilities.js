// Creates form object with basic structure
// Example:
// {
//   BURN_PIT_2_1: null,
//   BURN_PIT_2_1_1: null,
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

// Remove a checkbox response from its array; return new value for the SHORT_NAME in the store
export const getNewStoreAfterRemovingResponse = (
  currentFormContents,
  action,
) => {
  const removalIndex = currentFormContents.indexOf(action.payload);
  currentFormContents.splice(removalIndex, 1);

  return currentFormContents?.length ? currentFormContents : null;
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
export const updateFormValue = (SHORT_NAME, checkbox, state, action) => {
  // Multi-checkbox responses
  if (checkbox) {
    const currentFormContents = state.form?.[SHORT_NAME];
    const removeResponse = currentFormContents?.includes(action.payload);
    let newFormContents;

    if (removeResponse) {
      newFormContents = getNewStoreAfterRemovingResponse(
        currentFormContents,
        action,
      );
    } else {
      newFormContents = currentFormContents
        ? [...currentFormContents, action.payload]
        : [action.payload];
    }

    return setShortNameValue(SHORT_NAME, newFormContents, state);
  }

  // Radio button responses
  return setShortNameValue(SHORT_NAME, action.payload, state);
};
