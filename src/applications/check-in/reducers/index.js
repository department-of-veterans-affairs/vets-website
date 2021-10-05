const initialState = {
  appointments: [],
  context: {},
};

import {
  APPOINTMENT_WAS_CHECKED_INTO,
  RECEIVED_APPOINTMENT_DETAILS,
  TOKEN_WAS_VALIDATED,
  PERMISSIONS_UPDATED,
} from '../actions';

const checkInReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVED_APPOINTMENT_DETAILS:
      return { ...state, ...action.data };
    case PERMISSIONS_UPDATED:
      return {
        ...state,
        context: { ...state.context, scope: action.value.scope },
      };
    case APPOINTMENT_WAS_CHECKED_INTO:
      return {
        ...state,
        context: { ...state.context, appointment: action.value.appointment },
      };
    case TOKEN_WAS_VALIDATED:
      return { ...state, ...action.data };
    default:
      return { ...state };
  }
};

export default {
  checkInData: checkInReducer,
};
