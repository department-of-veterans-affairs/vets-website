import {
  FETCH_PERSONAL_INFO,
  FETCH_PERSONAL_INFO_FAILED,
  FETCH_PERSONAL_INFO_SUCCESS,
} from '../actions';

const initialState = {
  personalInfo: null,
  isLoading: false,
  error: null,
};
const personalInfo = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PERSONAL_INFO:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case FETCH_PERSONAL_INFO_SUCCESS:
      return {
        ...state,
        personalInfo: action.response,
        isLoading: false,
      };
    case FETCH_PERSONAL_INFO_FAILED:
      return {
        ...state,
        error: action.errors,
        isLoading: false,
      };
    default:
      return state;
  }
};
export default personalInfo;
