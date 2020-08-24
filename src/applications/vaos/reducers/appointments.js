import moment from 'moment';
import set from 'platform/utilities/data/set';

import {
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_FUTURE_APPOINTMENTS_FAILED,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
  FETCH_PENDING_APPOINTMENTS_FAILED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS_FAILED,
  FETCH_REQUEST_MESSAGES_SUCCEEDED,
  FETCH_EXPRESS_CARE_WINDOWS_FAILED,
  FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
  FETCH_EXPRESS_CARE_WINDOWS,
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_CONFIRMED,
  CANCEL_APPOINTMENT_CONFIRMED_FAILED,
  CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
  CANCEL_APPOINTMENT_CLOSED,
  FETCH_FACILITY_LIST_DATA_SUCCEEDED,
} from '../actions/appointments';

import {
  FORM_SUBMIT_SUCCEEDED,
  EXPRESS_CARE_FORM_SUBMIT_SUCCEEDED,
} from '../actions/sitewide';

import { sortMessages } from '../services/appointment';
import {
  FETCH_STATUS,
  APPOINTMENT_STATUS,
  EXPRESS_CARE,
  WEEKDAY_INDEXES,
} from '../utils/constants';

const initialState = {
  pending: null,
  pendingStatus: FETCH_STATUS.notStarted,
  confirmed: null,
  confirmedStatus: FETCH_STATUS.notStarted,
  past: null,
  pastStatus: FETCH_STATUS.notStarted,
  pastSelectedIndex: 0,
  showCancelModal: false,
  cancelAppointmentStatus: FETCH_STATUS.notStarted,
  appointmentToCancel: null,
  facilityData: {},
  requestMessages: {},
  systemClinicToFacilityMap: {},
  expressCareWindowsStatus: FETCH_STATUS.notStarted,
  expressCareFacilities: null,
};

export default function appointmentsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FUTURE_APPOINTMENTS:
      return {
        ...state,
        pendingStatus: FETCH_STATUS.loading,
        confirmedStatus: FETCH_STATUS.loading,
      };
    case FETCH_FUTURE_APPOINTMENTS_SUCCEEDED: {
      return {
        ...state,
        confirmed: action.data,
        confirmedStatus: FETCH_STATUS.succeeded,
      };
    }
    case FETCH_FUTURE_APPOINTMENTS_FAILED:
      return {
        ...state,
        confirmedStatus: FETCH_STATUS.failed,
        confirmed: null,
      };
    case FETCH_PENDING_APPOINTMENTS_SUCCEEDED: {
      return {
        ...state,
        pending: action.data,
        pendingStatus: FETCH_STATUS.succeeded,
      };
    }
    case FETCH_PENDING_APPOINTMENTS_FAILED:
      return {
        ...state,
        pendingStatus: FETCH_STATUS.failed,
        pending: null,
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

    case FETCH_EXPRESS_CARE_WINDOWS:
      return {
        ...state,
        expressCareWindowsStatus: FETCH_STATUS.loading,
      };
    case FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED: {
      const { settings } = action;
      // We're only parsing out facilities in here, since the rest
      // of the logic is very dependent on the current time and we may want
      // to re-check if EC is available without re-fecthing
      const expressCareFacilities = settings
        // This grabs just the facilities where EC is supported
        .filter(
          facility =>
            facility.customRequestSettings?.find(
              setting => setting.id === EXPRESS_CARE,
            )?.supported,
        )
        // This makes sure we only pull the days where EC is open
        .map(facility => ({
          facilityId: facility.id,
          days: facility.customRequestSettings
            .find(setting => setting.id === EXPRESS_CARE)
            .schedulingDays.filter(day => day.canSchedule)
            .map(daySchedule => ({
              ...daySchedule,
              dayOfWeekIndex: WEEKDAY_INDEXES[daySchedule.day],
            }))
            .sort((a, b) => (a.dayOfWeekIndex < b.dayOfWeekIndex ? -1 : 1)),
        }));

      return {
        ...state,
        expressCareWindowsStatus: FETCH_STATUS.succeeded,
        expressCareFacilities,
      };
    }
    case FETCH_EXPRESS_CARE_WINDOWS_FAILED:
      return {
        ...state,
        expressCareWindowsStatus: FETCH_STATUS.failed,
      };
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
      const confirmed = state.confirmed?.map(appt => {
        if (appt !== state.appointmentToCancel) {
          return appt;
        }

        const newAppt = set(
          'legacyVAR.apiData.vdsAppointments[0].currentStatus',
          'CANCELLED BY PATIENT',
          appt,
        );
        newAppt.description = 'CANCELLED BY PATIENT';

        return { ...newAppt, status: APPOINTMENT_STATUS.cancelled };
      });
      const pending = state.pending?.map(appt => {
        if (appt !== state.appointmentToCancel) {
          return appt;
        }

        const newAppt = {
          ...appt,
          apiData: action.apiData,
        };

        return { ...newAppt, status: APPOINTMENT_STATUS.cancelled };
      });

      return {
        ...state,
        showCancelModal: true,
        confirmed,
        pending,
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
    case EXPRESS_CARE_FORM_SUBMIT_SUCCEEDED:
      return {
        ...state,
        pending: null,
        pendingStatus: FETCH_STATUS.notStarted,
      };
    case FORM_SUBMIT_SUCCEEDED:
      return {
        ...state,
        pending: null,
        pendingStatus: FETCH_STATUS.notStarted,
        confirmed: null,
        confirmedStatus: FETCH_STATUS.notStarted,
      };
    default:
      return state;
  }
}
