const initFormHandler = (state, action) => {
  return {
    ...state,
    form: {
      ...state.form,
      pages: action.payload.pages,
    },
  };
};

// no longer needed?
const gotToNextPageHandler = state => {
  return {
    ...state,
    form: { ...state.form },
  };
};

const updateFormHandler = (state, action) => {
  return {
    ...state,
    form: {
      ...state.form,
      pages: action.payload.pages,
    },
  };
};

export { initFormHandler, gotToNextPageHandler, updateFormHandler };
