import { FETCH_LOCATIONS, SEARCH_FAILED } from '../../utils/actionTypes';
import { distBetween } from '../../utils/representativeDistance';

import LocatorApi from '../../api/LocatorApi';
/**
 * Handles the API call to get the type of locations closest to `address`
 * and/or within the given `bounds`.
 *
 * @param {string=} address Address of the center-point of the search area
 * @param {number[]} bounds Geo-coords of the bounding box of the search area
 * @param {string} representativeType (see config.js for valid types)
 * @param {number} page What page of results to request
 * @param {Function} dispatch Redux's dispatch method
 * @param {number} api version number
 */
export const fetchRepresentatives = async (
  address = null,
  bounds,
  representativeType,
  page,
  dispatch,
  center,
  radius,
) => {
  let data = {};

  try {
    const dataList = await LocatorApi.searchWithBounds(
      address,
      bounds,
      representativeType,
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

    if (data.errors) {
      dispatch({ type: SEARCH_FAILED, error: data.errors });
    } else {
      dispatch({ type: FETCH_LOCATIONS, payload: data });
    }
  } catch (error) {
    dispatch({ type: SEARCH_FAILED, error: error.message });
  }
};
