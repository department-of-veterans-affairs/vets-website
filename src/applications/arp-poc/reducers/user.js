import {
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
} from '../actions/user';

const initialState = {
  isLoading: true,
  profile: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_USER_SUCCESS:
      return {
        isLoading: false,
        profile: action.payload,
      };
    case FETCH_USER_FAILURE:
      return {
        isLoading: false,
        profile: null,
      };
    default:
      return state;
  }
}
