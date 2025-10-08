import {
  FETCH_FAILED_UPLOADS_ERROR,
  FETCH_FAILED_UPLOADS_PENDING,
  FETCH_FAILED_UPLOADS_SUCCESS,
} from '../actions/types';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export default function failedUploadsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FAILED_UPLOADS_PENDING: {
      return {
        ...state,
        loading: true,
        data: [],
        error: null,
      };
    }
    case FETCH_FAILED_UPLOADS_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.data,
        error: null,
      };
    }
    case FETCH_FAILED_UPLOADS_ERROR: {
      return {
        ...state,
        loading: false,
        data: [],
        error: action.error,
      };
    }
    default:
      return state;
  }
}
