import { FETCH_LOCATIONS, SEARCH_FAILED } from '../actionTypes';
import { LocationType } from '../../constants';
import { distBetween } from '../../utils/facilityDistance';

import LocatorApi from '../../api';

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

  return {
    meta: {
      pagination: {
        currentPage: 1,
        nextPage: null,
        prevPage: null,
        totalPages: 1,
      },
    },
    links: {},
    data: [...nonVaData.data, ...vaData.data]
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
      .sort((resultA, resultB) => resultA.distance - resultB.distance)
      .slice(0, 20),
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
