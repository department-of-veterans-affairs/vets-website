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

export function searchWithBounds(bounds, facilityType, serviceType, page = 1) {
  const params = compact([
    ...bounds.map(c => `bbox[]=${c}`),
    facilityType ? `type=${facilityType}` : null,
    serviceType ? `services[]=${serviceType}` : null,
    `page=${page}`
  ]).join('&');
  const url = `${api.url}?${params}`;

  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        page,
        searchBoundsInProgress: true,
      },
    });

    return fetch(url, api.settings)
      .then(res => res.json())
      .then(
        data => {
          dispatch({ type: FETCH_VA_FACILITIES, payload: data });
        },
        err => dispatch({ type: SEARCH_FAILED, err })
      );
  };
}

export function searchWithAddress(query, currentMapBounds) {
  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
    });
    // commas can be stripped from query if Mapbox is returning unexpected results
    let types = 'place,address,region,postcode,locality';
    // check for postcode search
    if (query.searchString.match(/^\s*\d{5}\s*$/)) {
      types = 'postcode';
    }
    mapboxClient.geocodeForward(query.searchString, {
      country: 'us,pr,ph,gu,as,mp',
      types,
    }, (err, res) => {
      const coordinates = res.features[0].center;
      const zipCode = (find(res.features[0].context, (v) => {
        return v.id.includes('postcode');
      }) || {}).text || res.features[0].place_name;
      let modifiedBox;

      if (currentMapBounds) {
        const latDelta = Math.abs(currentMapBounds[0] - currentMapBounds[2]);
        const lngDelta = Math.abs(currentMapBounds[1] - currentMapBounds[3]);
        modifiedBox = [
          coordinates[0] - lngDelta,
          coordinates[1] - latDelta,
          coordinates[0] + lngDelta,
          coordinates[1] + latDelta,
        ];
      }

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
            bounds: modifiedBox || res.features[0].bbox || [
              coordinates[0] - 0.5,
              coordinates[1] - 0.5,
              coordinates[0] + 0.5,
              coordinates[1] + 0.5,
            ],
            zoomLevel: res.features[0].id.split('.')[0] === 'region' ? 7 : 11,
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
