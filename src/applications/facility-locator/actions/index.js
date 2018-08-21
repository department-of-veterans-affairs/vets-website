/* eslint-disable no-use-before-define */
import { api } from '../config';
import { find, compact, isEmpty } from 'lodash';
import { mapboxClient } from '../components/MapboxClient';
import { reverseGeocodeBox } from '../utils/helpers';
import {
  SEARCH_STARTED,
  SEARCH_QUERY_UPDATED,
  SEARCH_FAILED,
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
} from '../utils/actionTypes';
import { LocationType, BOUNDING_RADIUS } from '../constants';
import LocatorApi from '../api';

export const updateSearchQuery = (query) => ({
  type: SEARCH_QUERY_UPDATED,
  payload: { ...query }
});

export const fetchVAFacility = (id, location = null) => {
  if (location) {
    return {
      type: FETCH_LOCATION_DETAIL,
      payload: location,
    };
  }

  return (dispatch) => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        active: true,
      },
    });

    const url = `${api.url}/${id}`;
    return LocatorApi.fetchVAFacility(url)
      .then(data => dispatch({ type: FETCH_LOCATION_DETAIL, payload: data.data }))
      .catch(error => dispatch({ type: SEARCH_FAILED, error }));
  };
};

export const searchWithBounds = ({ bounds, facilityType, serviceType, page = 1 }) => {
  return (dispatch) => {
    if (facilityType === LocationType.CC_PROVIDER) {
      reverseGeocodeBox(bounds).then(address => {
        if (!address) {
          dispatch({ type: SEARCH_FAILED, error: 'Reverse geocoding failed. See previous errors.' });
          return null;
        }

        return fetchLocations(address, bounds, facilityType, serviceType, page, dispatch);
      });
    }

    return fetchLocations(null, bounds, facilityType, serviceType, page, dispatch);
  };
};

/**
 * 
 * 
 * @param {String} address Address of the center-point of the search area
 * @param {Array<Number>} bounds Geo-coords of the bounding box of the search area
 * @param {String} locationType @see config.js root app dir for valid types
 * @param {String} serviceType (same as locationType)
 * @param {Number} page What page of results to request
 * @param {Function} dispatch Redux's dispatch method
 */
const fetchLocations = (address = null, bounds, locationType, serviceType, page, dispatch) => {
  const params = compact([
    address ? `address=${address}` : null,
    ...bounds.map(c => `bbox[]=${c}`),
    locationType ? `type=${locationType}` : null,
    locationType === 'benefits' && serviceType ? `services[]=${serviceType}` : null,
    `page=${page}`
  ]).join('&');
  const url = `${api.url}?${params}`;

  dispatch({
    type: SEARCH_STARTED,
    payload: {
      currentPage: page,
      searchBoundsInProgress: true,
    },
  });

  return LocatorApi.searchWithBounds(url)
    .then(
      (data) => {
        if (data.errors) {
          dispatch({ type: SEARCH_FAILED, error: data.errors });
        } else {
          dispatch({ type: FETCH_LOCATIONS, payload: data });
        }
      })
    .catch(
      (error) => dispatch({ type: SEARCH_FAILED, error })
    );
};

/**
 * Calculates a bounding box (±BOUNDING_RADIUS°) centering on the current
 * address string as typed by the user.
 * 
 * @param {Object<T>} query Current searchQuery state (`searchQuery.searchString` at a minimum)
 * @returns {Function<T>} A thunk for Redux to process
 */
export const genBBoxFromAddress = (query) => {
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
          coordinates[0] - BOUNDING_RADIUS,
          coordinates[1] - BOUNDING_RADIUS,
          coordinates[0] + BOUNDING_RADIUS,
          coordinates[1] + BOUNDING_RADIUS,
        ];

        if (featureBox) {
          minBounds = [
            Math.min(featureBox[0], coordinates[0] - BOUNDING_RADIUS),
            Math.min(featureBox[1], coordinates[1] - BOUNDING_RADIUS),
            Math.max(featureBox[2], coordinates[0] + BOUNDING_RADIUS),
            Math.max(featureBox[3], coordinates[1] + BOUNDING_RADIUS),
          ];
        }
        dispatch({
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

      dispatch({
        type: SEARCH_FAILED,
        error,
      });
    });
  };
};
