import { apiRequest } from 'platform/utilities/api';

export const FETCH_FACILITY_STARTED = 'FETCH_FACILITY_STARTED';
export const FETCH_MAIN_SATELLITE_LOCATION_STARTED =
  'FETCH_MAIN_SATELLITE_LOCATION_STARTED';
export const FETCH_MULTI_FACILITY_STARTED = 'FETCH_MULTI_FACILITY_STARTED';

export function fetchFacilityStarted() {
  return {
    type: FETCH_FACILITY_STARTED,
  };
}

export function fetchMainSatelliteLocationStarted() {
  return {
    type: FETCH_MAIN_SATELLITE_LOCATION_STARTED,
  };
}

export function fetchMultiFacilityStarted(facilityID) {
  return {
    type: FETCH_MULTI_FACILITY_STARTED,
    facilityID,
  };
}

export const FETCH_FACILITY_SUCCESS = 'FETCH_FACILITY_SUCCESS';
export const FETCH_MULTI_FACILITY_SUCCESS = 'FETCH_MULTI_FACILITY_SUCCESS';
export const FETCH_MAIN_SATELLITE_LOCATION_SUCCESS =
  'FETCH_MAIN_SATELLITE_LOCATION_SUCCESS';

export function fetchFacilitySuccess(facility) {
  return {
    type: FETCH_FACILITY_SUCCESS,
    facility,
  };
}

export function fetchMainSatelliteLocationSuccess(facility) {
  return {
    type: FETCH_MAIN_SATELLITE_LOCATION_SUCCESS,
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
export const FETCH_MAIN_SATELLITE_LOCATION_FAILED =
  'FETCH_MAIN_SATELLITE_LOCATION_FAILED';

export function fetchFacilityFailed() {
  return {
    type: FETCH_FACILITY_FAILED,
  };
}

export function fetchMainSatelliteLocationFailed() {
  return {
    type: FETCH_MAIN_SATELLITE_LOCATION_FAILED,
  };
}

export function fetchMultiFacilityFailed(facilityID) {
  return {
    type: FETCH_MULTI_FACILITY_FAILED,
    facilityID,
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

export function fetchMainSatelliteLocationFacility(id) {
  return (dispatch, getState) => {
    const { loading } = getState().facility;
    const { data } = getState().facility;
    if (loading && !Object.keys(data).length) {
      return;
    }
    // eslint-disable-next-line consistent-return
    dispatch(fetchMainSatelliteLocationStarted());

    // eslint-disable-next-line consistent-return
    return apiRequest(`/facilities/va/${id}`, { apiVersion: 'v1' })
      .then(facility =>
        dispatch(fetchMainSatelliteLocationSuccess(facility.data)),
      )
      .catch(() => dispatch(fetchMainSatelliteLocationFailed()));
  };
}

export function fetchMultiFacility(id) {
  return dispatch => {
    // eslint-disable-next-line consistent-return
    dispatch(fetchMultiFacilityStarted(id));

    // eslint-disable-next-line consistent-return
    return apiRequest(`/facilities/va/${id}`, { apiVersion: 'v1' })
      .then(facility => dispatch(fetchMultiFacilitySuccess(facility.data, id)))
      .catch(() => dispatch(fetchMultiFacilityFailed(id)));
  };
}

export function multiTypeQuery(facilityType, queryString) {
  return dispatch => {
    // With fetchMultiFacility started creates an empty object for the facility data
    dispatch(fetchMultiFacilityStarted(facilityType));
    return apiRequest(queryString, { apiVersion: 'v1' })
      .then(res => {
        dispatch(
          // success action will populate the facility data object with data key/value
          fetchMultiFacilitySuccess(
            {
              data:
                res.data.map(datum => ({ ...datum, source: facilityType })) ||
                [],
            },
            facilityType,
          ),
        );
      })
      .catch(() => dispatch(fetchMultiFacilityFailed(facilityType)));
  };
}
