import mapboxClient from '../components/MapboxClient';
import { reverseGeocodeBox } from '../utils/mapHelpers';
import {
  SEARCH_STARTED,
  SEARCH_QUERY_UPDATED,
  SEARCH_FAILED,
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
  FETCH_SERVICES,
  FETCH_SERVICES_DONE,
  FETCH_SERVICES_FAILED,
  CLEAR_SEARCH_RESULTS,
} from '../utils/actionTypes';
import LocatorApi from '../api';
import { LocationType, BOUNDING_RADIUS } from '../constants';
import { ccLocatorEnabled } from '../config';

import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import recordEvent from 'platform/monitoring/record-event';

const mbxClient = mbxGeo(mapboxClient);
/**
 * Sync form state with Redux state.
 * (And implicitly cause updates back in VAMap)
 *
 * @param {Object} query The current state of the Search form
 */
export const updateSearchQuery = query => ({
  type: SEARCH_QUERY_UPDATED,
  payload: { ...query },
});

export const clearSearchResults = () => ({
  type: CLEAR_SEARCH_RESULTS,
});

/**
 * Get the details of a single VA facility.
 *
 * @param {string} id Facility or Provider ID as provided by the data source
 * @param {Object} location The actual location object if we already have it.
 *                 (This is a kinda hacky way to do a force update of the Redux
 *                  store to set the currently `selectedResult` but ¯\_(ツ)_/¯)
 */
export const fetchVAFacility = (id, location = null) => {
  if (location) {
    return {
      type: FETCH_LOCATION_DETAIL,
      payload: location,
    };
  }

  return async dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        active: true,
      },
    });

    try {
      const data = await LocatorApi.fetchVAFacility(id);
      dispatch({ type: FETCH_LOCATION_DETAIL, payload: data.data });
    } catch (error) {
      dispatch({ type: SEARCH_FAILED, error });
    }
  };
};

/**
 * Gets the details of a single Community Care Provider
 *
 * @param {string} id The NPI/Tax ID of a specific provider
 */
export const fetchProviderDetail = id => async dispatch => {
  dispatch({
    type: SEARCH_STARTED,
    payload: {
      active: true,
    },
  });

  try {
    const data = await LocatorApi.fetchProviderDetail(id);
    dispatch({ type: FETCH_LOCATION_DETAIL, payload: data.data });
  } catch (error) {
    dispatch({ type: SEARCH_FAILED, error });
  }
};

/**
 * Handles the actual API call to get the type of locations closest to `address`
 * and/or within the given `bounds`.
 *
 * @param {string=} address Address of the center-point of the search area
 * @param {number[]} bounds Geo-coords of the bounding box of the search area
 * @param {string} locationType (see config.js for valid types)
 * @param {string} serviceType (see config.js for valid types)
 * @param {number} page What page of results to request
 * @param {Function} dispatch Redux's dispatch method
 */
const fetchLocations = async (
  address = null,
  bounds,
  locationType,
  serviceType,
  page,
  dispatch,
) => {
  try {
    const data = await LocatorApi.searchWithBounds(
      address,
      bounds,
      locationType,
      serviceType,
      page,
    );
    // Record event as soon as API return results
    if (data.data && data.data.length > 0) {
      recordEvent({ event: 'fl-search-results' });
    }
    if (data.errors) {
      dispatch({ type: SEARCH_FAILED, error: data.errors });
    } else {
      dispatch({ type: FETCH_LOCATIONS, payload: data });
    }
  } catch (error) {
    dispatch({ type: SEARCH_FAILED, error });
  }
};

/**
 * Find which locations exist within the given bounding box's area.
 *
 * Allows for filtering on location types and services provided.
 *
 * @param {{bounds: number[], facilityType: string, serviceType: string, page: number}}
 */
export const searchWithBounds = ({
  bounds,
  facilityType,
  serviceType,
  page = 1,
}) => {
  const needsAddress = [
    LocationType.CC_PROVIDER,
    LocationType.ALL,
    LocationType.URGENT_CARE_FARMACIES,
    LocationType.URGENT_CARE,
  ];
  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        currentPage: page,
        searchBoundsInProgress: true,
      },
    });

    if (needsAddress.includes(facilityType) && ccLocatorEnabled()) {
      // Remove Feature-flag when going live. ^^^
      reverseGeocodeBox(bounds).then(address => {
        if (!address) {
          dispatch({
            type: SEARCH_FAILED,
            error:
              'Reverse geocoding failed. See previous errors or network log.',
          });
          return;
        }

        fetchLocations(
          address,
          bounds,
          facilityType,
          serviceType,
          page,
          dispatch,
        );
      });
    } else {
      fetchLocations(null, bounds, facilityType, serviceType, page, dispatch);
    }
  };
};

/**
 * Calculates a bounding box (±BOUNDING_RADIUS°) centering on the current
 * address string as typed by the user.
 *
 * @param {Object<T>} query Current searchQuery state (`searchQuery.searchString` at a minimum)
 * @returns {Function<T>} A thunk for Redux to process OR a failure action object on bad input
 */
export const genBBoxFromAddress = query => {
  // Prevent empty search request to Mapbox, which would result in error, and
  // clear results list to respond with message of no facilities found.
  if (!query.searchString) {
    return {
      type: SEARCH_FAILED,
      error: 'Empty search string/address. Search cancelled.',
    };
  }

  return dispatch => {
    dispatch({ type: SEARCH_STARTED });

    // commas can be stripped from query if Mapbox is returning unexpected results
    let types = ['place', 'region', 'postcode', 'locality', 'address'];
    // check for postcode search
    const isPostcode = query.searchString.match(/^\s*\d{5}\s*$/);

    if (isPostcode) {
      types = ['postcode'];
    }

    mbxClient
      .forwardGeocode({
        countries: ['us', 'pr', 'ph', 'gu', 'as', 'mp'],
        types,
        query: query.searchString,
      })
      .send()
      .then(({ body: { features } }) => {
        const zip =
          features[0].context.find(v => v.id.includes('postcode')) || {};
        const coordinates = features[0].center;
        const zipCode = zip.text || features[0].place_name;
        const featureBox = features[0].box;

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
            inProgress: true,
            position: {
              latitude: coordinates[1],
              longitude: coordinates[0],
            },
            searchCoords: {
              lat: features[0].geometry.coordinates[1],
              lng: features[0].geometry.coordinates[0],
            },
            bounds: minBounds,
            zoomLevel: features[0].id.split('.')[0] === 'region' ? 7 : 9,
            currentPage: 1,
          },
        });
      })
      .catch(error => dispatch({ type: SEARCH_FAILED, error }));
  };
};

/**
 * Preloads all services available from CC Providers
 * for the type-ahead component.
 */
export const getProviderSvcs = () => async dispatch => {
  dispatch({ type: FETCH_SERVICES });

  try {
    const data = await LocatorApi.getProviderSvcs();
    if (data.errors) {
      dispatch({ type: FETCH_SERVICES_FAILED, error: data.errors });
      return [];
    }
    // Great Success!
    dispatch({ type: FETCH_SERVICES_DONE });
    return data;
  } catch (error) {
    dispatch({ type: FETCH_SERVICES_FAILED, error });
    return ['Services Temporarily Unavailable'];
  }
};
