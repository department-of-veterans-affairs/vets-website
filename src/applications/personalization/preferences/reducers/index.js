import _ from 'lodash/fp';

import { LOADING_STATES, PREFERENCE_CODES } from '../constants';
import {
  FETCH_ALL_PREFERENCES_PENDING,
  FETCH_ALL_PREFERENCES_SUCCEEDED,
  FETCH_ALL_PREFERENCES_FAILED,
  FETCH_USER_PREFERENCES_PENDING,
  FETCH_USER_PREFERENCES_SUCCEEDED,
  FETCH_USER_PREFERENCES_FAILED,
  SAVE_USER_PREFERENCES_PENDING,
  SAVE_USER_PREFERENCES_SUCCEEDED,
  SAVE_USER_PREFERENCES_FAILED,
  SET_AVAILABLE_BENEFITS,
  SET_ALL_USER_PREFERENCES,
  SET_USER_PREFERENCE,
  SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS,
} from '../actions';

const initialState = {
  dashboard: {},
  availableBenefits: [],
  dismissedBenefitAlerts: [],
};

export default function preferences(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_PREFERENCES_PENDING: {
      return {
        ...state,
        userBenefitsLoadingStatus: LOADING_STATES.pending,
      };
    }
    case FETCH_USER_PREFERENCES_SUCCEEDED: {
      return {
        ...state,
        userBenefitsLoadingStatus: LOADING_STATES.loaded,
      };
    }
    case FETCH_USER_PREFERENCES_FAILED: {
      return {
        ...state,
        userBenefitsLoadingStatus: LOADING_STATES.error,
      };
    }
    case FETCH_ALL_PREFERENCES_PENDING: {
      return {
        ...state,
        allBenefitsLoadingStatus: LOADING_STATES.pending,
      };
    }
    case FETCH_ALL_PREFERENCES_SUCCEEDED: {
      return {
        ...state,
        allBenefitsLoadingStatus: LOADING_STATES.loaded,
      };
    }
    case FETCH_ALL_PREFERENCES_FAILED: {
      return {
        ...state,
        allBenefitsLoadingStatus: LOADING_STATES.error,
      };
    }
    case SAVE_USER_PREFERENCES_PENDING: {
      return {
        ...state,
        saveStatus: LOADING_STATES.pending,
      };
    }
    case SAVE_USER_PREFERENCES_SUCCEEDED: {
      return {
        ...state,
        saveStatus: LOADING_STATES.loaded,
        savedAt: Date.now(),
      };
    }
    case SAVE_USER_PREFERENCES_FAILED: {
      return {
        ...state,
        saveStatus: LOADING_STATES.error,
      };
    }
    case SET_AVAILABLE_BENEFITS: {
      return _.set(`availableBenefits`, action.preferences, state);
    }
    case SET_ALL_USER_PREFERENCES: {
      let selectedBenefits = {};
      const preferenceGroups = action.payload.data.attributes.userPreferences;
      if (preferenceGroups.length) {
        selectedBenefits = preferenceGroups
          .find(
            preferenceGroup =>
              preferenceGroup.code === PREFERENCE_CODES.benefits,
          )
          .userPreferences.reduce((acc, pref) => {
            acc[pref.code] = true;
            return acc;
          }, selectedBenefits);
      }

      return {
        ...state,
        dashboard: { ...selectedBenefits },
        savedDashboard: { ...selectedBenefits },
      };
    }
    case SET_USER_PREFERENCE: {
      const newState = { ...state };
      if (action.value) {
        newState.dashboard[action.code] = true;
      } else {
        delete newState.dashboard[action.code];
      }
      return newState;
    }
    case SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS: {
      return _.set(`dismissedBenefitAlerts`, action.value, state);
    }
    default: {
      return state;
    }
  }
}
