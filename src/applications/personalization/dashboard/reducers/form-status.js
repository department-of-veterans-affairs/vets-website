import {
  FETCH_FORM_STATUS_STARTED,
  FETCH_FORM_STATUS_SUCCEEDED,
  FETCH_FORM_STATUS_FAILED,
} from '../actions/form-status';

const initialState = {
  isLoading: true,
  forms: null,
  error: null,
};

const formStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FORM_STATUS_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_FORM_STATUS_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        forms: action.forms,
      };
    case FETCH_FORM_STATUS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default formStatusReducer;
