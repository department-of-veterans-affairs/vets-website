import { GEOCODE_CLEAR_ERROR } from '../../utils/actionTypes';

export const clearGeocodeError = () => async dispatch => {
  dispatch({ type: GEOCODE_CLEAR_ERROR });
};
