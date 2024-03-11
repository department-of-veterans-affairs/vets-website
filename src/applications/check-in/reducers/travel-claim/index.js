const receivedTravelDataHandler = (state, action) => {
  const { appointments, address } = JSON.parse(JSON.stringify(action.payload));
  return {
    ...state,
    appointments,
    veteranData: { ...state.veteranData, address },
  };
};

const setFilteredAppointmentsHandler = (state, action) => {
  return {
    ...state,
    context: { ...state.context, ...action.payload },
  };
};

const setFacilityToFileHandler = (state, action) => {
  const data = { ...state.form.data, ...action.payload };
  return {
    ...state,
    form: { ...state.form, data },
  };
};

export {
  receivedTravelDataHandler,
  setFilteredAppointmentsHandler,
  setFacilityToFileHandler,
};
