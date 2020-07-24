import moment from 'moment';
import set from 'platform/utilities/data/set';

import {
  FETCH_EXPRESS_CARE_WINDOWS,
  FETCH_EXPRESS_CARE_WINDOWS_FAILED,
  FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_FUTURE_APPOINTMENTS_FAILED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS_FAILED,
  FETCH_REQUEST_MESSAGES_SUCCEEDED,
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_CONFIRMED,
  CANCEL_APPOINTMENT_CONFIRMED_FAILED,
  CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
  CANCEL_APPOINTMENT_CLOSED,
  FETCH_FACILITY_LIST_DATA_SUCCEEDED,
} from '../actions/appointments';

import { FORM_SUBMIT_SUCCEEDED } from '../actions/sitewide';

import { sortMessages } from '../services/appointment';
import {
  FETCH_STATUS,
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
} from '../utils/constants';

const initialState = {
  future: null,
  futureStatus: FETCH_STATUS.notStarted,
  past: null,
  pastStatus: FETCH_STATUS.notStarted,
  pastSelectedIndex: 0,
  showCancelModal: false,
  cancelAppointmentStatus: FETCH_STATUS.notStarted,
  appointmentToCancel: null,
  facilityData: {},
  requestMessages: {},
  systemClinicToFacilityMap: {},
  expressCare: {
    windowsStatus: FETCH_STATUS.notStarted,
    allowRequests: false,
    localWindowString: null,
    minStart: null,
    maxEnd: null,
  },
};

export default function appointmentsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FUTURE_APPOINTMENTS:
      return {
        ...state,
        futureStatus: FETCH_STATUS.loading,
      };
    case FETCH_FUTURE_APPOINTMENTS_SUCCEEDED: {
      const [bookedAppointments, requests] = action.data;

      return {
        ...state,
        future: [...bookedAppointments, ...requests],
        futureStatus: FETCH_STATUS.succeeded,
      };
    }
    case FETCH_FUTURE_APPOINTMENTS_FAILED:
      return {
        ...state,
        futureStatus: FETCH_STATUS.failed,
        future: null,
      };
    case FETCH_PAST_APPOINTMENTS:
      return {
        ...state,
        pastStatus: FETCH_STATUS.loading,
        pastSelectedIndex: action.selectedIndex,
      };
    case FETCH_PAST_APPOINTMENTS_SUCCEEDED: {
      const { data, startDate, endDate } = action;

      const past = data?.filter(appt => {
        const apptDateTime = moment(appt.start);
        return (
          apptDateTime.isValid() && apptDateTime.isBetween(startDate, endDate)
        );
      });

      return {
        ...state,
        past,
        pastStatus: FETCH_STATUS.succeeded,
      };
    }
    case FETCH_PAST_APPOINTMENTS_FAILED:
      return {
        ...state,
        pastStatus: FETCH_STATUS.failed,
        past: null,
      };
    case FETCH_FACILITY_LIST_DATA_SUCCEEDED: {
      const facilityData = action.facilityData.reduce(
        (acc, facility) => ({
          ...acc,
          [facility.id]: facility,
        }),
        {},
      );
      return {
        ...state,
        facilityData,
      };
    }
    case FETCH_REQUEST_MESSAGES_SUCCEEDED: {
      const requestMessages = { ...state.requestMessages };
      const messages = action.messages;

      if (messages.length)
        requestMessages[action.requestId] = messages.sort(sortMessages);

      return {
        ...state,
        requestMessages,
      };
    }
    case CANCEL_APPOINTMENT:
      return {
        ...state,
        showCancelModal: true,
        appointmentToCancel: action.appointment,
        cancelAppointmentStatus: FETCH_STATUS.notStarted,
      };
    case CANCEL_APPOINTMENT_CONFIRMED:
      return {
        ...state,
        showCancelModal: true,
        cancelAppointmentStatus: FETCH_STATUS.loading,
      };
    case CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED: {
      const future = state.future.map(appt => {
        if (appt !== state.appointmentToCancel) {
          return appt;
        }

        let newAppt = appt;

        if (
          state.appointmentToCancel.vaos?.appointmentType ===
          APPOINTMENT_TYPES.vaAppointment
        ) {
          newAppt = set(
            'legacyVAR.apiData.vdsAppointments[0].currentStatus',
            'CANCELLED BY PATIENT',
            newAppt,
          );
          newAppt.description = 'CANCELLED BY PATIENT';
        } else {
          newAppt = {
            ...newAppt,
            apiData: action.apiData,
          };
        }

        return { ...newAppt, status: APPOINTMENT_STATUS.cancelled };
      });
      return {
        ...state,
        showCancelModal: true,
        future,
        cancelAppointmentStatus: FETCH_STATUS.succeeded,
        cancelAppointmentStatusVaos400: false,
      };
    }
    case CANCEL_APPOINTMENT_CONFIRMED_FAILED:
      return {
        ...state,
        showCancelModal: true,
        cancelAppointmentStatus: FETCH_STATUS.failed,
        cancelAppointmentStatusVaos400: action.isVaos400Error,
      };
    case CANCEL_APPOINTMENT_CLOSED:
      return {
        ...state,
        showCancelModal: false,
        appointmentToCancel: null,
        cancelAppointmentStatus: FETCH_STATUS.notStarted,
      };
    case FORM_SUBMIT_SUCCEEDED:
      return {
        ...state,
        future: null,
        futureStatus: FETCH_STATUS.notStarted,
      };
    case FETCH_EXPRESS_CARE_WINDOWS:
      return {
        ...state,
        expressCare: {
          ...initialState.expressCare,
          windowsStatus: FETCH_STATUS.loading,
        },
      };
    case FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED: {
      const { facilityData, nowUtc } = action;
      const times = []
        .concat(...facilityData)
        .filter(f => !!f.expressTimes)
        .map(f => {
          const { expressTimes, authoritativeName, id } = f;
          const { start, end, offsetUtc, timezone } = expressTimes;
          const today = nowUtc.format('YYYY-MM-DD');
          const startString = `${today}T${start}${offsetUtc}`;
          const endString = `${today}T${end}${offsetUtc}`;

          return {
            utcStart: moment.utc(startString).format(),
            utcEnd: moment.utc(endString).format(),
            start: moment.parseZone(startString).format(),
            end: moment.parseZone(endString).format(),
            offset: offsetUtc,
            timeZone: timezone,
            name: f.authoritativeName,
            id,
          };
        })
        .sort((a, b) => (a.utcStart < b.utcStart ? -1 : 1));

      let minStart;
      let maxEnd;

      if (times.length) {
        const timesReverseSorted = times.sort(
          (a, b) => (a.utcEnd > b.utcEnd ? -1 : 1),
        );

        minStart = times?.[0];
        maxEnd = timesReverseSorted?.[0];
      }

      const expressCare = {
        windowsStatus: FETCH_STATUS.succeeded,
        allowRequests:
          times.length && nowUtc.isBetween(minStart?.utcStart, maxEnd?.utcEnd),
        minStart,
        maxEnd,
        localWindowString:
          minStart && maxEnd
            ? `${moment
                .parseZone(minStart.start)
                .format('h:mm a')} to ${moment
                .parseZone(maxEnd.end)
                .format('h:mm a')} ${minStart.timeZone}`
            : null,
      };

      return {
        ...state,
        expressCare: {
          windowsStatus: FETCH_STATUS.succeeded,
          allowRequests:
            times.length &&
            nowUtc.isAfter(moment.utc(minStart?.utcStart)) &&
            nowUtc.isBefore(moment.utc(maxEnd?.utcEnd)),
          minStart,
          maxEnd,
          localWindowString:
            minStart && maxEnd
              ? `${moment
                  .parseZone(minStart.start)
                  .format('h:mm a')} to ${moment
                  .parseZone(maxEnd.end)
                  .format('h:mm a')} ${minStart.timeZone}`
              : null,
        },
      };
    }
    case FETCH_EXPRESS_CARE_WINDOWS_FAILED:
      return {
        ...state,
        expressCare: {
          ...initialState.expressCare,
          windowsStatus: FETCH_STATUS.failed,
        },
      };
    default:
      return state;
  }
}
