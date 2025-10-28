import {
  CH31_FETCH_STARTED,
  CH31_FETCH_SUCCEEDED,
  CH31_FETCH_FAILED,
  CH31_ERROR_400_BAD_REQUEST,
  CH31_ERROR_403_FORBIDDEN,
  CH31_ERROR_500_SERVER,
  CH31_ERROR_503_UNAVAILABLE,
} from '../constants';

const initialState = {
  loading: false,
  error: null,
  data: null,
};

export default function ch31Eligibility(state = initialState, action) {
  switch (action.type) {
    case CH31_FETCH_STARTED:
      return { ...state, loading: true, error: null };

    case CH31_FETCH_SUCCEEDED:
      return { ...state, loading: false, data: action.payload, error: null };

    case CH31_ERROR_400_BAD_REQUEST:
    case CH31_ERROR_403_FORBIDDEN:
    case CH31_ERROR_503_UNAVAILABLE:
    case CH31_ERROR_500_SERVER:
    case CH31_FETCH_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error || { status: null, messages: ['Unknown error'] },
      };

    default:
      return state;
  }
}
