import {
  FETCH_REPRESENTATIVE_STARTED,
  FETCH_REPRESENTATIVE_SUCCESS,
  FETCH_REPRESENTATIVE_FAILED,
} from '../actions';

const initialState = {
  loading: true,
  error: null,
  representative: null,
};

function representative(state = initialState, action) {
  switch (action.type) {
    case FETCH_REPRESENTATIVE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.response,
      };
    case FETCH_REPRESENTATIVE_SUCCESS:
      return {
        ...state,
        loading: false,
        representative: action.response,
      };
    case FETCH_REPRESENTATIVE_STARTED:
    default:
      return state;
  }
}

export default { representative };
