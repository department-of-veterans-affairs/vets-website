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

export { setSessionHandler, recordAnswerHandler, setVeteranDataHandler };
