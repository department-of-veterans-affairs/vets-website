import {
  OPEN_SIDE_NAV,
  CLOSE_SIDE_NAV,
  PIN_MENU_TRIGGER,
  UNPIN_MENU_TRIGGER,
} from './actions';

const initialState = {
  isSideNavOpen: false,
  isMenuTriggerPinned: false,
};

function profileUi(state = initialState, action) {
  switch (action.type) {
    case OPEN_SIDE_NAV:
      return { ...state, isSideNavOpen: true };
    case CLOSE_SIDE_NAV:
      return { ...state, isSideNavOpen: false };
    case PIN_MENU_TRIGGER:
      return { ...state, isMenuTriggerPinned: true };
    case UNPIN_MENU_TRIGGER:
      return { ...state, isMenuTriggerPinned: false };

    default:
      return state;
  }
}

export default {
  profileUi,
};
