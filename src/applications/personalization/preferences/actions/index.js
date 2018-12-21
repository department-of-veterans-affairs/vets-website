import { apiRequest } from 'platform/utilities/api';

import { LOADING_STATES, PREFERENCE_CODES } from '../constants';
import {
  benefitChoices,
  transformPreferencesForSaving,
  restoreDismissedBenefitAlerts,
  getDismissedBenefitAlerts, // eslint-disable-line no-unused-vars
  // getNewSelections,
} from '../helpers';

export const SET_USER_PREFERENCE_REQUEST_STATUS =
  'SET_USER_PREFERENCE_REQUEST_STATUS';
export const SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS =
  'SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS';
export const SET_SAVE_PREFERENCES_REQUEST_STATUS =
  'SET_SAVE_PREFERENCES_REQUEST_STATUS';
export const SET_AVAILABLE_BENEFITS = 'SET_AVAILABLE_BENEFITS';
export const SET_DASHBOARD_USER_PREFERENCES = 'SET_DASHBOARD_USER_PREFERENCES';
export const SET_DASHBOARD_PREFERENCE = 'SET_DASHBOARD_PREFERENCE';
export const SAVED_DASHBOARD_PREFERENCES = 'SAVED_DASHBOARD_PREFERENCES';
export const SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS =
  'SET_DISMISSED_DASHBOARD_PREFERENCE_ALERTS';

// load the benefits the user has picked to learn more about
export function fetchUserSelectedBenefits() {
  return dispatch => {
    dispatch({
      type: SET_USER_PREFERENCE_REQUEST_STATUS,
      status: LOADING_STATES.pending,
    });
    return apiRequest(
      '/user/preferences',
      null,
      response => {
        // We just want to get an array of Benefits preferences
        let selectedBenefits = response.data.attributes.userPreferences;
        if (selectedBenefits.length) {
          selectedBenefits = selectedBenefits
            .find(
              preferenceGroup =>
                preferenceGroup.code === PREFERENCE_CODES.benefits,
            )
            .userPreferences.reduce((acc, pref) => {
              acc[pref.code] = true;
              return acc;
            }, {});
        } else {
          selectedBenefits = {};
        }

        dispatch({
          type: SET_DASHBOARD_USER_PREFERENCES,
          preferences: selectedBenefits,
        });

        dispatch({
          type: SET_USER_PREFERENCE_REQUEST_STATUS,
          status: LOADING_STATES.loaded,
        });
      },
      () => {
        dispatch({
          type: SET_USER_PREFERENCE_REQUEST_STATUS,
          status: LOADING_STATES.error,
        });
      },
    );
  };
}

// load all available benefits
export function fetchAvailableBenefits() {
  return dispatch => {
    dispatch({
      type: SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS,
      status: LOADING_STATES.pending,
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
          type: SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS,
          status: LOADING_STATES.loaded,
        });
      },
      () => {
        dispatch({
          type: SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS,
          status: LOADING_STATES.error,
        });
      },
    );
  };
}

export function setPreference(code, value = true) {
  return {
    type: SET_DASHBOARD_PREFERENCE,
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

export function savePreferences(benefitsData) {
  // eslint-disable-next-line no-unused-vars
  return (dispatch, getState) => {
    dispatch({
      type: SET_SAVE_PREFERENCES_REQUEST_STATUS,
      status: LOADING_STATES.pending,
    });

    const body = transformPreferencesForSaving(benefitsData);

    const method = 'POST';
    const headers = { 'Content-Type': 'application/json' };
    return apiRequest(
      '/user/preferences',
      { headers, method, body },
      async () => {
        dispatch({
          type: SAVED_DASHBOARD_PREFERENCES,
        });
        dispatch({
          type: SET_SAVE_PREFERENCES_REQUEST_STATUS,
          status: LOADING_STATES.loaded,
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
        const newBenefitAlerts = benefitChoices // eslint-disable-line no-unused-vars
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
          type: SET_SAVE_PREFERENCES_REQUEST_STATUS,
          status: LOADING_STATES.error,
        });
      },
    );
  };
}
