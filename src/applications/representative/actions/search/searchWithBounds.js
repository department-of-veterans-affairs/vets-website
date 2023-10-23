import { SEARCH_STARTED } from '../../utils/actionTypes';
// import {  SEARCH_FAILED } from '../../utils/actionTypes';
// import { reverseGeocodeBox } from '../../utils/mapHelpers';
// import { LocationType } from '../../constants';
import { fetchRepresentatives } from '../locations/fetchRepresentatives';

/**
 * Find which locations exist within the given bounding box's area.
 *
 * Allows for filtering on location types and services provided.
 *
 * @param {{bounds: number[], facilityType: string, serviceType: string, page: number, apiVersion: number}}
 */
export const searchWithBounds = ({
  bounds,
  representativeType,
  page = 1,
  center,
  radius,
}) => {
  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        currentPage: page,
        searchBoundsInProgress: true,
      },
    });

    fetchRepresentatives(
      null,
      bounds,
      representativeType,
      page,
      dispatch,
      center,
      radius,
    );
  };
};
