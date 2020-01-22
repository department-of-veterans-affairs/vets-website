import set from 'platform/utilities/data/set';

import {
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_FUTURE_APPOINTMENTS_FAILED,
  FETCH_REQUEST_MESSAGES_SUCCEEDED,
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_CONFIRMED,
  CANCEL_APPOINTMENT_CONFIRMED_FAILED,
  CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
  CANCEL_APPOINTMENT_CLOSED,
  FETCH_FACILITY_LIST_DATA_SUCCEEDED,
} from '../actions/appointments';

import { FORM_CLOSED_CONFIRMATION_PAGE } from '../actions/newAppointment';

import {
  filterFutureConfirmedAppointments,
  filterRequests,
  sortFutureConfirmedAppointments,
  sortFutureRequests,
  sortMessages,
  getRealFacilityId,
} from '../utils/appointment';
import { FETCH_STATUS } from '../utils/constants';

const initialState = {
  future: null,
  futureStatus: FETCH_STATUS.notStarted,
  past: null,
  pastStatus: FETCH_STATUS.notStarted,
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
      const [vaAppointments, ccAppointments, requests] = action.data;

      const confirmedFilteredAndSorted = [...vaAppointments, ...ccAppointments]
        .filter(appt => filterFutureConfirmedAppointments(appt, action.today))
        .sort(sortFutureConfirmedAppointments);

      const requestsFilteredAndSorted = [
        ...requests.filter(req => filterRequests(req, action.today)),
      ].sort(sortFutureRequests);

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

        // confirmed VA appt
        if (state.appointmentToCancel.clinicId) {
          return set(
            'vdsAppointments[0].currentStatus',
            'CANCELLED BY PATIENT',
            appt,
          );
        }

        // Appt request
        return { ...appt, status: 'Cancelled' };
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
    case FORM_CLOSED_CONFIRMATION_PAGE:
      return {
        ...state,
        future: null,
        futureStatus: FETCH_STATUS.notStarted,
      };
    default:
      return state;
  }
}
