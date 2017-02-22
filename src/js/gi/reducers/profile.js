import { FETCH_PROFILE_STARTED, FETCH_PROFILE_FAILED, FETCH_PROFILE_SUCCEEDED } from '../actions';
import { setPageTitle } from '../actions';

const INITIAL_STATE = {
  attributes: {},
  version: {},
  inProgress: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PROFILE_STARTED:
      return {
        ...state,
        inProgress: true
      };
    case FETCH_PROFILE_FAILED:
      return {
        ...state,
        ...action.err,
        inProgress: false
      };
    case FETCH_PROFILE_SUCCEEDED:
      const attributes = action.payload.data.attributes;
      const version = action.payload.meta.version;
      return {
        ...state,
        attributes,
        version,
        inProgress: false
      };
    default:
      return state;
  }
}
