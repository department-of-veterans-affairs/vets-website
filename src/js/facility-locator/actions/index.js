import { api } from '../config';
import { find, compact } from 'lodash';
import { mapboxClient } from '../components/MapboxClient';

export const FETCH_VA_FACILITIES = 'FETCH_VA_FACILITIES';
export const FETCH_VA_FACILITY = 'FETCH_VA_FACILITY';
export const LOCATION_UPDATED = 'LOCATION_UPDATED';
export const SEARCH_FAILED = 'SEARCH_FAILED';
export const SEARCH_QUERY_UPDATED = 'SEARCH_QUERY_UPDATED';
export const SEARCH_STARTED = 'SEARCH_STARTED';
export const SEARCH_SUCCEEDED = 'SEARCH_SUCCEEDED';

export function updateSearchQuery(query) {
  return {
    type: SEARCH_QUERY_UPDATED,
    payload: {
      ...query,
    }
  };
}

export function updateLocation(propertyPath, value) {
  return {
    type: LOCATION_UPDATED,
    propertyPath,
    value
  };
}

export function fetchVAFacility(id, facility = null) {
  if (facility) {
    return {
      type: FETCH_VA_FACILITY,
      payload: facility,
    };
  }

  const url = `${api.url}/${id}`;

  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        active: true,
      },
    });

    return fetch(url, api.settings)
      .then(res => res.json())
      .then(
        data => dispatch({ type: FETCH_VA_FACILITY, payload: data.data }),
        err => dispatch({ type: SEARCH_FAILED, err })
      );
  };
}

export function searchWithAddress(query) {
  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        active: true,
      },
    });

    mapboxClient.geocodeForward(query.searchString, (err, res) => {
      const coordinates = res.features[0].center;
      const zipCode = (find(res.features[0].context, (v) => {
        return v.id.includes('postcode');
      }) || {}).text || res.features[0].place_name;

      if (!err) {
        dispatch({
          type: SEARCH_QUERY_UPDATED,
          payload: {
            ...query,
            context: zipCode,
            position: {
              latitude: coordinates[1],
              longitude: coordinates[0],
            },
          }
        });
      } else {
        dispatch({
          type: SEARCH_FAILED,
          err,
        });
      }
    });
  };
}

export function searchWithBounds(bounds, facilityType, serviceType) {
  const params = compact([
    ...bounds.map(c => `bbox[]=${c}`),
    facilityType ? `type=${facilityType}` : null,
    serviceType ? `services[]=${serviceType}` : null,
  ]).join('&');
  const url = `${api.url}?${params}`;

  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        active: true,
      },
    });

    return fetch(url, api.settings)
      .then(res => res.json())
      .then(
        data => dispatch({ type: FETCH_VA_FACILITIES, payload: data.data }),
        err => dispatch({ type: SEARCH_FAILED, err })
      );
  };
}
