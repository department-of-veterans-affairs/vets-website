import {
  FETCH_APPOINTMENT_SUMMARY,
  FETCH_APPOINTMENT_SUMMARY_SUCCEEDED,
} from '../actions/appointments';

const initialState = {
  summary: {
    loading: true,
    data: null,
  },
};

export default function appointmentsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_APPOINTMENT_SUMMARY:
      return {
        ...state,
        summary: {
          loading: true,
        },
      };
    case FETCH_APPOINTMENT_SUMMARY_SUCCEEDED:
      return {
        ...state,
        summary: {
          loading: false,
          ...action.data,
        },
      };
    default:
      return state;
  }
}
