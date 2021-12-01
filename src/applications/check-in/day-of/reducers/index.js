import { removeTimeZone } from '../utils/appointment';

const initialState = {
  appointments: [],
  context: {},
};

import {
  APPOINTMENT_WAS_CHECKED_INTO,
  PERMISSIONS_UPDATED,
  RECEIVED_APPOINTMENT_DETAILS,
  RECEIVED_DEMOGRAPHICS_DATA,
  RECEIVED_NEXT_OF_KIN_DATA,
  SET_TOKEN_CONTEXT,
  TOKEN_WAS_VALIDATED,
  TRIGGER_REFRESH,
  SEE_STAFF_MESSAGE_UPDATED,
  DEMOGRAPHICS_UPDATED,
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
    case SET_TOKEN_CONTEXT:
    case TRIGGER_REFRESH:
      return {
        ...state,
        context: { ...state.context, ...action.payload.context },
      };
    case RECEIVED_APPOINTMENT_DETAILS: {
      let payload = JSON.parse(JSON.stringify(action.payload));
      if ('appointments' in payload) {
        payload = removeTimeZone(payload);
      }
      return { ...state, ...payload };
    }
    case RECEIVED_DEMOGRAPHICS_DATA:
      return { ...state, ...action.payload };
    case RECEIVED_NEXT_OF_KIN_DATA:
      return { ...state, ...action.payload };
    case TOKEN_WAS_VALIDATED:
      return { ...state, ...action.payload };

    case SEE_STAFF_MESSAGE_UPDATED:
      return { ...state, ...action.payload };
    case DEMOGRAPHICS_UPDATED:
      return { ...state, ...action.payload };
    default:
      return { ...state };
  }
};

export default {
  checkInData: checkInReducer,
};
