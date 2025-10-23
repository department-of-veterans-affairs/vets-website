import {
  TOGGLE_PANEL_OPEN,
  UPDATE_CURRENT_SECTION,
  TOGGLE_DISPLAY_HIDDEN,
} from '../actions';

const initialState = {
  currentDropdown: '',
  currentSection: '',
  display: {},
};

export default function megaMenuReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_PANEL_OPEN:
      return { ...state, ...action.megaMenu };

    case UPDATE_CURRENT_SECTION:
      return { ...state, currentSection: action.currentSection };

    case TOGGLE_DISPLAY_HIDDEN:
      return { ...state, display: action.display };

    default:
      return state;
  }
}
