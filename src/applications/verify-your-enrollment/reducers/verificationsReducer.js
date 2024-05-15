import {
  UPDATE_PENDING_VERIFICATIONS,
  UPDATE_PENDING_VERIFICATIONS_FAIL,
  UPDATE_PENDING_VERIFICATIONS_SUCCESS,
} from '../actions';

const initialState = {
  pending: false,
  data: null,
  error: null,
};

const verificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PENDING_VERIFICATIONS:
      return {
        ...state,
        pending: true,
        error: null,
      };
    case UPDATE_PENDING_VERIFICATIONS_SUCCESS:
      return {
        ...state,
        pending: false,
        data: action.response,
        error: null,
      };
    case UPDATE_PENDING_VERIFICATIONS_FAIL:
      return {
        ...state,
        pending: false,
        error: action.errors,
      };
    default:
      return state;
  }
};

export default verificationsReducer;
