import {
  FETCH_EMERGENCY_CONTACTS_FAILED,
  FETCH_EMERGENCY_CONTACTS_STARTED,
  FETCH_EMERGENCY_CONTACTS_SUCCEEDED,
} from '@@profile/actions/ec';

export const initialState = {
  data: false,
  error: false,
  loading: false,
};

export const emergencyContactsReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case FETCH_EMERGENCY_CONTACTS_STARTED:
      return { ...state, loading: true };
    case FETCH_EMERGENCY_CONTACTS_SUCCEEDED:
      return { ...state, data: payload, loading: false };
    case FETCH_EMERGENCY_CONTACTS_FAILED:
      return { ...state, data: payload, loading: false, error: true };
    default:
      return state;
  }
};
