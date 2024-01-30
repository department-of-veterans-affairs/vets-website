import {
  FETCH_PERSONAL_INFORMATION,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
} from '~/platform/user/profile/vap-svc/actions/personalInformation';

const initialState = {
  data: {},
  error: false,
  loading: false,
};

const reducer = (state = initialState, action) => {
  const { errors, personalInformation, type } = action;
  switch (type) {
    case FETCH_PERSONAL_INFORMATION:
      return { ...state, loading: true };
    case FETCH_PERSONAL_INFORMATION_SUCCESS:
      return { ...state, data: personalInformation, loading: false };
    case FETCH_PERSONAL_INFORMATION_FAILED:
      return { ...state, data: {}, error: errors, loading: false };
    default:
      return state;
  }
};

export default reducer;
