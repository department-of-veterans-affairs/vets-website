import set from 'platform/utilities/data/set';

import { isValid, isWithinInterval, parseISO } from 'date-fns';
import {
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_CLOSED,
  CANCEL_APPOINTMENT_CONFIRMED,
  CANCEL_APPOINTMENT_CONFIRMED_FAILED,
  CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
  FETCH_CONFIRMED_DETAILS,
  FETCH_CONFIRMED_DETAILS_FAILED,
  FETCH_CONFIRMED_DETAILS_SUCCEEDED,
  FETCH_FACILITY_SETTINGS,
  FETCH_FACILITY_SETTINGS_FAILED,
  FETCH_FACILITY_SETTINGS_SUCCEEDED,
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_FAILED,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_FAILED,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
  FETCH_PROVIDER_SUCCEEDED,
  FETCH_REQUEST_DETAILS,
  FETCH_REQUEST_DETAILS_FAILED,
  FETCH_REQUEST_DETAILS_SUCCEEDED,
} from './actions';

import {
  FORM_SUBMIT_SUCCEEDED,
  VACCINE_FORM_SUBMIT_SUCCEEDED,
} from '../../redux/sitewide';

import {
  FETCH_FACILITY_LIST_DATA_SUCCEEDED,
  FETCH_PENDING_APPOINTMENTS,
  FETCH_PENDING_APPOINTMENTS_FAILED,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
} from '../../redux/actions';
import { APPOINTMENT_STATUS, FETCH_STATUS } from '../../utils/constants';

const initialState = {
  pending: null,
  pendingStatus: FETCH_STATUS.notStarted,
  confirmed: [],
  confirmedStatus: FETCH_STATUS.notStarted,
  past: null,
  providerData: null,
  pastStatus: FETCH_STATUS.notStarted,
  pastSelectedIndex: 0,
  showCancelModal: false,
  cancelAppointmentStatus: FETCH_STATUS.notStarted,
  appointmentDetails: {},
  appointmentDetailsStatus: FETCH_STATUS.notStarted,
  appointmentToCancel: null,
  facilityData: {},
  systemClinicToFacilityMap: {},
  facilitySettingsStatus: FETCH_STATUS.notStarted,
  facilitySettings: null,
  backendServiceFailures: null,
};

export default function appointmentsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FUTURE_APPOINTMENTS:
      return {
        ...state,
        confirmedStatus: FETCH_STATUS.loading,
      };
    case FETCH_FUTURE_APPOINTMENTS_SUCCEEDED: {
      return {
        ...state,
        confirmed: action.data,
        confirmedStatus: FETCH_STATUS.succeeded,
        backendServiceFailures: action.backendServiceFailures,
      };
    }
    case FETCH_FUTURE_APPOINTMENTS_FAILED:
      return {
        ...state,
        confirmedStatus: FETCH_STATUS.failed,
        confirmed: null,
        error: action.error,
      };
    case FETCH_PENDING_APPOINTMENTS:
      return {
        ...state,
        pendingStatus: FETCH_STATUS.loading,
      };
    case FETCH_PENDING_APPOINTMENTS_SUCCEEDED: {
      return {
        ...state,
        pending: action.data,
        pendingStatus: FETCH_STATUS.succeeded,
        backendServiceFailures: action.backendServiceFailures,
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
      const {
        appointments,
        requests = [],
        startDate,
        endDate,
        backendServiceFailures,
      } = action;
      const past = appointments
        ?.filter(appt => {
          const apptDateTime = new Date(appt.start);
          return (
            appt.vaos.isPastAppointment &&
            isValid(apptDateTime) &&
            isWithinInterval(apptDateTime, { start: startDate, end: endDate })
          );
        })
        .concat(
          requests.filter(appt => {
            const apptDateTime = parseISO(appt.created, 'yyyy-MM-dd');
            return (
              isValid(apptDateTime) &&
              isWithinInterval(apptDateTime, { start: startDate, end: endDate })
            );
          }),
        );

      return {
        ...state,
        past,
        pastStatus: FETCH_STATUS.succeeded,
        backendServiceFailures,
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
    case FETCH_CONFIRMED_DETAILS:
    case FETCH_REQUEST_DETAILS: {
      return {
        ...state,
        appointmentDetailsStatus: FETCH_STATUS.loading,
      };
    }
    case FETCH_CONFIRMED_DETAILS_FAILED:
    case FETCH_REQUEST_DETAILS_FAILED: {
      return {
        ...state,
        appointmentDetailsStatus: FETCH_STATUS.failed,
        isBadAppointmentId: action.isBadAppointmentId,
      };
    }
    case FETCH_CONFIRMED_DETAILS_SUCCEEDED:
    case FETCH_REQUEST_DETAILS_SUCCEEDED: {
      const newState = {
        ...state,
        appointmentDetails: {
          ...state.appointmentDetails,
          [action.id]: action.appointment,
        },
        appointmentDetailsStatus: FETCH_STATUS.succeeded,
      };

      if (action.facility) {
        newState.facilityData = {
          ...state.facilityData,
          [action.facility.id]: action.facility,
        };
      }
      return newState;
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
      const { appointmentToCancel } = state;

      const confirmed = state.confirmed?.map(appt => {
        if (appt !== appointmentToCancel) {
          return appt;
        }

        const newAppt = set(
          'vaos.apiData.vdsAppointments[0].currentStatus',
          'CANCELLED BY PATIENT',
          appt,
        );
        newAppt.description = 'CANCELLED BY PATIENT';
        newAppt.cancelationReason = 'pat';

        return { ...newAppt, status: APPOINTMENT_STATUS.cancelled };
      });

      const pending = state.pending?.map(appt => {
        if (appt.id !== appointmentToCancel.id) {
          return appt;
        }

        return action.updatedAppointment;
      });

      let { appointmentDetails } = state;

      if (appointmentDetails?.[appointmentToCancel.id]) {
        const updatedAppointment = action.updatedAppointment || {
          ...appointmentDetails[appointmentToCancel.id],
          description: 'CANCELLED BY PATIENT',
          cancelationReason: 'pat',
          status: APPOINTMENT_STATUS.cancelled,
          vaos: {
            ...appointmentDetails[appointmentToCancel.id].vaos,
            apiData: action.apiData,
          },
        };

        appointmentDetails = {
          ...appointmentDetails,
          [appointmentToCancel.id]: updatedAppointment,
        };
      }

      return {
        ...state,
        showCancelModal: true,
        confirmed,
        pending,
        appointmentDetails,
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
        pending: null,
        pendingStatus: FETCH_STATUS.notStarted,
        confirmed: null,
        confirmedStatus: FETCH_STATUS.notStarted,
      };
    case VACCINE_FORM_SUBMIT_SUCCEEDED:
      return {
        ...state,
        confirmed: null,
        confirmedStatus: FETCH_STATUS.notStarted,
      };
    case FETCH_FACILITY_SETTINGS:
      return {
        ...state,
        facilitySettingsStatus: FETCH_STATUS.loading,
      };
    case FETCH_FACILITY_SETTINGS_SUCCEEDED:
      return {
        ...state,
        facilitySettingsStatus: FETCH_STATUS.succeeded,
        facilitySettings: action.settings,
      };
    case FETCH_FACILITY_SETTINGS_FAILED:
      return {
        ...state,
        facilitySettingsStatus: FETCH_STATUS.failed,
      };
    case FETCH_PROVIDER_SUCCEEDED:
      return {
        ...state,
        providerData: action.providerData,
      };
    default:
      return state;
  }
}
