import { GEOCODE_CLEAR_ERROR } from '../actionTypes';

export const clearGeocodeError = () => async dispatch => {
  dispatch({ type: GEOCODE_CLEAR_ERROR });
};
