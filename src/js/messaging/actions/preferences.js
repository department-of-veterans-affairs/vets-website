import {
  FETCH_PREFERENCES_FAILURE,
  FETCH_PREFERENCES_SUCCESS,
  LOADING_PREFERENCES,
  SAVE_PREFERENCES_FAILURE,
  SAVE_PREFERENCES_SUCCESS,
  SAVING_PREFERENCES,
  SET_NOTIFICATION_EMAIL,
  SET_NOTIFICATION_FREQUENCY
} from '../utils/constants';

import { apiRequest } from '../utils/helpers';


const baseUrl = '/preferences';

export function fetchPreferences() {
  return dispatch => {
    dispatch({ type: LOADING_PREFERENCES });

    apiRequest(
      baseUrl,
      null,
      data => dispatch({
        type: FETCH_PREFERENCES_SUCCESS,
        preferences: data.data.attributes
      }),
      () => dispatch({ type: FETCH_PREFERENCES_FAILURE })
    );
  };
}

export function savePreferences(preferences) {
  const settings = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences)
  };

  return dispatch => {
    dispatch({ type: SAVING_PREFERENCES });

    apiRequest(
      baseUrl,
      settings,
      () => dispatch({ type: SAVE_PREFERENCES_SUCCESS }),
      () => dispatch({ type: SAVE_PREFERENCES_FAILURE })
    );
  };
}

export function setNotificationEmail(email) {
  return { type: SET_NOTIFICATION_EMAIL, email };
}

export function setNotificationFrequency(frequency) {
  return { type: SET_NOTIFICATION_FREQUENCY, frequency };
}
