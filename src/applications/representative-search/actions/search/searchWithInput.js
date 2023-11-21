import { SEARCH_STARTED } from '../../utils/actionTypes';
// import {  SEARCH_FAILED } from '../../utils/actionTypes';
// import { reverseGeocodeBox } from '../../utils/mapHelpers';
// import { LocationType } from '../../constants';
import { fetchRepresentatives } from '../representatives/fetchRepresentatives';

/**
 * @param {{address: string, lat: number, long: number, name: string, page: number, per_page: number, sort: string}}
 */

/* eslint-disable camelcase */
export const searchWithInput = ({
  address,
  lat,
  long,
  name,
  page,
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
      per_page,
      sort,
      type,
      dispatch,
    );
  };
};
