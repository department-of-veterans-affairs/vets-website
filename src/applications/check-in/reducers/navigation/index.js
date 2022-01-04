const initFormHandler = (state, action) => {
  return {
    ...state,
    form: {
      ...state.form,
      pages: action.payload.pages,
      currentPage: action.payload.pages[0].id,
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
