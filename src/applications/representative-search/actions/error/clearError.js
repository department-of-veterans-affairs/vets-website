import { CLEAR_ERROR } from '../../utils/actionTypes';

export const clearError = errorType => async dispatch => {
  dispatch({
    type: CLEAR_ERROR,
    payload: { errorType },
  });
};
