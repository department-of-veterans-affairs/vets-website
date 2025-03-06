import {
  SEARCH_STARTED,
  FETCH_LOCATION_DETAIL,
  SEARCH_FAILED,
} from '../actionTypes';
import LocatorApi from '../../api';

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
