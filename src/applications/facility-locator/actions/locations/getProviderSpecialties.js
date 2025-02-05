import LocatorApi from '../../api';
import {
  FETCH_SPECIALTIES,
  FETCH_SPECIALTIES_FAILED,
  FETCH_SPECIALTIES_DONE,
} from '../actionTypes';

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
