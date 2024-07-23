import { Actions } from '../util/actionTypes';

export const setIsDetails = truthy => async dispatch => {
  dispatch({
    type: Actions.IsDetails.SET_IS_DETAILS,
    payload: truthy,
  });
};
