import {
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
} from '../actions/user';

const initialState = {
  isLoading: true,
  error: null,
  profile: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER:
      return {
        ...state,
        isLoading: true,
        error: null,
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
        error: action.payload,
      };
    default:
      return state;
  }
}
