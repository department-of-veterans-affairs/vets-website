import {
  FETCHING_LATEST_TERMS,
  FETCH_LATEST_TERMS_SUCCESS,
  FETCH_LATEST_TERMS_FAILURE,
  ACCEPTING_LATEST_TERMS,
  ACCEPT_LATEST_TERMS_SUCCESS,
  ACCEPT_LATEST_TERMS_FAILURE
} from '../actions';

const initialState = {
  attributes: {},
  errors: null,
  loading: false
};

function termsAndConditions(state = initialState, action) {
  switch (action.type) {
    case ACCEPTING_LATEST_TERMS:
    case FETCHING_LATEST_TERMS:
      return {
        ...state,
        errors: null,
        loading: true
      };

    case ACCEPT_LATEST_TERMS_SUCCESS:
      return { ...state, loading: true };

    case FETCH_LATEST_TERMS_SUCCESS: {
      return {
        ...state,
        attributes: action.data.attributes,
        loading: false
      };
    }

    case ACCEPT_LATEST_TERMS_FAILURE:
    case FETCH_LATEST_TERMS_FAILURE:
      return {
        ...state,
        errors: action.errors,
        loading: false
      };

    default:
      return state;
  }
}

export default { termsAndConditions };
