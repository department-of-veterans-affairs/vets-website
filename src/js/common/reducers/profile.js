import _ from 'lodash/fp';

import { UPDATE_PROFILE_FIELD, LOG_OUT } from '../actions';

// TODO(crew): Romove before this goes to production.
const initialState = {
  userFullName: {
    first: null,
    middle: null,
    last: null,
    suffix: null,
  },
  email: null,
  dob: null,
  gender: null,
  accountType: null
};

function profileInformation(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROFILE_FIELD: {
      return _.set(action.propertyPath, action.value, state);
    }

    case LOG_OUT: {
      return initialState;
    }

    default:
      return state;
  }
}

export default profileInformation;
