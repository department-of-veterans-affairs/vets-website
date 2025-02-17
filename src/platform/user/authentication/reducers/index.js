import set from '../../../utilities/data/set';

import { LOG_OUT, UPDATE_LOGGEDIN_STATUS, CHECK_KEEP_ALIVE } from '../actions';

export const initialState = {
  currentlyLoggedIn: false,
  hasCheckedKeepAlive: false,
};

export default function loginStuff(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOGGEDIN_STATUS:
      return set('currentlyLoggedIn', action.value, state);

    case LOG_OUT:
      return set('currentlyLoggedIn', false, state);

    case CHECK_KEEP_ALIVE:
      return set('hasCheckedKeepAlive', true, state);

    default:
      return state;
  }
}
