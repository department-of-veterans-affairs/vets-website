import { apiRequest } from 'platform/utilities/api';

import {
  benefitChoices,
  transformPreferencesForSaving,
  restoreDismissedBenefitAlerts,
  getDismissedBenefitAlerts,
  // getNewSelections,
} from '../helpers';

export const FETCH_ALL_PREFERENCES_PENDING = 'FETCH_ALL_PREFERENCES_PENDING';
export const FETCH_ALL_PREFERENCES_SUCCEEDED =
  'FETCH_ALL_PREFERENCES_SUCCEEDED';
export const FETCH_ALL_PREFERENCES_FAILED = 'FETCH_ALL_PREFERENCES_FAILED';
export const FETCH_USER_PREFERENCES_PENDING = 'FETCH_USER_PREFERENCES_PENDING';
export const FETCH_USER_PREFERENCES_SUCCEEDED =
  'FETCH_USER_PREFERENCES_SUCCEEDED';
export const FETCH_USER_PREFERENCES_FAILED = 'FETCH_USER_PREFERENCES_FAILED';
export const RESTORE_PREVIOUS_USER_PREFERENCES =
  'RESTORE_PREVIOUS_USER_PREFERENCES';
export const SAVE_USER_PREFERENCES_PENDING = 'SAVE_USER_PREFERENCES_PENDING';
export const SAVE_USER_PREFERENCES_SUCCEEDED =
  'SAVE_USER_PREFERENCES_SUCCEEDED';
export const SAVE_USER_PREFERENCES_FAILED = 'SAVE_USER_PREFERENCES_FAILED';
export const SET_AVAILABLE_BENEFITS = 'SET_AVAILABLE_BENEFITS';
export const SET_ALL_USER_PREFERENCES = 'SET_ALL_USER_PREFERENCES';
export const SET_USER_PREFERENCE = 'SET_USER_PREFERENCE';
export const SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS =
  'SET_DISMISSED_DASHBOARD_PREFERENCE_ALERTS';

// load the benefits the user has picked to learn more about
export function fetchUserSelectedBenefits() {
  return dispatch => {
    dispatch({
      type: FETCH_USER_PREFERENCES_PENDING,
    });
    return apiRequest(
      '/user/preferences',
      null,
      response => {
        dispatch({
          type: SET_ALL_USER_PREFERENCES,
          payload: response,
        });
        dispatch({
          type: FETCH_USER_PREFERENCES_SUCCEEDED,
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
      type: FETCH_ALL_PREFERENCES_PENDING,
    });

    return apiRequest(
      '/user/preferences/choices/benefits',
      null,
      response => {
        const availableBenefits = response.data.attributes.preferenceChoices;
        dispatch({
          type: SET_AVAILABLE_BENEFITS,
          preferences: availableBenefits,
        });
        dispatch({
          type: FETCH_ALL_PREFERENCES_SUCCEEDED,
        });
      },
      () => {
        dispatch({
          type: FETCH_ALL_PREFERENCES_FAILED,
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
      type: SAVE_USER_PREFERENCES_PENDING,
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

        // TODO: use getNewSelections helper with staged and saved data
        // const newBenefitSelections = getNewSelections(
        //   getState().preferences.savedPreferences,
        //   benefitsData,
        // );
        // TODO: remove this mock newBenefitSelections
        // This re-enables an alert whenever any relevant benefit is included
        // not only if it is a new addition to the selected benefits
        const newBenefitSelections = Object.keys(benefitsData);
        // Get alert names for new selections

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
      type: SAVE_USER_PREFERENCES_PENDING,
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
