import _ from 'lodash/fp';
import get from 'platform/utilities/data/get';

import { LOADING_STATES, PREFERENCE_CODES } from '../constants';
import {
  FETCH_ALL_BENEFITS_STARTED,
  FETCH_ALL_BENEFITS_SUCCEEDED,
  FETCH_ALL_BENEFITS_FAILED,
  FETCH_USER_PREFERENCES_STARTED,
  FETCH_USER_PREFERENCES_SUCCEEDED,
  FETCH_USER_PREFERENCES_FAILED,
  SAVE_USER_PREFERENCES_STARTED,
  SAVE_USER_PREFERENCES_SUCCEEDED,
  SAVE_USER_PREFERENCES_FAILED,
  SET_USER_PREFERENCE,
  SET_DISMISSED_DASHBOARD_PREFERENCE_BENEFIT_ALERTS,
  RESTORE_PREVIOUS_USER_PREFERENCES,
} from '../actions';

const initialState = {
  dashboard: {},
  availableBenefits: [],
  dismissedBenefitAlerts: [],
};

export default function preferences(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_PREFERENCES_STARTED: {
      return {
        ...state,
        userBenefitsLoadingStatus: LOADING_STATES.pending,
      };
    }
    case FETCH_USER_PREFERENCES_SUCCEEDED: {
      let selectedBenefits = {};
      const preferenceGroups = get(
        'payload.data.attributes.userPreferences',
        action,
        [],
      );
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
        userBenefitsLoadingStatus: LOADING_STATES.loaded,
      };
    }
    case FETCH_USER_PREFERENCES_FAILED: {
      return {
        ...state,
        userBenefitsLoadingStatus: LOADING_STATES.error,
      };
    }
    case FETCH_ALL_BENEFITS_STARTED: {
      return {
        ...state,
        allBenefitsLoadingStatus: LOADING_STATES.pending,
      };
    }
    case FETCH_ALL_BENEFITS_SUCCEEDED: {
      const availableBenefits = get(
        'payload.data.attributes.preferenceChoices',
        action,
        [],
      );
      return {
        ...state,
        availableBenefits,
        allBenefitsLoadingStatus: LOADING_STATES.loaded,
      };
    }
    case FETCH_ALL_BENEFITS_FAILED: {
      return {
        ...state,
        allBenefitsLoadingStatus: LOADING_STATES.error,
      };
    }
    case SAVE_USER_PREFERENCES_STARTED: {
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
    case RESTORE_PREVIOUS_USER_PREFERENCES: {
      return {
        ...state,
        dashboard: { ...state.savedDashboard },
      };
    }
    default: {
      return state;
    }
  }
}
