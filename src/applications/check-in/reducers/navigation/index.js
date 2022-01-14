const initFormHandler = (state, action) => {
  return {
    ...state,
    form: {
      ...state.form,
      pages: action.payload.pages,
    },
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

export { initFormHandler, updateFormHandler };
