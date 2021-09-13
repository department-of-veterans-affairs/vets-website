const initialState = {
  appointments: [],
  context: {},
};

import { RECEIVED_APPOINTMENT_DETAILS, TOKEN_WAS_VALIDATED } from '../actions';

const checkInReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVED_APPOINTMENT_DETAILS:
      return { ...state, ...action.value };
    case TOKEN_WAS_VALIDATED:
      return { ...state, ...action.data };
    default:
      return { ...state };
  }
};

export default {
  checkInData: checkInReducer,
};
