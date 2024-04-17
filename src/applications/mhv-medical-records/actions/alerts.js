import { Actions } from '../util/actionTypes';

export const addAlert = (type, error) => async dispatch => {
  dispatch({
    type: Actions.Alerts.ADD_ALERT,
    payload: {
      type,
      error,
    },
  });
};

export const clearAlerts = () => async dispatch => {
  dispatch({
    type: Actions.Alerts.CLEAR_ALERT,
  });
};
