export const SET_FACILITY = 'SET_FACILITY';
export const SET_APPOINTMENT_DETAILS = 'SET_APPOINTMENT_DETAILS';
export const SET_SORT_PROVIDER_BY = 'SET_SORT_PROVIDER_BY';
export const SET_SELECTED_PROVIDER = 'SET_SELECTED_PROVIDER';

export function setFacility(facility) {
  return {
    type: SET_FACILITY,
    payload: facility,
  };
}

export function setAppointmentDetails(dateTime, facility) {
  return {
    type: SET_APPOINTMENT_DETAILS,
    payload: {
      dateTime,
      facility,
    },
  };
}

export function setSortProviderBy(sortProviderBy) {
  return {
    type: SET_SORT_PROVIDER_BY,
    payload: sortProviderBy,
  };
}

export function setSelectedProvider(selectedProvider) {
  return {
    type: SET_SELECTED_PROVIDER,
    payload: selectedProvider,
  };
}
