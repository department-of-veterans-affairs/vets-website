
import {
  BETA_REGISTERING,
  BETA_REGISTER_SUCCESS,
  BETA_REGISTER_FAILURE
} from '../actions';

const initialState = {
  username: null,
  stats: null,
  loading: false
};

function idcard(state = initialState, action) {
  switch (action.type) {
    case BETA_REGISTERING:
      return {
        ...state,
        loading: true
      };
    case BETA_REGISTER_SUCCESS:
      return {
        ...state,
        redirect: action.redirect,
        loading: false
      };
    case BETA_REGISTER_FAILURE:
      return {
        ...state,
        errors: action.errors,
        loading: false
      };
    default:
      return state;
  }
}

export default idcard;
