import {
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
  FETCH_SPECIALTIES,
  FETCH_SPECIALTIES_DONE,
  FETCH_SPECIALTIES_FAILED,
  SEARCH_FAILED,
  SEARCH_STARTED,
} from './actionTypes';
import { LocationType } from '../constants';
import { distBetween } from '../utils/facilityDistance';
import LocatorApi from '../api';

/**
 * Handles all care request (mashup) - Urgent care and Emergency care
 * @param {Object} parameters from the search request
 * @returns {Object} An Object response (locations/providers)
 */
const returnAllCare = async params => {
  const { address, bounds, locationType, page, center, radius } = params;
  const isUrgentCare = locationType === LocationType.URGENT_CARE;
  const vaData = await LocatorApi.searchWithBounds(
    address,
    bounds,
    locationType,
    isUrgentCare ? 'UrgentCare' : 'EmergencyCare',
    page,
    center,
    radius,
    true,
  );

  const nonVaData = await LocatorApi.searchWithBounds(
    address,
    bounds,
    locationType,
    isUrgentCare ? 'NonVAUrgentCare' : 'NonVAEmergencyCare',
    page,
    center,
    radius,
    true,
  );

  const combinedData = [...nonVaData.data, ...vaData.data]
    .map(location => {
      const distance =
        center &&
        distBetween(
          center[0],
          center[1],
          location.attributes.lat,
          location.attributes.long,
        );
      return { ...location, distance };
    })
    .sort((resultA, resultB) => resultA.distance - resultB.distance)
    .slice(0, 20);

  return {
    meta: {
      pagination: {
        currentPage: 1,
        nextPage: null,
        prevPage: null,
        totalPages: 1,
        totalEntries: combinedData.length,
      },
    },
    links: {},
    data: combinedData,
  };
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
 * @param {number} api version number
 */
export const fetchLocations = async (
  address = null,
  bounds,
  locationType,
  serviceType,
  page,
  dispatch,
  center,
  radius,
) => {
  let data = {};

  const isUrgentCare = locationType === LocationType.URGENT_CARE;
  const isEmergencyCare = locationType === LocationType.EMERGENCY_CARE;

  try {
    if (
      (isUrgentCare && (!serviceType || serviceType === 'AllUrgentCare')) ||
      (isEmergencyCare && (!serviceType || serviceType === 'AllEmergencyCare'))
    ) {
      const allCare = await returnAllCare({
        address,
        bounds,
        locationType,
        page,
        center,
        radius,
      });
      data = allCare;
    } else {
      const dataList = await LocatorApi.searchWithBounds(
        address,
        bounds,
        locationType,
        serviceType,
        page,
        center,
        radius,
      );
      data = { ...dataList };
      if (dataList.data) {
        data.data = dataList.data
          .map(location => {
            const distance =
              center &&
              distBetween(
                center[0],
                center[1],
                location.attributes.lat,
                location.attributes.long,
              );
            return {
              ...location,
              distance,
            };
          })
          .sort((resultA, resultB) => resultA.distance - resultB.distance);

        // Fix pagination when API returns inconsistent data
        // Only adjust if there's a single page (totalPages = 1) but counts don't match
        if (data.meta && data.meta.pagination) {
          const { totalPages, totalEntries } = data.meta.pagination;
          const actualCount = data.data.length;

          // If this is supposed to be the only page, totalEntries should match actual count
          if (totalPages === 1 && actualCount !== totalEntries) {
            data.meta.pagination.totalEntries = actualCount;
          }
        }
      }
    }
    if (data.errors) {
      dispatch({ type: SEARCH_FAILED, error: data.errors });
    } else {
      dispatch({ type: FETCH_LOCATIONS, payload: data });
    }
  } catch (error) {
    dispatch({ type: SEARCH_FAILED, error: error.message });
  }
};

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

      if (data.errors) {
        dispatch({ type: SEARCH_FAILED, error: data.errors });
      } else {
        dispatch({ type: FETCH_LOCATION_DETAIL, payload: data.data });
      }
    } catch (error) {
      dispatch({ type: SEARCH_FAILED, error });
    }
  };
};

/**
 * Preloads all specialties available from CC Providers
 * for the type-ahead component.
 */
export const getProviderSpecialties = () => async dispatch => {
  dispatch({ type: FETCH_SPECIALTIES });

  try {
    const data = await LocatorApi.getProviderSpecialties();
    if (data.errors) {
      dispatch({ type: FETCH_SPECIALTIES_FAILED, error: data.errors });
      return [];
    }
    // Great Success!
    dispatch({ type: FETCH_SPECIALTIES_DONE, data });
    return data;
  } catch (error) {
    dispatch({ type: FETCH_SPECIALTIES_FAILED, error });
    return ['Services Temporarily Unavailable'];
  }
};
