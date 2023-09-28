import {
  FETCH_NEXT_OF_KIN_FAILED,
  FETCH_NEXT_OF_KIN_STARTED,
  FETCH_NEXT_OF_KIN_SUCCEEDED,
} from '@@profile/actions/nok';

export const initialState = {
  data: false,
  error: false,
  loading: false,
};

export const nextOfKinReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case FETCH_NEXT_OF_KIN_STARTED:
      return { ...state, loading: true };
    case FETCH_NEXT_OF_KIN_SUCCEEDED:
      return { ...state, data: payload, loading: false };
    case FETCH_NEXT_OF_KIN_FAILED:
      return { ...state, data: payload, loading: false, error: true };
    default:
      return state;
  }
};
