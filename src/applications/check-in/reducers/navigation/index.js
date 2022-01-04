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

export { initFormHandler, gotToNextPageHandler };
