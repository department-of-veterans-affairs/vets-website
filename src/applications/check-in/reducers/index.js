const initialState = {
  appointments: [],
  context: {},
};

import {
  APPOINTMENT_WAS_CHECKED_INTO,
  PERMISSIONS_UPDATED,
  RECEIVED_APPOINTMENT_DETAILS,
  RECEIVED_DEMOGRAPHICS_DATA,
  TOKEN_WAS_VALIDATED,
} from '../actions';

const checkInReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPOINTMENT_WAS_CHECKED_INTO:
      return {
        ...state,
        context: { ...state.context, appointment: action.payload.appointment },
      };
    case PERMISSIONS_UPDATED:
      return {
        ...state,
        context: { ...state.context, scope: action.payload.scope },
      };
    case RECEIVED_APPOINTMENT_DETAILS:
      return { ...state, ...action.payload };
    case RECEIVED_DEMOGRAPHICS_DATA:
      return { ...state, ...action.payload };

    case TOKEN_WAS_VALIDATED:
      return { ...state, ...action.payload };
    default:
      return { ...state };
  }
};

export default {
  checkInData: checkInReducer,
};
