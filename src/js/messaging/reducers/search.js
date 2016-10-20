import set from 'lodash/fp/set';

import {
  SET_ADVSEARCH_END_DATE,
  SET_ADVSEARCH_START_DATE,
  TOGGLE_ADVANCED_SEARCH
} from '../utils/constants';

const initialState = {
  basic: null,
  advanced: {
    visible: false,
    params: {
      dateRange: {
        start: null,
        end: null
      }
    }
  }
};

export default function modals(state = initialState, action) {
  switch (action.type) {
    case SET_ADVSEARCH_START_DATE:
      return set('advanced.params.dateRange.start', action.date, state);
    case SET_ADVSEARCH_END_DATE:
      return set('advanced.params.dateRange.end', action.date, state);
    case TOGGLE_ADVANCED_SEARCH:
      return set('advanced.visible', !state.advanced.visible, state);
    default:
      return state;
  }
}
