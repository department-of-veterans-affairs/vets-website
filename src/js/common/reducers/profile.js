import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { UPDATE_PROFILE_FIELD, LOG_OUT } from '../actions';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);

// TODO(crew): Romove before this goes to production.
const initialState = {
  userFullName: {
    first: 'Shonda',
    middle: 'Eileen',
    last: 'Rhimes',
    suffix: '',
  },
  email: 'yearofyes@va.gov',
  zip: ''
};

function profileInformation(state = initialState, action) {
  let newState = undefined;
  switch (action.type) {
    case UPDATE_PROFILE_FIELD: {
      newState = Object.assign({}, state);
      _.set(newState, action.propertyPath, action.value);
      return newState;
    }

    case LOG_OUT: {
      newState = initialState;
      return newState;
    }

    default:
      return state;
  }
}

export default profileInformation;
