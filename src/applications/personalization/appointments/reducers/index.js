import {
  FETCH_APPOINTMENTS,
  FETCH_APPOINTMENTS_SUCCESS,
  FETCH_APPOINTMENTS_FAILURE,
} from '../actions';

const initialState = {
  loading: false,
  data: [],
};

export default function appointments(state = initialState, action) {
  switch (action.type) {
    case FETCH_APPOINTMENTS:
      return {
        ...state,
        loading: true,
      };
    case FETCH_APPOINTMENTS_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        loading: false,
      });
    case FETCH_APPOINTMENTS_FAILURE:
      return Object.assign({}, state, {
        error: action.error,
        loading: false,
      });
    default:
      return state;
  }
}
