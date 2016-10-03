import set from 'lodash/fp/set';

import {
  TOGGLE_ADVANCED_SEARCH
} from '../actions/search';

const initialState = {
  advanced: {
    visible: false
  }
};

export default function modals(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_ADVANCED_SEARCH:
      return set('advanced.visible', !state.advanced.visible, state);
    default:
      return state;
  }
}
