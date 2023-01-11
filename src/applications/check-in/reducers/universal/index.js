const setAppHandler = (state, action) => {
  return { ...state, ...action.payload };
};

const setErrorHandler = (state, action) => {
  return { ...state, ...action.payload };
};

const setFormHandler = (state, action) => {
  return { ...state, ...action.payload };
};
const setActiveAppointmentHandler = (state, action) => {
  return {
    ...state,
    form: {
      ...state.form,
      activeAppointment: action.payload,
    },
  };
};
export {
  setAppHandler,
  setErrorHandler,
  setFormHandler,
  setActiveAppointmentHandler,
};
