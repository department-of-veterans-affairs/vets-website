import {
  FETCH_DEPENDENTS_SUCCESS,
  FETCH_DEPENDENTS_FAILED,
} from '../actions/index';

const initialState = {
  loading: true, // app starts in loading state
  error: null,
  onAwardDependents: null,
  notOnAwardDependents: null,
};

export function totalRating(state = initialState, action) {
  switch (action.type) {
    case FETCH_DEPENDENTS_FAILED:
      return {
        ...state,
        loading: false,
        error: {
          code: action.response.errors[0].code,
          detail: action.response.errors[0].detail,
        },
      };
    case FETCH_DEPENDENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        onAwardDependents: [],
        notOnAwardDependents: [],
      };
    default:
      return state;
  }
}
