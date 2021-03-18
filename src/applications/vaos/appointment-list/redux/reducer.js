import moment from 'moment';
import set from 'platform/utilities/data/set';

import {
  FETCH_FUTURE_APPOINTMENTS,
  FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
  FETCH_FUTURE_APPOINTMENTS_FAILED,
  FETCH_PENDING_APPOINTMENTS,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
  FETCH_PENDING_APPOINTMENTS_FAILED,
  FETCH_PAST_APPOINTMENTS,
  FETCH_PAST_APPOINTMENTS_SUCCEEDED,
  FETCH_PAST_APPOINTMENTS_FAILED,
  FETCH_REQUEST_DETAILS,
  FETCH_REQUEST_DETAILS_SUCCEEDED,
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
  FETCH_CONFIRMED_DETAILS,
  FETCH_CONFIRMED_DETAILS_SUCCEEDED,
  FETCH_CONFIRMED_DETAILS_FAILED,
  FETCH_REQUEST_DETAILS_FAILED,
  FETCH_DIRECT_SCHEDULE_SETTINGS_FAILED,
  FETCH_DIRECT_SCHEDULE_SETTINGS_SUCCEEDED,
  FETCH_DIRECT_SCHEDULE_SETTINGS,
} from './actions';

import {
  FORM_SUBMIT_SUCCEEDED,
  EXPRESS_CARE_FORM_SUBMIT_SUCCEEDED,
  VACCINE_FORM_SUBMIT_SUCCEEDED,
} from '../../redux/sitewide';

import { sortMessages } from '../../services/appointment';
import {
  FETCH_STATUS,
  APPOINTMENT_STATUS,
  EXPRESS_CARE,
} from '../../utils/constants';
import { distanceBetween } from '../../utils/address';
import { getFacilityIdFromLocation } from '../../services/location';

const WEEKDAY_INDEXES = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

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
  appointmentDetails: {},
  appointmentDetailsStatus: FETCH_STATUS.notStarted,
  appointmentToCancel: null,
  facilityData: {},
  requestMessages: {},
  systemClinicToFacilityMap: {},
  expressCareWindowsStatus: FETCH_STATUS.notStarted,
  expressCareFacilities: null,
  directScheduleSettingsStatus: FETCH_STATUS.notStarted,
  directScheduleSettings: null,
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
      const { appointments, requests = [], startDate, endDate } = action;

      const past = appointments
        ?.filter(appt => {
          const apptDateTime = moment(appt.start);
          return (
            apptDateTime.isValid() && apptDateTime.isBetween(startDate, endDate)
          );
        })
        .concat(
          requests.filter(appt => {
            const apptDateTime = moment(appt.created);
            return (
              apptDateTime.isValid() &&
              apptDateTime.isBetween(startDate, endDate)
            );
          }),
        );

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
    case FETCH_REQUEST_MESSAGES_SUCCEEDED: {
      const requestMessages = { ...state.requestMessages };
      const messages = action.messages;

      if (messages?.length)
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
      const { settings, address, facilityData } = action;
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

      if (address && facilityData) {
        const facilityMap = new Map();
        facilityData.forEach(facility => {
          facilityMap.set(getFacilityIdFromLocation(facility), facility);
        });

        expressCareFacilities.sort((facility1, facility2) => {
          const facilityData1 = facilityMap.get(facility1.facilityId);
          const facilityData2 = facilityMap.get(facility2.facilityId);
          const distanceToFacility1 = parseFloat(
            distanceBetween(
              address.latitude,
              address.longitude,
              facilityData1.position.latitude,
              facilityData1.position.longitude,
            ),
          );
          const distanceToFacility2 = parseFloat(
            distanceBetween(
              address.latitude,
              address.longitude,
              facilityData2.position.latitude,
              facilityData2.position.longitude,
            ),
          );

          return distanceToFacility1 - distanceToFacility2;
        });
      }

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
      const { appointmentToCancel } = state;

      const confirmed = state.confirmed?.map(appt => {
        if (appt !== appointmentToCancel) {
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
        if (appt !== appointmentToCancel) {
          return appt;
        }

        const newAppt = {
          ...appt,
          legacyVAR: {
            ...appt.legacyVAR,
            apiData: action.apiData,
          },
        };

        return { ...newAppt, status: APPOINTMENT_STATUS.cancelled };
      });

      let appointmentDetails = state.appointmentDetails;

      if (appointmentDetails?.[appointmentToCancel.id]) {
        appointmentDetails = {
          ...appointmentDetails,
          [appointmentToCancel.id]: {
            ...appointmentDetails[appointmentToCancel.id],
            status: APPOINTMENT_STATUS.cancelled,
            legacyVAR: {
              ...appointmentDetails[appointmentToCancel.id].legacyVAR,
              apiData: action.apiData,
            },
          },
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
    case VACCINE_FORM_SUBMIT_SUCCEEDED:
      return {
        ...state,
        confirmed: null,
        confirmedStatus: FETCH_STATUS.notStarted,
      };
    case FETCH_DIRECT_SCHEDULE_SETTINGS:
      return {
        ...state,
        directScheduleSettingsStatus: FETCH_STATUS.loading,
      };
    case FETCH_DIRECT_SCHEDULE_SETTINGS_SUCCEEDED:
      return {
        ...state,
        directScheduleSettingsStatus: FETCH_STATUS.succeeded,
        directScheduleSettings: action.settings,
      };
    case FETCH_DIRECT_SCHEDULE_SETTINGS_FAILED:
      return {
        ...state,
        directScheduleSettingsStatus: FETCH_STATUS.failed,
      };
    default:
      return state;
  }
}
