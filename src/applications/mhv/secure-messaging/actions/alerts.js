import { Actions } from '../util/actionTypes';

export const closeAlert = () => async dispatch => {
  dispatch({
    type: Actions.Alerts.CLOSE_ALERT,
  });
};

export const addAlert = (
  alertType,
  header,
  content,
  response,
) => async dispatch => {
  dispatch({
    type: Actions.Alerts.ADD_ALERT,
    payload: {
      alertType,
      header,
      content,
      response,
    },
  });
};
