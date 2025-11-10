import { datadogRum } from '@datadog/browser-rum';
import { Actions } from '../util/actionTypes';

export const logStackTrace = (error, errorMessage) => dispatch => {
  const message = `[Medical Records] - ${errorMessage}`;
  datadogRum.addError(error, {
    feature: message,
  });

  dispatch({
    type: Actions.logging.LOG_STACK_TRACE,
    error,
    message,
  });
};
