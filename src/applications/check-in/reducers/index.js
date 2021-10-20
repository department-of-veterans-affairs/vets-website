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
      // Grabing the appointment payload and stripping out timezone here.
      // Chip should be handling this but currently isn't, this code may be refactored out.
      const updatedPayload = JSON.parse(JSON.stringify(action.payload));
      // These fields have a potential to include a time stamp.
      const timeFields = [
        'checkInWindowEnd',
        'checkInWindowStart',
        'checkedInTime',
        'startTime',
      ];

      const updatedAppointments = updatedPayload.appointments.map(
        appointment => {
          const updatedAppointment = { ...appointment };
          // If field exists in object we will replace the TZ part of the string.
          timeFields.forEach(field => {
            if (field in updatedAppointment) {
              updatedAppointment[field] = updatedAppointment[field].replace(
                /(?=\.).*/,
                '',
              );
            }
          });
          return updatedAppointment;
        },
      );
      return { ...state, appointments: updatedAppointments };
    }
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
