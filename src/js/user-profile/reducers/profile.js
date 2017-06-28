import _ from 'lodash/fp';

import { UPDATE_PROFILE_FIELD, PROFILE_LOADING_FINISHED } from '../actions';
import { UPDATE_LOGGEDIN_STATUS } from '../../login/actions';

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
  accountType: null,
  savedForms: [],
  prefillsAvailable: [],
  loading: true
};

function profileInformation(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROFILE_FIELD: {
      return _.set(action.propertyPath, action.value, state);
    }
    case PROFILE_LOADING_FINISHED: {
      return _.set('loading', false, state);
    }
    case UPDATE_LOGGEDIN_STATUS: {
      return _.set('loading', false, state);
    }

    default:
      return state;
  }
}

export default profileInformation;
