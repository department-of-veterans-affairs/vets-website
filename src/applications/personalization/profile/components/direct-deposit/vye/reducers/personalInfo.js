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

const defaultUserInfo = {
  'vye::UserInfo': {
    pendingVerifications: [],
    verifications: [],
  },
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
      if (!state.personalInfo) {
        return {
          ...state,
          personalInfo: {
            'vye::UserInfo': defaultUserInfo['vye::UserInfo'],
          },
        };
      }
      return {
        ...state,
        personalInfo: {
          ...state.personalInfo,
          'vye::UserInfo': {
            ...(state.personalInfo['vye::UserInfo'] ||
              defaultUserInfo['vye::UserInfo']),
            verifications: action.payload,
          },
        },
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
