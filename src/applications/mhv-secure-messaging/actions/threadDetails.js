import { Actions } from '../util/actionTypes';

export const clearThread = () => dispatch => {
  dispatch({ type: Actions.Thread.CLEAR_THREAD });
};
