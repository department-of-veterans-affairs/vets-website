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
    return apiRequest(`/va/${id}`, {
      apiVersion: 'facilities_api/v2',
    })
      .then(facility => {
        if (facility.data?.id) {
          const facilityData = facility.data;
          return dispatch(fetchFacilitySuccess(facilityData));
        }
        return dispatch(fetchFacilityFailed());
      })
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
    return apiRequest(`/va`, {
      apiVersion: 'facilities_api/v2',
      // eslint-disable-next-line camelcase
      body: JSON.stringify({ ids: id, per_page: 1, page: 1 }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(facility => {
        if (facility.data?.length && facility.data.some(d => d.id === id)) {
          const facilityData = facility.data.find(d => d.id === id);
          return dispatch(fetchMainSatelliteLocationSuccess(facilityData));
        }
        return dispatch(fetchMainSatelliteLocationFailed());
      })
      .catch(() => dispatch(fetchMainSatelliteLocationFailed()));
  };
}

export function fetchMultiFacility(id) {
  return dispatch => {
    // eslint-disable-next-line consistent-return
    dispatch(fetchMultiFacilityStarted(id));

    // eslint-disable-next-line consistent-return
    return apiRequest(`/va`, {
      apiVersion: 'facilities_api/v2',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // eslint-disable-next-line camelcase
      body: JSON.stringify({ ids: id, per_page: 1, page: 1 }),
    })
      .then(facility => {
        if (facility.data?.length && facility.data.some(d => d.id === id)) {
          dispatch(fetchMultiFacilitySuccess(facility.data, id));
        } else {
          dispatch(fetchMultiFacilityFailed(id));
        }
      })
      .catch(() => dispatch(fetchMultiFacilityFailed(id)));
  };
}

export function multiTypeQuery(facilityType, url, body) {
  return dispatch => {
    // With fetchMultiFacility started creates an empty object for the facility data
    dispatch(fetchMultiFacilityStarted(facilityType));
    return apiRequest(url, {
      apiVersion: 'facilities_api/v2',
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
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
