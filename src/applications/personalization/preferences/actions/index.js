import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';

import {
  benefitChoices,
  transformPreferencesForAnalytics,
  transformPreferencesForSaving,
  restoreDismissedBenefitAlerts,
  getDismissedBenefitAlerts,
  getNewSelections,
} from '../helpers';

export const FETCH_ALL_BENEFITS_STARTED = 'FETCH_ALL_BENEFITS_STARTED';
export const FETCH_ALL_BENEFITS_SUCCEEDED = 'FETCH_ALL_BENEFITS_SUCCEEDED';
export const FETCH_ALL_BENEFITS_FAILED = 'FETCH_ALL_BENEFITS_FAILED';
export const FETCH_USER_PREFERENCES_STARTED = 'FETCH_USER_PREFERENCES_STARTED';
export const FETCH_USER_PREFERENCES_SUCCEEDED =
  'FETCH_USER_PREFERENCES_SUCCEEDED';
export const FETCH_USER_PREFERENCES_FAILED = 'FETCH_USER_PREFERENCES_FAILED';
export const RESTORE_PREVIOUS_USER_PREFERENCES =
  'RESTORE_PREVIOUS_USER_PREFERENCES';
export const SAVE_USER_PREFERENCES_STARTED = 'SAVE_USER_PREFERENCES_STARTED';
export const SAVE_USER_PREFERENCES_SUCCEEDED =
  'SAVE_USER_PREFERENCES_SUCCEEDED';
export const SAVE_USER_PREFERENCES_FAILED = 'SAVE_USER_PREFERENCES_FAILED';
export const SET_USER_PREFERENCE = 'SET_USER_PREFERENCE';
export const SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS =
  'SET_DISMISSED_DASHBOARD_PREFERENCE_ALERTS';

// load the benefits the user has picked to learn more about
export function fetchUserSelectedBenefits() {
  return dispatch => {
    dispatch({
      type: FETCH_USER_PREFERENCES_STARTED,
    });
    return apiRequest(
      '/user/preferences',
      null,
      response => {
        dispatch({
          type: FETCH_USER_PREFERENCES_SUCCEEDED,
          payload: response,
        });
      },
      () => {
        dispatch({
          type: FETCH_USER_PREFERENCES_FAILED,
        });
      },
    );
  };
}

// load all available benefits
export function fetchAvailableBenefits() {
  return dispatch => {
    dispatch({
      type: FETCH_ALL_BENEFITS_STARTED,
    });

    return apiRequest(
      '/user/preferences/choices/benefits',
      null,
      response => {
        dispatch({
          type: FETCH_ALL_BENEFITS_SUCCEEDED,
          payload: response,
        });
      },
      () => {
        dispatch({
          type: FETCH_ALL_BENEFITS_FAILED,
        });
      },
    );
  };
}

export function setPreference(code, value = true) {
  return {
    type: SET_USER_PREFERENCE,
    code,
    value,
  };
}

export function setDismissedBenefitAlerts(value = []) {
  return {
    type: SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS,
    value,
  };
}

export function restorePreviousSelections() {
  return {
    type: RESTORE_PREVIOUS_USER_PREFERENCES,
  };
}

export function savePreferences(benefitsData) {
  // eslint-disable-next-line no-unused-vars
  return (dispatch, getState) => {
    dispatch({
      type: SAVE_USER_PREFERENCES_STARTED,
    });

    const body = transformPreferencesForSaving(benefitsData);

    const method = 'POST';
    const headers = { 'Content-Type': 'application/json' };
    return apiRequest(
      '/user/preferences',
      { headers, method, body },
      () => {
        dispatch({
          type: SAVE_USER_PREFERENCES_SUCCEEDED,
        });

        const newBenefitSelections = getNewSelections(
          getState().preferences.savedDashboard,
          benefitsData,
        );

        const newBenefitAlerts = benefitChoices
          .filter(
            choice =>
              !!choice.alert && newBenefitSelections.includes(choice.code),
          )
          .map(choice => choice.alert.name);

        // Remove new benefit alerts from dismissed list
        restoreDismissedBenefitAlerts(newBenefitAlerts);
        const dismissedAlerts = getDismissedBenefitAlerts();

        dispatch(setDismissedBenefitAlerts(dismissedAlerts));
      },
      () => {
        dispatch({
          type: SAVE_USER_PREFERENCES_FAILED,
        });
      },
    );
  };
}

export function deletePreferences() {
  return dispatch => {
    dispatch({
      type: SAVE_USER_PREFERENCES_STARTED,
    });

    const method = 'DELETE';
    const headers = { 'Content-Type': 'application/json' };
    return apiRequest(
      '/user/preferences/benefits/delete_all',
      { headers, method },
      () => {
        dispatch({
          type: SAVE_USER_PREFERENCES_SUCCEEDED,
        });
        // TODO: make sure that benefit-related alerts are removed/hidden?
      },
      () => {
        dispatch({
          type: SAVE_USER_PREFERENCES_FAILED,
        });
      },
    );
  };
}

// Wrapper to call either savePreferences or deletePreferences
export function updatePreferences(
  benefitsData,
  saveFunc = savePreferences,
  deleteFunc = deletePreferences,
) {
  recordEvent({
    event: 'dashboard-preferences-saved-successful',
    ...transformPreferencesForAnalytics(benefitsData),
  });
  if (Object.keys(benefitsData).length) {
    return saveFunc(benefitsData);
  }
  return deleteFunc();
}
