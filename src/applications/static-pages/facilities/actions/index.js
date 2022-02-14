import { apiRequest } from 'platform/utilities/api';

export const FETCH_FACILITY_STARTED = 'FETCH_FACILITY_STARTED';

export function fetchFacilityStarted() {
  return {
    type: FETCH_FACILITY_STARTED,
  };
}

export const FETCH_FACILITY_SUCCESS = 'FETCH_FACILITY_SUCCESS';
export const FETCH_MULTI_FACILITY_SUCCESS = 'FETCH_MULTI_FACILITY_SUCCESS';

export function fetchFacilitySuccess(facility) {
  return {
    type: FETCH_FACILITY_SUCCESS,
    facility,
  };
}

export function fetchMultiFacilitySuccess(facility, facilityID) {
  return {
    type: FETCH_MULTI_FACILITY_SUCCESS,
    facility,
    facilityID,
  };
}

export const FETCH_FACILITY_FAILED = 'FETCH_FACILITY_FAILED';
export const FETCH_MULTI_FACILITY_FAILED = 'FETCH_MULTI_FACILITY_FAILED';

export function fetchFacilityFailed() {
  return {
    type: FETCH_FACILITY_FAILED,
  };
}

export function fetchMultiFacilityFailed() {
  return {
    type: FETCH_MULTI_FACILITY_FAILED,
  };
}

export const FETCH_FACILITY = 'FETCH_FACILITY';

export function fetchFacility(id) {
  return (dispatch, getState) => {
    const { loading } = getState().facility;
    const { data } = getState().facility;
    if (loading && !Object.keys(data).length) {
      return;
    }
    dispatch(fetchFacilityStarted());

    // eslint-disable-next-line consistent-return
    return apiRequest(`/facilities/va/${id}`, { apiVersion: 'v1' })
      .then(facility => dispatch(fetchFacilitySuccess(facility.data)))
      .catch(() => dispatch(fetchFacilityFailed()));
  };
}

export function fetchMultiFacility(id) {
  return dispatch => {
    dispatch(fetchFacilityStarted());

    // eslint-disable-next-line consistent-return
    return apiRequest(`/facilities/va/${id}`, { apiVersion: 'v1' })
      .then(facility => dispatch(fetchMultiFacilitySuccess(facility.data, id)))
      .catch(() => dispatch(fetchMultiFacilityFailed()));
  };
}
