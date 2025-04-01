/* eslint-disable no-prototype-builtins */
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import * as Sentry from '@sentry/browser';
import { format } from 'date-fns';
import { selectPatientFacilities } from '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors';
import {
  selectFeatureCCDirectScheduling,
  selectFeatureVAOSServiceCCAppointments,
  selectFeatureVAOSServiceRequests,
  selectFeatureVAOSServiceVAAppointments,
  selectFeatureFeSourceOfTruth,
  selectFeatureFeSourceOfTruthCC,
  selectSystemIds,
} from '../../redux/selectors';
import {
  APPOINTMENT_TYPES,
  GA_PREFIX,
  VIDEO_TYPES,
} from '../../utils/constants';
import { recordItemsRetrieved } from '../../utils/events';

import { getLocation, getLocationSettings } from '../../services/location';

import {
  cancelAppointment,
  fetchAppointments,
  fetchBookedAppointment,
  fetchRequestById,
  getAppointmentRequests,
  getVAAppointmentLocationId,
  isVideoHome,
} from '../../services/appointment';

import {
  FETCH_FACILITY_LIST_DATA_SUCCEEDED,
  FETCH_PENDING_APPOINTMENTS_FAILED,
  FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
  getAdditionalFacilityInfo,
  getAdditionalFacilityInfoV2,
} from '../../redux/actions';
import {
  STARTED_NEW_APPOINTMENT_FLOW,
  STARTED_NEW_VACCINE_FLOW,
} from '../../redux/sitewide';
import { fetchHealthcareServiceById } from '../../services/healthcare-service';
import {
  captureError,
  has400LevelError,
  has404AppointmentIdError,
} from '../../utils/error';
import { selectAppointmentById } from './selectors';
import { getIsInCCPilot } from '../../referral-appointments/utils/pilot';

export const FETCH_FUTURE_APPOINTMENTS = 'vaos/FETCH_FUTURE_APPOINTMENTS';
export const FETCH_FUTURE_APPOINTMENTS_FAILED =
  'vaos/FETCH_FUTURE_APPOINTMENTS_FAILED';
export const FETCH_FUTURE_APPOINTMENTS_SUCCEEDED =
  'vaos/FETCH_FUTURE_APPOINTMENTS_SUCCEEDED';

export const FETCH_PAST_APPOINTMENTS = 'vaos/FETCH_PAST_APPOINTMENTS';
export const FETCH_PAST_APPOINTMENTS_FAILED =
  'vaos/FETCH_PAST_APPOINTMENTS_FAILED';
export const FETCH_PAST_APPOINTMENTS_SUCCEEDED =
  'vaos/FETCH_PAST_APPOINTMENTS_SUCCEEDED';

export const FETCH_REQUEST_DETAILS = 'vaos/FETCH_REQUEST_DETAILS';
export const FETCH_REQUEST_DETAILS_FAILED = 'vaos/FETCH_REQUEST_DETAILS_FAILED';
export const FETCH_REQUEST_DETAILS_SUCCEEDED =
  'vaos/FETCH_REQUEST_DETAILS_SUCCEEDED';

export const FETCH_CONFIRMED_DETAILS = 'vaos/FETCH_CONFIRMED_DETAILS';
export const FETCH_CONFIRMED_DETAILS_FAILED =
  'vaos/FETCH_CONFIRMED_DETAILS_FAILED';
export const FETCH_CONFIRMED_DETAILS_SUCCEEDED =
  'vaos/FETCH_CONFIRMED_DETAILS_SUCCEEDED';

export const FETCH_PROVIDER_SUCCEEDED = 'vaos/FETCH_PROVIDER_SUCCEEDED';

export const CANCEL_APPOINTMENT = 'vaos/CANCEL_APPOINTMENT';
export const CANCEL_APPOINTMENT_CONFIRMED = 'vaos/CANCEL_APPOINTMENT_CONFIRMED';
export const CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED =
  'vaos/CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED';
export const CANCEL_APPOINTMENT_CONFIRMED_FAILED =
  'vaos/CANCEL_APPOINTMENT_CONFIRMED_FAILED';
export const CANCEL_APPOINTMENT_CLOSED = 'vaos/CANCEL_APPOINTMENT_CLOSED';

export const FETCH_FACILITY_SETTINGS = 'vaos/FETCH_FACILITY_SETTINGS';
export const FETCH_FACILITY_SETTINGS_FAILED =
  'vaos/FETCH_FACILITY_SETTINGS_FAILED';
export const FETCH_FACILITY_SETTINGS_SUCCEEDED =
  'vaos/FETCH_FACILITY_SETTINGS_SUCCEEDED';

export function fetchFutureAppointments({ includeRequests = true } = {}) {
  return async (dispatch, getState) => {
    const state = getState();
    const featureVAOSServiceRequests = selectFeatureVAOSServiceRequests(state);
    const featureVAOSServiceVAAppointments = selectFeatureVAOSServiceVAAppointments(
      state,
    );
    const featureCCDirectScheduling = selectFeatureCCDirectScheduling(state);
    const useFeSourceOfTruth = selectFeatureFeSourceOfTruth(state);
    const useFeSourceOfTruthCC = selectFeatureFeSourceOfTruthCC(state);
    const patientFacilities = selectPatientFacilities(state);

    const includeEPS = getIsInCCPilot(
      featureCCDirectScheduling,
      patientFacilities || [],
    );

    dispatch({
      type: FETCH_FUTURE_APPOINTMENTS,
      includeRequests,
    });

    recordEvent({
      event: `${GA_PREFIX}-get-future-appointments-started`,
    });

    recordEvent({
      event: `${GA_PREFIX}-get-pending-appointments-started`,
    });

    try {
      /**
       * Canceled list will use the same fetched appointments as the upcoming
       * and requests lists, but needs confirmed to go back 30 days. Appointments
       * will be filtered out by date accordingly in our selectors
       */
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30); // Subtract 30 days

      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 395); // Add 395 days

      const promises = [
        fetchAppointments({
          startDate: format(startDate, 'yyyy-MM-dd'), // Start 30 days in the past for canceled appointments
          endDate: format(endDate, 'yyyy-MM-dd'),
          includeEPS,
          useFeSourceOfTruth,
          useFeSourceOfTruthCC,
        }),
      ];
      if (includeRequests) {
        const requestStartDate = new Date(now);
        requestStartDate.setDate(requestStartDate.getDate() - 120); // Subtract 120 days

        const requestEndDate = new Date(now);
        if (featureVAOSServiceRequests) {
          requestEndDate.setDate(requestEndDate.getDate() + 1); // Add 1 day
        }

        promises.push(
          getAppointmentRequests({
            startDate: format(requestStartDate, 'yyyy-MM-dd'), // Start 120 days in the past for requests
            endDate: format(requestEndDate, 'yyyy-MM-dd'), // End 1 day in the future for requests
            useV2: featureVAOSServiceRequests,
            includeEPS,
            useFeSourceOfTruth,
            useFeSourceOfTruthCC,
          })
            .then(requests => {
              dispatch({
                type: FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
                data: requests,
              });

              recordEvent({
                event: `${GA_PREFIX}-get-pending-appointments-retrieved`,
              });

              return requests;
            })
            .catch(resp => {
              recordEvent({
                event: `${GA_PREFIX}-get-pending-appointments-failed`,
              });
              dispatch({
                type: FETCH_PENDING_APPOINTMENTS_FAILED,
              });

              return Promise.reject(resp);
            }),
        );
      }

      const results = await Promise.all(promises);
      const data = results[0]?.filter(appt => !appt.hasOwnProperty('meta'));
      const backendServiceFailures = results[0]?.find(
        appt => appt.hasOwnProperty('meta') || null,
      );

      recordEvent({
        event: `${GA_PREFIX}-get-future-appointments-retrieved`,
      });
      recordItemsRetrieved('upcoming', data?.length);
      recordItemsRetrieved(
        'video_home',
        data?.filter(appt => isVideoHome(appt)).length,
      );

      recordItemsRetrieved(
        'video_atlas',
        data?.filter(appt => appt.videoData.isAtlas).length,
      );

      recordItemsRetrieved(
        'video_va_facility',
        data?.filter(appt => appt.videoData.kind === VIDEO_TYPES.clinic).length,
      );

      recordItemsRetrieved(
        'video_store_forward',
        data?.filter(appt => appt.videoData.kind === VIDEO_TYPES.storeForward)
          .length,
      );

      dispatch({
        type: FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
        data,
        backendServiceFailures,
      });

      try {
        let facilityData;
        if (featureVAOSServiceVAAppointments) {
          facilityData = getAdditionalFacilityInfoV2(data);
        } else {
          facilityData = await getAdditionalFacilityInfo([].concat(...results));
        }

        if (facilityData && facilityData.length > 0) {
          dispatch({
            type: FETCH_FACILITY_LIST_DATA_SUCCEEDED,
            facilityData,
          });
        }
      } catch (error) {
        captureError(error);
      }

      if (
        data
          ?.filter(appt => appt.videoData.kind === VIDEO_TYPES.clinic)
          .some(appt => !appt.location?.stationId)
      ) {
        Sentry.captureMessage('VAOS clinic based appointment missing sta6aid');
      }
    } catch (error) {
      captureError(error);
      recordEvent({
        event: `${GA_PREFIX}-get-future-appointments-failed`,
      });
      dispatch({
        type: FETCH_FUTURE_APPOINTMENTS_FAILED,
        error,
      });
    }
  };
}

export function fetchPastAppointments(startDate, endDate, selectedIndex) {
  return async (dispatch, getState) => {
    const state = getState();
    const featureVAOSServiceVAAppointments = selectFeatureVAOSServiceVAAppointments(
      state,
    );
    const featureCCDirectScheduling = selectFeatureCCDirectScheduling(state);
    const useFeSourceOfTruth = selectFeatureFeSourceOfTruth(state);
    const useFeSourceOfTruthCC = selectFeatureFeSourceOfTruthCC(state);
    const patientFacilities = selectPatientFacilities(state);
    const includeEPS = getIsInCCPilot(
      featureCCDirectScheduling,
      patientFacilities || [],
    );

    dispatch({
      type: FETCH_PAST_APPOINTMENTS,
      selectedIndex,
    });

    recordEvent({
      event: `${GA_PREFIX}-get-past-appointments-started`,
    });

    try {
      const results = await fetchAppointments({
        startDate,
        endDate,
        avs: true,
        fetchClaimStatus: true,
        includeEPS,
        useFeSourceOfTruth,
        useFeSourceOfTruthCC,
      });
      const appointments = results.filter(appt => !appt.hasOwnProperty('meta'));
      const backendServiceFailures =
        results.find(appt => appt.hasOwnProperty('meta')) || null;

      dispatch({
        type: FETCH_PAST_APPOINTMENTS_SUCCEEDED,
        appointments,
        startDate,
        endDate,
        backendServiceFailures,
      });

      recordEvent({
        event: `${GA_PREFIX}-get-past-appointments-retrieved`,
      });

      try {
        let facilityData;
        if (featureVAOSServiceVAAppointments) {
          facilityData = getAdditionalFacilityInfoV2(
            getState().appointments.past,
          );
        } else {
          facilityData = await getAdditionalFacilityInfo(
            getState().appointments.past,
          );
        }
        if (facilityData && facilityData.length > 0) {
          dispatch({
            type: FETCH_FACILITY_LIST_DATA_SUCCEEDED,
            facilityData,
          });
        }
      } catch (error) {
        captureError(error);
      }
    } catch (error) {
      captureError(error);
      dispatch({
        type: FETCH_PAST_APPOINTMENTS_FAILED,
        error,
      });

      recordEvent({
        event: `${GA_PREFIX}-get-past-appointments-failed`,
      });
    }
  };
}

export function fetchRequestDetails(id) {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const useFeSourceOfTruth = selectFeatureFeSourceOfTruth(state);
      const useFeSourceOfTruthCC = selectFeatureFeSourceOfTruthCC(state);

      let request = selectAppointmentById(state, id, [
        APPOINTMENT_TYPES.ccRequest,
        APPOINTMENT_TYPES.request,
      ]);
      let facilityId = getVAAppointmentLocationId(request);
      let facility = state.appointments.facilityData?.[facilityId];

      if (!request || (facilityId && !facility)) {
        dispatch({
          type: FETCH_REQUEST_DETAILS,
        });
      }

      if (!request) {
        request = await fetchRequestById({
          id,
          useFeSourceOfTruth,
          useFeSourceOfTruthCC,
        });
        facilityId = getVAAppointmentLocationId(request);
        facility = state.appointments.facilityData?.[facilityId];
      }

      if (facilityId && !facility) {
        try {
          facility = await getLocation({
            facilityId,
          });
        } catch (e) {
          captureError(e);
        }
      }
      dispatch({
        type: FETCH_REQUEST_DETAILS_SUCCEEDED,
        appointment: request,
        id,
        facility,
      });
    } catch (e) {
      captureError(e);
      dispatch({
        type: FETCH_REQUEST_DETAILS_FAILED,
      });
    }
  };
}

export function fetchConfirmedAppointmentDetails(id, type) {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const featureVAOSServiceVAAppointments = selectFeatureVAOSServiceVAAppointments(
        state,
      );
      const featureVAOSServiceCCAppointments = selectFeatureVAOSServiceCCAppointments(
        state,
      );
      const useV2 =
        type === 'cc'
          ? featureVAOSServiceCCAppointments
          : featureVAOSServiceVAAppointments;
      const useFeSourceOfTruth = selectFeatureFeSourceOfTruth(state);
      const useFeSourceOfTruthCC = selectFeatureFeSourceOfTruthCC(state);

      let appointment = selectAppointmentById(state, id, [
        type === 'cc'
          ? APPOINTMENT_TYPES.ccAppointment
          : APPOINTMENT_TYPES.vaAppointment,
      ]);

      let facilityId = getVAAppointmentLocationId(appointment);
      let facility = state.appointments.facilityData?.[facilityId];

      if (!appointment || (facilityId && !facility)) {
        dispatch({
          type: FETCH_CONFIRMED_DETAILS,
        });
      }

      if (!appointment) {
        appointment = await fetchBookedAppointment({
          id,
          type,
          useV2,
          useFeSourceOfTruth,
          useFeSourceOfTruthCC,
        });
      }

      // We would expect to have the clinic name here, but if we don't, fetch it
      if (
        featureVAOSServiceVAAppointments &&
        appointment.location.clinicId &&
        !appointment.location.clinicName
      ) {
        try {
          const clinic = await fetchHealthcareServiceById({
            locationId: appointment.location.stationId,
            id: appointment.location.clinicId,
          });
          appointment.location.clinicName = clinic?.serviceName;
        } catch (e) {
          // We don't want to show an overall error on this page just
          // because we don't have a clinic name, so capture the error and continue
          captureError(e);
        }
      }

      facilityId = getVAAppointmentLocationId(appointment);
      facility =
        state.appointments.facilityData?.[facilityId] ||
        appointment.vaos.facilityData;

      // Similar to the clinic, we'd expect to have the facility data included, but if
      // we don't, fetch it
      if (facilityId && !facility) {
        try {
          facility = await getLocation({
            facilityId,
          });
        } catch (e) {
          captureError(e);
        }
      }
      dispatch({
        type: FETCH_CONFIRMED_DETAILS_SUCCEEDED,
        appointment,
        id,
        facility,
      });
    } catch (e) {
      captureError(e);
      dispatch({
        type: FETCH_CONFIRMED_DETAILS_FAILED,
        isBadAppointmentId: has404AppointmentIdError(e),
      });
    }
  };
}

export function startAppointmentCancel(appointment) {
  return {
    type: CANCEL_APPOINTMENT,
    appointment,
  };
}

export function confirmCancelAppointment() {
  return async (dispatch, getState) => {
    const state = getState();
    const appointment = state.appointments.appointmentToCancel;
    const useFeSourceOfTruth = selectFeatureFeSourceOfTruth(state);
    const useFeSourceOfTruthCC = selectFeatureFeSourceOfTruthCC(state);

    try {
      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED,
      });

      const updatedAppointment = await cancelAppointment({
        appointment,
        useFeSourceOfTruth,
        useFeSourceOfTruthCC,
      });

      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
        apiData: appointment.vaos.apiData,
        updatedAppointment,
      });
    } catch (e) {
      const isVaos400Error = has400LevelError(e);
      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED_FAILED,
        isVaos400Error,
      });
    }
  };
}

export function closeCancelAppointment() {
  return {
    type: CANCEL_APPOINTMENT_CLOSED,
  };
}

export function startNewAppointmentFlow() {
  return {
    type: STARTED_NEW_APPOINTMENT_FLOW,
  };
}

export function startNewVaccineFlow() {
  return {
    type: STARTED_NEW_VACCINE_FLOW,
  };
}

export function fetchFacilitySettings() {
  return async (dispatch, getState) => {
    dispatch({
      type: FETCH_FACILITY_SETTINGS,
    });

    try {
      const initialState = getState();
      const siteIds = selectSystemIds(initialState) || [];

      const settings = await getLocationSettings({
        siteIds,
      });

      dispatch({
        type: FETCH_FACILITY_SETTINGS_SUCCEEDED,
        settings,
      });
    } catch (e) {
      dispatch({
        type: FETCH_FACILITY_SETTINGS_FAILED,
      });

      captureError(e, false);
    }
  };
}
