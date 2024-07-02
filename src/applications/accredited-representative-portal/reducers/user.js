import {
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
} from '../actions/user';

const initialState = {
  isLoading: true,
  profile: null,
  error: null,
};

const arpUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        profile: action.payload,
      };
    case FETCH_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        profile: null,
        error: action.error || 'Unknown error',
      };
    default:
      return state;
  }
};

export default arpUserReducer;
