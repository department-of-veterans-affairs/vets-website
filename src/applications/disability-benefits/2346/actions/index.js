import { fetchAndUpdateSessionExpiration as fetch } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import {
  MDOT_API_ERROR,
  MDOT_RESET_ERRORS,
  MDOT_API_CALL_INITIATED,
} from '../constants';
import moment from 'moment';
import localStorage from 'platform/utilities/storage/localStorage';

const handleError = error => ({
  type: MDOT_API_ERROR,
  error,
});

const resetError = () => ({
  type: MDOT_RESET_ERRORS,
});

const initiateApiCall = () => ({
  type: MDOT_API_CALL_INITIATED,
});

export const fetchFormStatus = () => async dispatch => {
  dispatch(initiateApiCall());
  const sessionExpiration = localStorage.getItem('sessionExpiration');
  const remainingSessionTime = moment(sessionExpiration).diff(moment());
  if (!remainingSessionTime) {
    // bail if there isn't a current session
    // the API returns the same response if a user is missing data OR is not logged in
    // so we need a way to differentiate those - a falsey remaining session will
    // always result in that error so we can go ahead and return
    return dispatch(resetError());
  }
  fetch(`${environment.API_URL}/v0/in_progress_forms/MDOT`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName,
    },
  })
    .then(res => res.json())
    .then(body => {
      if (body.errors) {
        return dispatch(handleError(body.errors[0]?.code.toUpperCase()));
      }
      return dispatch(resetError());
    })
    // dropping error as we don't need to gracefully handle it
    .catch(_error => {
      dispatch(resetError());
    });
  return null;
};
