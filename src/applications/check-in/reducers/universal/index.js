const setAppHandler = (state, action) => {
  return { ...state, ...action.payload };
};

const setErrorHandler = (state, action) => {
  return { ...state, ...action.payload };
};

const setFormHandler = (state, action) => {
  return { ...state, ...action.payload };
};

const receivedUpcomingAppointmentsHandler = (state, action) => {
  return { ...state, ...action.payload };
};

export {
  setAppHandler,
  setErrorHandler,
  setFormHandler,
  receivedUpcomingAppointmentsHandler,
};
