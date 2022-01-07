const initFormHandler = (state, action) => {
  return {
    ...state,
    form: {
      ...state.form,
      pages: action.payload.pages,
      currentPage: action.payload.currentPage,
    },
  };
};

const gotToNextPageHandler = (state, action) => {
  return {
    ...state,
    form: { ...state.form, currentPage: action.payload.nextPage },
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
