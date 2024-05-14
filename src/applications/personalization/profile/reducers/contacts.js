import {
  FETCH_PROFILE_CONTACTS_FAILED,
  FETCH_PROFILE_CONTACTS_STARTED,
  FETCH_PROFILE_CONTACTS_SUCCEEDED,
} from '@@profile/actions/contacts';

export const initialState = {
  data: [],
  error: false,
  loading: false,
};

export const profileContactsReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case FETCH_PROFILE_CONTACTS_STARTED:
      return { ...state, loading: true };
    case FETCH_PROFILE_CONTACTS_SUCCEEDED:
      return { ...state, data: payload.data, loading: false };
    case FETCH_PROFILE_CONTACTS_FAILED:
      return { ...state, data: [], loading: false, error: true };
    default:
      return state;
  }
};
