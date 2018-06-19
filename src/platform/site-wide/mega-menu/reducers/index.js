// import _ from 'lodash/fp';

import {
  TOGGLE_PANEL_OPEN,
  UPDATE_CURRENT_SECTION,
} from '../actions';

const initialState = {
  currentDropdown: '',
  currentSection: '',
};

export default function megaMenuReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_PANEL_OPEN:
      return { ...state, ...action.megaMenu };

    case UPDATE_CURRENT_SECTION:
      return { ...state, currentSection: action.currentSection };

    default:
      return state;
  }
}
