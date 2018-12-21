import _ from 'lodash/fp';

import { LOADING_STATES, PREFERENCE_CODES } from '../constants';
import {
  SET_DASHBOARD_PREFERENCE,
  SAVED_DASHBOARD_PREFERENCES,
  SET_USER_PREFERENCE_REQUEST_STATUS,
  SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS,
  SET_SAVE_PREFERENCES_REQUEST_STATUS,
  SET_DASHBOARD_USER_PREFERENCES,
  SET_AVAILABLE_BENEFITS,
} from '../actions';

const initialState = {
  dashboard: {},
  availableBenefits: [],
};

export default function preferences(state = initialState, action) {
  switch (action.type) {
    case SET_USER_PREFERENCE_REQUEST_STATUS: {
      return _.set(`userBenefitsLoadingStatus`, action.status, state);
    }
    case SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS: {
      return _.set(`allBenefitsLoadingStatus`, action.status, state);
    }
    case SET_SAVE_PREFERENCES_REQUEST_STATUS: {
      return _.set(`saveStatus`, action.status, state);
    }
    case SET_AVAILABLE_BENEFITS: {
      return _.set(`availableBenefits`, action.preferences, state);
    }
    case SET_DASHBOARD_USER_PREFERENCES: {
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
        dashboardBackup: { ...selectedBenefits },
        userBenefitsLoadingStatus: LOADING_STATES.loaded,
      };
    }
    case SET_DASHBOARD_PREFERENCE: {
      const newState = { ...state };
      if (action.value) {
        newState.dashboard[action.code] = true;
      } else {
        delete newState.dashboard[action.code];
      }
      return newState;
    }
    case SAVED_DASHBOARD_PREFERENCES: {
      return _.set('savedAt', Date.now(), state);
    }
    default: {
      return state;
    }
  }
}
