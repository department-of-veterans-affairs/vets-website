const receivedTravelDataHandler = (state, action) => {
  const { appointments, address } = JSON.parse(JSON.stringify(action.payload));
  return {
    ...state,
    appointments,
    veteranData: { ...state.veteranData, address },
  };
};

const receivedFilteredAppointmentsHandler = (state, action) => {
  return {
    ...state,
    context: { ...state.context, ...action.payload },
  };
};

export { receivedTravelDataHandler, receivedFilteredAppointmentsHandler };
