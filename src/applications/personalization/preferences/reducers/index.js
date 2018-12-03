import _ from 'lodash/fp';

import {
  DASHBOARD_PREFERENCE_SET,
  DASHBOARD_PREFERENCES_SAVED,
  DASHBOARD_PREFERENCES_FETCHED,
} from '../actions';

const initialState = {
  dashboard: {},
};

export default function preferences(state = initialState, action) {
  switch (action.type) {
    case DASHBOARD_PREFERENCE_SET:
      return _.set(`dashboard.${action.slug}`, action.value, state);
    case DASHBOARD_PREFERENCES_FETCHED:
      return _.set('dashboard', action.data, state);
    case DASHBOARD_PREFERENCES_SAVED:
      return _.set('dashboard', action.data, state);
    default:
      return state;
  }
}
