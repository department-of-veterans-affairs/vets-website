import { api } from '../config';
import { find, compact, isEmpty } from 'lodash';
import { mapboxClient } from '../components/MapboxClient';
import { reverseGeocodeBox } from '../utils/helpers';
import {
  LOCATION_UPDATED,
  SEARCH_STARTED,
  SEARCH_QUERY_UPDATED,
  SEARCH_FAILED,
  FETCH_VA_FACILITY,
  FETCH_VA_FACILITIES,
  FETCH_CC_PROVIDERS
} from '../utils/actionTypes';

export function updateSearchQuery(query) {
  return {
    type: SEARCH_QUERY_UPDATED,
    payload: { ...query }
  };
}

export function updateLocation(propertyPath, value) {
  return {
    type: LOCATION_UPDATED,
    propertyPath,
    value
  };
}

export function fetchVAFacility(id, location = null) {
  if (location) {
    return {
      type: FETCH_VA_FACILITY,
      payload: location,
    };
  }

  const url = `${api.url}/${id}`;

  return (dispatch) => {
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
        error => dispatch({ type: SEARCH_FAILED, error })
      );
  };
}

export const searchProviders = (bounds, serviceType, page = 1) => {
  return (dispatch, getState) => {
    const { searchString } = getState().searchQuery;
    if (searchString && searchString !== '') {
      return fetchProviders(searchString, bounds, dispatch, serviceType, page); // eslint-disable-line no-use-before-define
    }

    reverseGeocodeBox(bounds).then(address => {
      if (!address) {
        dispatch({ type: SEARCH_FAILED, error: 'Reverse geocoding failed. See previous errors.' });
        return null;
      }
      console.log('Reverse geocoded address:', address); //eslint-disable-line

      return fetchProviders(address, bounds, dispatch, serviceType, page); // eslint-disable-line no-use-before-define
    });

    return null;
  };
};

/**
 * 
 * 
 * @param {String} address 
 * @param {Array<String>} bounds 
 * @param {Function<T>} dispatch 
 * @param {String} serviceType 
 * @param {Number} page 
 */
const fetchProviders = (address, bounds, dispatch, serviceType, page) => {
  const params = compact([
    `address=${address}`,
    `bbox=${bounds}`,
    'type=cc_provider',
    serviceType ? `services[]=${serviceType}` : null,
    `page=${page}`
  ]).join('&');
  const url = `${api.url}?${params}`;

  dispatch({
    type: SEARCH_STARTED,
    payload: {
      page,
      searchProvidersInProgress: true,
    },
  });

  return fetch(url, api.settings)
    .then(res => res.json())
    .then(
      (data) => {
        if (data.errors) {
          dispatch({ type: SEARCH_FAILED, error: data.errors });
        } else {
          dispatch({ type: FETCH_CC_PROVIDERS, payload: data });
        }
      },
      (error) => {
        dispatch({ type: SEARCH_FAILED, error });
      }
    );
};

export function searchWithBounds(bounds, facilityType, serviceType, page = 1) {
  if (facilityType === 'cc_provider') {
    return searchProviders(bounds, serviceType, page);
  }

  const params = compact([
    ...bounds.map(c => `bbox[]=${c}`),
    facilityType ? `type=${facilityType}` : null,
    facilityType === 'benefits' && serviceType ? `services[]=${serviceType}` : null,
    `page=${page}`
  ]).join('&');
  const url = `${api.url}?${params}`;

  return (dispatch) => {
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
        (data) => {
          if (data.errors) {
            dispatch({ type: SEARCH_FAILED, error: data.errors });
          } else {
            dispatch({ type: FETCH_VA_FACILITIES, payload: data });
          }
        },
        (error) => dispatch({ type: SEARCH_FAILED, error })
      );
  };
}

export function genBBoxFromAddress(query) {
  // Prevent empty search request to Mapbox, which would result in error, and
  // clear results list to respond with message of no facilities found.
  if (!query.searchString) {
    return { type: SEARCH_FAILED, error: 'Empty search string/address. Search cancelled.' };
  }

  return (dispatch) => {
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
    }, (error, res) => {
      if (!error && !isEmpty(res.features)) {
        const coordinates = res.features[0].center;
        const zipCode = (find(res.features[0].context, (v) => {
          return v.id.includes('postcode');
        }) || {}).text || res.features[0].place_name;
        const featureBox = res.features[0].box;

        let minBounds = [
          coordinates[0] - 0.75,
          coordinates[1] - 0.75,
          coordinates[0] + 0.75,
          coordinates[1] + 0.75,
        ];

        if (featureBox) {
          minBounds = [
            Math.min(featureBox[0], coordinates[0] - 0.75),
            Math.min(featureBox[1], coordinates[1] - 0.75),
            Math.max(featureBox[2], coordinates[0] + 0.75),
            Math.max(featureBox[3], coordinates[1] + 0.75),
          ];
        }
        return dispatch({
          type: SEARCH_QUERY_UPDATED,
          payload: {
            ...query,
            context: zipCode,
            position: {
              latitude: coordinates[1],
              longitude: coordinates[0],
            },
            bounds: minBounds,
            zoomLevel: res.features[0].id.split('.')[0] === 'region' ? 7 : 9,
          }
        });
      }

      return dispatch({
        type: SEARCH_FAILED,
        error,
      });
    });
  };
}
