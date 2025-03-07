import {
  FETCH_LOCATION_DETAIL,
  SEARCH_STARTED,
  SEARCH_FAILED,
} from '../actionTypes';
import LocatorApi from '../../api';

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
