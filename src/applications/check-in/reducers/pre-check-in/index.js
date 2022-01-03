const initFormHander = (state, action) => {
  return {
    ...state,
    form: {
      ...state.form,
      pages: action.payload.pages,
      currentPage: action.payload.pages[0].id,
    },
  };
};

const setSessionHandler = (state, action) => {
  return {
    ...state,
    context: {
      ...state.context,
      token: action.payload.token,
      permissions: action.payload.permissions,
    },
  };
};

const gotToNextPageHandler = (state, action) => {
  return {
    ...state,
    form: { ...state.form, currentPage: action.payload.nextPage },
  };
};

const recordAnswerHandler = (state, action) => {
  const data = { ...state.form.data, ...action.payload };
  return {
    ...state,
    form: { ...state.form, data },
  };
};

const setVeteranDataHandler = (state, action) => {
  return {
    ...state,
    appointments: action.payload.appointments,
    veteranData: { demographics: action.payload.demographics },
  };
};

export {
  initFormHander,
  setSessionHandler,
  gotToNextPageHandler,
  recordAnswerHandler,
  setVeteranDataHandler,
};
