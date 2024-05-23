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
  // export default function user(state = initialState, action) {
  console.log('user reducer action is: ', action.type);
  console.log('user reducer state is: ', state);
  switch (action.type) {
    case FETCH_USER:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_USER_SUCCESS:
      console.log('FETCH_USER_SUCCESS action triggered');
      console.log('Action payload:', action.payload);
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
