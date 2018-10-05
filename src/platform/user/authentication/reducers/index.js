import set from '../../../utilities/data/set';

import { LOG_OUT, UPDATE_LOGGEDIN_STATUS } from '../actions';

const initialState = {
  currentlyLoggedIn: false,
};

function loginStuff(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOGGEDIN_STATUS:
      return set('currentlyLoggedIn', action.value, state);

    case LOG_OUT:
      return set('currentlyLoggedIn', false, state);

    default:
      return state;
  }
}

export default loginStuff;
