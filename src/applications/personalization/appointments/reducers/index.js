import {
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS,
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS_FAILED,
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS_SUCCEEDED,
} from '~/applications/personalization/dashboard-2/constants';

const initialState = {
  data: [],
  fetching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONFIRMED_FUTURE_APPOINTMENTS: {
      return { ...state, fetching: true };
    }
    case FETCH_CONFIRMED_FUTURE_APPOINTMENTS_SUCCEEDED: {
      return { ...state, fetching: false, data: action.appointments };
    }
    case FETCH_CONFIRMED_FUTURE_APPOINTMENTS_FAILED: {
      return { ...state, fetching: false };
    }
    default: {
      return { ...state };
    }
  }
};
