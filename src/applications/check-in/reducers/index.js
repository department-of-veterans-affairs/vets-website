const initialState = {};

import { RECEIVED_APPOINTMENT_DETAILS, WAS_CHECKED_IN } from '../actions';

const checkInReducer = (state = initialState, action) => {
  // console.log({ state, action });
  switch (action.type) {
    case RECEIVED_APPOINTMENT_DETAILS:
      return { ...state, ...action.value };
    case WAS_CHECKED_IN:
      return { ...state, data: action.data };

    default:
      return { ...state };
  }
};

export default {
  checkInData: checkInReducer,
};
