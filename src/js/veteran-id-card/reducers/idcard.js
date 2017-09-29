import {
  ATTRS_FETCHING,
  ATTRS_SUCCESS,
  ATTRS_FAILURE
} from '../actions';

const initialState = {
  redirect: null,
  errors: null,
  fetching: false
};

function idcard(state = initialState, action) {
  switch (action.type) {
    case ATTRS_FETCHING:
      return {
        ...state,
        fetching: true
      };
    case ATTRS_SUCCESS:
      return {
        ...state,
        vicUrl: action.vicUrl,
        traits: action.traits,
        errors: null,
        fetching: false
      };
    case ATTRS_FAILURE:
      return {
        ...state,
        errors: action.errors,
        fetching: false
      };
    default:
      return state;
  }
}

export default idcard;
