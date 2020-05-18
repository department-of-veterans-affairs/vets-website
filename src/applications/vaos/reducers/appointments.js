import set from 'platform/utilities/data/set';

import {
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

import {
  filterFutureConfirmedAppointments,
  filterPastAppointments,
  filterRequests,
  sortFutureConfirmedAppointments,
  sortFutureRequests,
  sortMessages,
  getRealFacilityId,
  sortPastAppointments,
  transformRequest,
  transformPastAppointment,
} from '../utils/appointment';
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

      const confirmedFilteredAndSorted = [...bookedAppointments]
        .filter(appt => filterFutureConfirmedAppointments(appt, action.today))
        .sort(sortFutureConfirmedAppointments);
      const requestsFilteredAndSorted = [
        ...requests.filter(req => filterRequests(req, action.today)),
      ]
        .map(transformRequest)
        .sort(sortFutureRequests);

      return {
        ...state,
        future: [...confirmedFilteredAndSorted, ...requestsFilteredAndSorted],
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
      const [vaAppointments, ccAppointments] = data;

      const confirmedFilteredAndSorted = [...vaAppointments, ...ccAppointments]
        .filter(appt => filterPastAppointments(appt, startDate, endDate))
        .map(transformPastAppointment)
        .sort(sortPastAppointments);

      return {
        ...state,
        past: confirmedFilteredAndSorted,
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
          [facility.uniqueId]: facility,
        }),
        {},
      );
      const systemClinicToFacilityMap =
        action.clinicInstitutionList?.reduce(
          (acc, clinic) => ({
            ...acc,
            [`${clinic.systemId}_${clinic.locationIen}`]: facilityData[
              getRealFacilityId(clinic.institutionCode)
            ],
          }),
          {},
        ) || state.systemClinicToFacilityMap;
      return {
        ...state,
        facilityData,
        systemClinicToFacilityMap,
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
          state.appointmentToCancel.appointmentType ===
          APPOINTMENT_TYPES.vaAppointment
        ) {
          newAppt = set(
            'apiData.vdsAppointments[0].currentStatus',
            'CANCELLED BY PATIENT',
            newAppt,
          );
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
      };
    }
    case CANCEL_APPOINTMENT_CONFIRMED_FAILED:
      return {
        ...state,
        showCancelModal: true,
        cancelAppointmentStatus: FETCH_STATUS.failed,
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
    default:
      return state;
  }
}
