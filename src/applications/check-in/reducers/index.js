const initialState = {};

import { RECEIVED_APPOINTMENT_DETAILS, WAS_CHECKED_IN } from '../actions';

const checkInReducer = (state = initialState, action) => {
  switch (action.value) {
    case RECEIVED_APPOINTMENT_DETAILS:
      return { ...state, appointment: action.data };
    case WAS_CHECKED_IN:
      return { ...state, data: action.data };

    default:
      return { ...state };
  }
};

export default {
  checkInData: checkInReducer,
};
