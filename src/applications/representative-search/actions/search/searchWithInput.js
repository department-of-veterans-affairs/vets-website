import { SEARCH_STARTED } from '../../utils/actionTypes';
// import {  SEARCH_FAILED } from '../../utils/actionTypes';
// import { reverseGeocodeBox } from '../../utils/mapHelpers';
// import { LocationType } from '../../constants';
import { fetchRepresentatives } from '../representatives/fetchRepresentatives';

/**
 * Find which locations exist within the given bounding box's area.
 *
 * Allows for filtering on location types and services provided.
 *
 * @param {{bounds: number[], facilityType: string, serviceType: string, page: number, apiVersion: number}}
 */
export const searchWithInput = ({
  address,
  lat,
  long,
  name,
  page,
  /* eslint-disable camelcase */
  per_page,
  sort,
  type,
}) => {
  return dispatch => {
    dispatch({
      type: SEARCH_STARTED,
      payload: {
        currentPage: page,
        searchWithInputInProgress: true,
      },
    });

    fetchRepresentatives(
      address,
      lat,
      long,
      name,
      page,
      /* eslint-disable camelcase */
      per_page,
      sort,
      type,
      dispatch,
    );
  };
};
