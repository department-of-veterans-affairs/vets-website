// import { apiRequest } from 'platform/utilities/api';
import {
  sampleUserPrefResponse,
  sampleAllBenefitOptionsResponse,
  sampleSaveUserPrefResponse,
} from '../mockResponses';

import { LOADING_STATES, PREFERENCE_CODES } from '../constants';
// import { preparePreferencesForSaving } from '../helpers';

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

// load the benefits the user has picked to learn more about
export function fetchUserSelectedBenefits() {
  return dispatch => {
    dispatch({
      type: SET_USER_PREFERENCE_REQUEST_STATUS,
      status: LOADING_STATES.pending,
    });

    // return apiRequest('/user/preferences')
    setTimeout(
      () =>
        Promise.resolve(sampleUserPrefResponse)
          .then(response => {
            // We just want to get an array of Benefits preferences
            const selectedBenefits = response.data.attributes.userPreferences
              .find(
                preferenceGroup =>
                  preferenceGroup.code === PREFERENCE_CODES.benefits,
              )
              .userPreferences.reduce((acc, pref) => {
                acc[pref.code] = true;
                return acc;
              }, {});

            dispatch({
              type: SET_DASHBOARD_USER_PREFERENCES,
              preferences: selectedBenefits,
            });

            dispatch({
              type: SET_USER_PREFERENCE_REQUEST_STATUS,
              status: LOADING_STATES.loaded,
            });
          })
          .catch(() => {
            dispatch({
              type: SET_USER_PREFERENCE_REQUEST_STATUS,
              status: LOADING_STATES.error,
            });
          }),
      2000,
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

    // return apiRequest('/user/preferences/choices/benefits')
    setTimeout(
      () =>
        Promise.resolve(sampleAllBenefitOptionsResponse)
          .then(response => {
            const availableBenefits =
              response.data.attributes.preferenceChoices;

            dispatch({
              type: SET_AVAILABLE_BENEFITS,
              preferences: availableBenefits,
            });

            dispatch({
              type: SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS,
              status: LOADING_STATES.loaded,
            });
          })
          .catch(() => {
            dispatch({
              type: SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS,
              status: LOADING_STATES.error,
            });
          }),
      4000,
    );
  };
}

export function setPreference(slug, value = true) {
  return {
    type: SET_DASHBOARD_PREFERENCE,
    slug,
    value,
  };
}

export function savePreferences(benefitsData) {
  return dispatch => {
    dispatch({
      type: SET_SAVE_PREFERENCES_REQUEST_STATUS,
      status: LOADING_STATES.pending,
    });

    // const body = preparePreferencesForSaving(benefitsData);
    // const method = 'POST';
    // return apiRequest('/user/preferences', { method, body })
    setTimeout(() => {
      Promise.resolve(sampleSaveUserPrefResponse)
        .then(() => {
          dispatch({
            type: SAVED_DASHBOARD_PREFERENCES,
          });

          dispatch({
            type: SET_SAVE_PREFERENCES_REQUEST_STATUS,
            status: LOADING_STATES.loaded,
          });
        })
        .catch(() => {
          dispatch({
            type: SET_SAVE_PREFERENCES_REQUEST_STATUS,
            status: LOADING_STATES.error,
          });
        });
    }, 3000);
  };
}
