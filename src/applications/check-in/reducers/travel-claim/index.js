const receivedTravelDataHandler = (state, action) => {
  const { appointments, address } = JSON.parse(JSON.stringify(action.payload));
  return {
    ...state,
    appointments,
    veteranData: { ...state.veteranData, address },
  };
};

export { receivedTravelDataHandler };
