const initialState = {
  appointments: [],
  context: {},
};

import {
  APPOINTMENT_WAS_CHECKED_INTO,
  PERMISSIONS_UPDATED,
  RECEIVED_APPOINTMENT_DETAILS,
  RECEIVED_DEMOGRAPHICS_DATA,
  SET_TOKEN_CONTEXT,
  TOKEN_WAS_VALIDATED,
  TRIGGER_REFRESH,
} from '../actions';

const checkInReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPOINTMENT_WAS_CHECKED_INTO:
      return {
        ...state,
        context: { ...state.context, appointment: action.value.appointment },
      };
    case PERMISSIONS_UPDATED:
      return {
        ...state,
        context: { ...state.context, scope: action.value.scope },
      };
    case SET_TOKEN_CONTEXT:
    case TRIGGER_REFRESH:
      return {
        ...state,
        context: { ...state.context, ...action.payload.context },
      };
    case RECEIVED_APPOINTMENT_DETAILS:
      return { ...state, ...action.data };
    case RECEIVED_DEMOGRAPHICS_DATA:
      return { ...state, ...action.payload };

    case TOKEN_WAS_VALIDATED:
      return { ...state, ...action.data };
    default:
      return { ...state };
  }
};

export default {
  checkInData: checkInReducer,
};
