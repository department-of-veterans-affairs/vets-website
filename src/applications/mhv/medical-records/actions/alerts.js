import { Actions } from '../util/actionTypes';

export const addAlert = type => async dispatch => {
  dispatch({
    type: Actions.Alerts.ADD_ALERT,
    payload: {
      type,
    },
  });
};
