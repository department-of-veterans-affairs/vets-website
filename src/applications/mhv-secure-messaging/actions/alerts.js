import { Actions } from '../util/actionTypes';

export const closeAlert = () => async dispatch => {
  dispatch({
    type: Actions.Alerts.CLOSE_ALERT,
  });
};

export const focusOutAlert = () => async dispatch => {
  dispatch({
    type: Actions.Alerts.FOCUS_OUT_ALERT,
  });
};

export const addAlert = (
  alertType,
  header,
  content,
  className,
  link,
  title,
  response,
) => async dispatch => {
  dispatch({
    type: Actions.Alerts.ADD_ALERT,
    payload: {
      alertType,
      header,
      content,
      className,
      link,
      title,
      response,
    },
  });
};
