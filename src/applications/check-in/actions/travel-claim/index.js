export const RECEIVED_TRAVEL_DATA = 'RECEIVED_TRAVEL_DATA';

export const receivedTravelData = payload => {
  return {
    type: RECEIVED_TRAVEL_DATA,
    payload,
  };
};

export const RECEIVED_FILTERED_APPOINTMENTS = 'RECEIVED_FILTERED_APPOINTMENTS';

export const receivedFilteredAppointments = payload => {
  return {
    type: RECEIVED_FILTERED_APPOINTMENTS,
    payload,
  };
};
