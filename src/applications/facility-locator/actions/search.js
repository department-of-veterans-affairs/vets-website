import {
  CLEAR_SEARCH_RESULTS,
  CLEAR_SEARCH_TEXT,
  SEARCH_FAILED,
  SEARCH_QUERY_UPDATED,
  SEARCH_STARTED,
} from './actionTypes';
import { reverseGeocodeBox } from '../utils/mapHelpers';
import { LocationType } from '../constants';
import { fetchLocations } from './locations';

export const clearSearchResults = () => ({
  type: CLEAR_SEARCH_RESULTS,
});

export const clearSearchText = () => async dispatch => {
  dispatch({ type: CLEAR_SEARCH_TEXT });
};

/**
 * Find which locations exist within the given bounding box's area.
 *
 * Allows for filtering on location types and services provided.
 *
 * @param {{bounds: number[], facilityType: string, serviceType: string, page: number, apiVersion: number}}
 */
export const searchWithBounds = ({
  bounds,
  facilityType,
  serviceType,
  page = 1,
  center,
  radius,
}) => {
  const needsAddress = [
    LocationType.CC_PROVIDER,
    LocationType.ALL,
    LocationType.URGENT_CARE_PHARMACIES,
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

    if (needsAddress.includes(facilityType)) {
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
          center,
          radius,
        );
      });
    } else {
      fetchLocations(
        null,
        bounds,
        facilityType,
        serviceType,
        page,
        dispatch,
        center,
        radius,
      );
    }
  };
};

/**
 * Sync form state with Redux state.
 * (And implicitly cause updates back in VAMap)
 *
 * @param {Object} query The current state of the Search form
 */

export const updateSearchQuery = query => {
  return {
    type: SEARCH_QUERY_UPDATED,
    payload: { ...query },
  };
};
