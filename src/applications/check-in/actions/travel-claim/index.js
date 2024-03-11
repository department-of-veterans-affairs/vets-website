export const RECEIVED_TRAVEL_DATA = 'RECEIVED_TRAVEL_DATA';

export const receivedTravelData = payload => {
  return {
    type: RECEIVED_TRAVEL_DATA,
    payload,
  };
};

export const SET_FILTERED_APPOINTMENTS = 'SET_FILTERED_APPOINTMENTS';

export const setFilteredAppointments = payload => {
  return {
    type: SET_FILTERED_APPOINTMENTS,
    payload,
  };
};

export const SET_FACILITY_TO_FILE = 'SET_FACILITY_TO_FILE';

export const setFacilityToFile = facility => {
  return {
    type: SET_FACILITY_TO_FILE,
    payload: facility,
  };
};
