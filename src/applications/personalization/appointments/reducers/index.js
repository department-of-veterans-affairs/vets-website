import {
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS,
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS_FAILED,
  FETCH_CONFIRMED_FUTURE_APPOINTMENTS_SUCCEEDED,
} from '../actions';

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
      return { ...state, fetching: false, errors: action.errors };
    }
    default: {
      return { ...state };
    }
  }
};
