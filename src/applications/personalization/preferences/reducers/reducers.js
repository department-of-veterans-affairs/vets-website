import _ from 'lodash/fp';

import {
  SET_DASHBOARD_PREFERENCE,
  SAVED_DASHBOARD_PREFERENCES,
  SET_USER_PREFERENCE_REQUEST_STATUS,
  SET_ALL_PREFERENCE_OPTIONS_REQUEST_STATUS,
  SET_SAVE_PREFERENCES_REQUEST_STATUS,
  SET_DASHBOARD_USER_PREFERENCES,
  SET_AVAILABLE_BENEFITS,
} from '../actions/actions';

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
      return _.set(`dashboard`, action.preferences, state);
    }
    case SET_DASHBOARD_PREFERENCE: {
      return _.set(`dashboard.${action.slug}`, action.value, state);
    }
    case SAVED_DASHBOARD_PREFERENCES: {
      return _.set('savedAt', Date.now(), state);
    }
    default: {
      return state;
    }
  }
}
