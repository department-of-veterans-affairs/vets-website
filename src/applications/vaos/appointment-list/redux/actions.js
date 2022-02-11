import moment from 'moment';
import * as Sentry from '@sentry/browser';
import recordEvent from 'platform/monitoring/record-event';
import {
  GA_PREFIX,
  APPOINTMENT_TYPES,
  VIDEO_TYPES,
  APPOINTMENT_STATUS,
} from '../../utils/constants';
import { recordItemsRetrieved } from '../../utils/events';
import {
  selectSystemIds,
  selectFeatureVAOSServiceRequests,
  selectFeatureVAOSServiceCCAppointments,
  selectFeatureVAOSServiceVAAppointments,
  selectFeatureFacilitiesServiceV2,
} from '../../redux/selectors';

import { getRequestMessages } from '../../services/var';

import {
  getCommunityProvider,
  getLocation,
  getLocations,
  getLocationSettings,
} from '../../services/location';

import {
  fetchAppointments,
  getAppointmentRequests,
  getVAAppointmentLocationId,
  isVideoHome,
  fetchRequestById,
  fetchBookedAppointment,
  cancelAppointment,
} from '../../services/appointment';

import { captureError, has400LevelError } from '../../utils/error';
import {
  STARTED_NEW_APPOINTMENT_FLOW,
  STARTED_NEW_VACCINE_FLOW,
} from '../../redux/sitewide';
import { selectAppointmentById } from './selectors';
import { fetchHealthcareServiceById } from '../../services/healthcare-service';

export const FETCH_FUTURE_APPOINTMENTS = 'vaos/FETCH_FUTURE_APPOINTMENTS';
export const FETCH_PENDING_APPOINTMENTS = 'vaos/FETCH_PENDING_APPOINTMENTS';
export const FETCH_PENDING_APPOINTMENTS_FAILED =
  'vaos/FETCH_PENDING_APPOINTMENTS_FAILED';
export const FETCH_PENDING_APPOINTMENTS_SUCCEEDED =
  'vaos/FETCH_PENDING_APPOINTMENTS_SUCCEEDED';
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

export const FETCH_REQUEST_MESSAGES = 'vaos/FETCH_REQUEST_MESSAGES';
export const FETCH_REQUEST_MESSAGES_FAILED =
  'vaos/FETCH_REQUEST_MESSAGES_FAILED';
export const FETCH_REQUEST_MESSAGES_SUCCEEDED =
  'vaos/FETCH_REQUEST_MESSAGES_SUCCEEDED';

export const CANCEL_APPOINTMENT = 'vaos/CANCEL_APPOINTMENT';
export const CANCEL_APPOINTMENT_CONFIRMED = 'vaos/CANCEL_APPOINTMENT_CONFIRMED';
export const CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED =
  'vaos/CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED';
export const CANCEL_APPOINTMENT_CONFIRMED_FAILED =
  'vaos/CANCEL_APPOINTMENT_CONFIRMED_FAILED';
export const CANCEL_APPOINTMENT_CLOSED = 'vaos/CANCEL_APPOINTMENT_CLOSED';
export const FETCH_FACILITY_LIST_DATA_SUCCEEDED =
  'vaos/FETCH_FACILITY_LIST_DATA_SUCCEEDED';
export const FETCH_FACILITY_SETTINGS = 'vaos/FETCH_FACILITY_SETTINGS';
export const FETCH_FACILITY_SETTINGS_FAILED =
  'vaos/FETCH_FACILITY_SETTINGS_FAILED';
export const FETCH_FACILITY_SETTINGS_SUCCEEDED =
  'vaos/FETCH_FACILITY_SETTINGS_SUCCEEDED';
export const UPDATE_BREADCRUMB = 'vaos/UPDATE_BREADCRUMB';

export function fetchRequestMessages(requestId) {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_REQUEST_MESSAGES,
      });
      const messages = await getRequestMessages(requestId);
      dispatch({
        type: FETCH_REQUEST_MESSAGES_SUCCEEDED,
        requestId,
        messages,
      });
    } catch (error) {
      captureError(error);
      dispatch({
        type: FETCH_REQUEST_MESSAGES_FAILED,
        error,
      });
    }
  };
}

/*
 * The facility data we get back from the various endpoints for
 * requests and appointments does not have basics like address or phone.
 *
 * We want to show that basic info on the list page, so this goes and fetches
 * it separately, but doesn't block the list page from displaying
 */
async function getAdditionalFacilityInfo(futureAppointments, useV2 = false) {
  // Get facility ids from non-VA appts or requests
  const nonVaFacilityAppointmentIds = futureAppointments
    .filter(
      appt => !appt.vaos?.isVideo && (appt.vaos?.isCommunityCare || !appt.vaos),
    )
    .map(appt => appt.facilityId || appt.facility?.facilityCode);

  // Get facility ids from VA appointments
  const vaFacilityAppointmentIds = futureAppointments
    .filter(appt => appt.vaos && !appt.vaos.isCommunityCare)
    .map(getVAAppointmentLocationId);

  const uniqueFacilityIds = new Set(
    [...nonVaFacilityAppointmentIds, ...vaFacilityAppointmentIds].filter(
      id => !!id,
    ),
  );
  let facilityData = null;
  if (uniqueFacilityIds.size > 0) {
    facilityData = await getLocations({
      facilityIds: Array.from(uniqueFacilityIds),
      useV2,
    });
  }

  return facilityData;
}

/**
 * Function to retrieve facility information from the appointment
 * record when using the v2 api.
 *
 * @param {*} appointments
 */
function getAdditionalFacilityInfoV2(appointments) {
  // Facility information included with v2 appointment api call.
  return appointments
    ?.map(appt => (appt.vaos.facilityData ? appt.vaos.facilityData : null))
    .filter(n => n);
}

export function fetchFutureAppointments({ includeRequests = true } = {}) {
  return async (dispatch, getState) => {
    const featureVAOSServiceRequests = selectFeatureVAOSServiceRequests(
      getState(),
    );
    const featureVAOSServiceVAAppointments = selectFeatureVAOSServiceVAAppointments(
      getState(),
    );
    const featureFacilitiesServiceV2 = selectFeatureFacilitiesServiceV2(
      getState(),
    );
    const featureVAOSServiceCCAppointments = selectFeatureVAOSServiceCCAppointments(
      getState(),
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
      const promises = [
        fetchAppointments({
          startDate: moment()
            .subtract(30, 'days')
            .format('YYYY-MM-DD'),
          endDate: moment()
            .add(395, 'days')
            .format('YYYY-MM-DD'),
          useV2VA: featureVAOSServiceVAAppointments,
          useV2CC: featureVAOSServiceCCAppointments,
        }),
      ];

      if (includeRequests) {
        promises.push(
          getAppointmentRequests({
            startDate: moment()
              .subtract(120, 'days')
              .format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            useV2: featureVAOSServiceRequests,
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
      const data = await Promise.all(promises);

      recordEvent({
        event: `${GA_PREFIX}-get-future-appointments-retrieved`,
      });
      recordItemsRetrieved('upcoming', data[0]?.length);
      recordItemsRetrieved(
        'video_home',
        data[0]?.filter(appt => isVideoHome(appt)).length,
      );

      recordItemsRetrieved(
        'video_atlas',
        data[0]?.filter(appt => appt.videoData.isAtlas).length,
      );

      recordItemsRetrieved(
        'video_va_facility',
        data[0]?.filter(appt => appt.videoData.kind === VIDEO_TYPES.clinic)
          .length,
      );

      recordItemsRetrieved(
        'video_gfe',
        data[0]?.filter(appt => appt.videoData.kind === VIDEO_TYPES.gfe).length,
      );

      recordItemsRetrieved(
        'video_store_forward',
        data[0]?.filter(
          appt => appt.videoData.kind === VIDEO_TYPES.storeForward,
        ).length,
      );

      dispatch({
        type: FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
        data: data[0],
      });

      try {
        let facilityData;
        if (featureVAOSServiceVAAppointments) {
          facilityData = getAdditionalFacilityInfoV2(data[0]);
        } else {
          facilityData = await getAdditionalFacilityInfo(
            [].concat(...data),
            featureFacilitiesServiceV2,
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

      if (
        data[0]
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

export function fetchPendingAppointments() {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: FETCH_PENDING_APPOINTMENTS,
      });

      const state = getState();
      const featureVAOSServiceRequests = selectFeatureVAOSServiceRequests(
        state,
      );
      const featureFacilitiesServiceV2 = selectFeatureFacilitiesServiceV2(
        state,
      );

      const pendingAppointments = await getAppointmentRequests({
        startDate: moment()
          .subtract(120, 'days')
          .format('YYYY-MM-DD'),
        endDate: moment()
          .add(featureVAOSServiceRequests ? 1 : 0, 'days')
          .format('YYYY-MM-DD'),
        useV2: featureVAOSServiceRequests,
      });

      dispatch({
        type: FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
        data: pendingAppointments,
      });

      recordEvent({
        event: `${GA_PREFIX}-get-pending-appointments-retrieved`,
      });

      try {
        let facilityData;
        if (featureVAOSServiceRequests) {
          facilityData = getAdditionalFacilityInfoV2(pendingAppointments);
        } else {
          facilityData = await getAdditionalFacilityInfo(
            pendingAppointments,
            featureFacilitiesServiceV2,
          );
        }
        if (facilityData) {
          dispatch({
            type: FETCH_FACILITY_LIST_DATA_SUCCEEDED,
            facilityData,
          });
        }
      } catch (error) {
        captureError(error);
      }

      return pendingAppointments;
    } catch (error) {
      recordEvent({
        event: `${GA_PREFIX}-get-pending-appointments-failed`,
      });
      dispatch({
        type: FETCH_PENDING_APPOINTMENTS_FAILED,
      });
      return captureError(error);
    }
  };
}

export function fetchPastAppointments(startDate, endDate, selectedIndex) {
  return async (dispatch, getState) => {
    const featureVAOSServiceVAAppointments = selectFeatureVAOSServiceVAAppointments(
      getState(),
    );
    const featureFacilitiesServiceV2 = selectFeatureFacilitiesServiceV2(
      getState(),
    );
    const featureVAOSServiceCCAppointments = selectFeatureVAOSServiceCCAppointments(
      getState(),
    );

    dispatch({
      type: FETCH_PAST_APPOINTMENTS,
      selectedIndex,
    });

    recordEvent({
      event: `${GA_PREFIX}-get-past-appointments-started`,
    });

    try {
      const fetches = [
        fetchAppointments({
          startDate,
          endDate,
          useV2VA: featureVAOSServiceVAAppointments,
          useV2CC: featureVAOSServiceCCAppointments,
        }),
      ];

      const [appointments, requests] = await Promise.all(fetches);

      dispatch({
        type: FETCH_PAST_APPOINTMENTS_SUCCEEDED,
        appointments,
        requests,
        startDate,
        endDate,
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
            featureFacilitiesServiceV2,
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
      const featureVAOSServiceRequests = selectFeatureVAOSServiceRequests(
        state,
      );
      const featureFacilitiesServiceV2 = selectFeatureFacilitiesServiceV2(
        state,
      );
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
          useV2: featureVAOSServiceRequests,
        });
        facilityId = getVAAppointmentLocationId(request);
        facility = state.appointments.facilityData?.[facilityId];
      }

      if (facilityId && !facility) {
        try {
          facility = await getLocation({
            facilityId,
            useV2: featureFacilitiesServiceV2,
          });
        } catch (e) {
          captureError(e);
        }
      }
      if (featureVAOSServiceRequests && request.practitioners?.length) {
        request.preferredCommunityCareProviders = [
          await getCommunityProvider(
            request.practitioners[0].identifier[0].value,
          ),
        ];
      }

      dispatch({
        type: FETCH_REQUEST_DETAILS_SUCCEEDED,
        appointment: request,
        id,
        facility,
      });

      if (!featureVAOSServiceRequests) {
        const { requestMessages } = state.appointments;
        const messages = requestMessages?.[id];

        if (!messages) {
          dispatch(fetchRequestMessages(id));
        }
      }
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
      const featureFacilitiesServiceV2 = selectFeatureFacilitiesServiceV2(
        state,
      );
      const featureVAOSServiceCCAppointments = selectFeatureVAOSServiceCCAppointments(
        state,
      );
      const useV2 =
        type === 'cc'
          ? featureVAOSServiceCCAppointments
          : featureVAOSServiceVAAppointments;
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
            useV2: featureFacilitiesServiceV2,
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
    const appointment = getState().appointments.appointmentToCancel;
    const featureVAOSServiceRequests = selectFeatureVAOSServiceRequests(
      getState(),
    );
    const featureVAOSServiceVAAppointments = selectFeatureVAOSServiceVAAppointments(
      getState(),
    );

    try {
      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED,
      });

      const updatedAppointment = await cancelAppointment({
        appointment,
        useV2:
          (featureVAOSServiceRequests &&
            appointment.status === APPOINTMENT_STATUS.proposed) ||
          (featureVAOSServiceVAAppointments &&
            appointment.status !== APPOINTMENT_STATUS.proposed),
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
    const featureFacilitiesServiceV2 = selectFeatureFacilitiesServiceV2(
      getState(),
    );
    dispatch({
      type: FETCH_FACILITY_SETTINGS,
    });

    try {
      const initialState = getState();
      const siteIds = selectSystemIds(initialState) || [];

      const settings = await getLocationSettings({
        siteIds,
        useV2: featureFacilitiesServiceV2,
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

export function updateBreadcrumb(breadcrumb) {
  return async (dispatch, _getState) => {
    dispatch({ type: UPDATE_BREADCRUMB, breadcrumb });
  };
}
