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

export { recordAnswerHandler, setVeteranDataHandler };
