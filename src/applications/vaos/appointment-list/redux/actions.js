import moment from 'moment';
import * as Sentry from '@sentry/browser';
import recordEvent from 'platform/monitoring/record-event';
import { selectVet360ResidentialAddress } from 'platform/user/selectors';
import {
  GA_PREFIX,
  APPOINTMENT_TYPES,
  EXPRESS_CARE,
} from '../../utils/constants';
import { recordItemsRetrieved, resetDataLayer } from '../../utils/events';
import { selectSystemIds, vaosExpressCare } from '../../utils/selectors';

import {
  getCancelReasons,
  getRequestEligibilityCriteria,
  getRequestMessages,
  updateAppointment,
  updateRequest,
} from '../../services/var';

import { getLocations } from '../../services/location';

import {
  getBookedAppointments,
  getAppointmentRequests,
  getVARClinicId,
  getVARFacilityId,
  getVAAppointmentLocationId,
  getVideoAppointmentLocation,
  isVideoAppointment,
  isVideoHome,
  isAtlasLocation,
  isVideoGFE,
  isVideoVAFacility,
  isVideoStoreForward,
} from '../../services/appointment';

import { captureError, has400LevelError } from '../../utils/error';
import { STARTED_NEW_APPOINTMENT_FLOW } from '../../redux/sitewide';

export const FETCH_FUTURE_APPOINTMENTS = 'vaos/FETCH_FUTURE_APPOINTMENTS';
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

export const FETCH_EXPRESS_CARE_WINDOWS = 'vaos/FETCH_EXPRESS_CARE_WINDOWS';
export const FETCH_EXPRESS_CARE_WINDOWS_FAILED =
  'vaos/FETCH_EXPRESS_CARE_WINDOWS_FAILED';
export const FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED =
  'vaos/FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED';

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
async function getAdditionalFacilityInfo(futureAppointments) {
  // Get facility ids from non-VA appts or requests
  const nonVaFacilityAppointmentIds = futureAppointments
    .filter(
      appt =>
        !isVideoAppointment(appt) && (appt.vaos?.isCommunityCare || !appt.vaos),
    )
    .map(appt => appt.facilityId || appt.facility?.facilityCode);

  const videoAppointmentIds = futureAppointments
    .filter(appt => isVideoAppointment(appt))
    .map(getVideoAppointmentLocation);

  // Get facility ids from VA appointments
  const vaFacilityAppointmentIds = futureAppointments
    .filter(
      appt =>
        appt.vaos && !isVideoAppointment(appt) && !appt.vaos.isCommunityCare,
    )
    .map(getVAAppointmentLocationId);

  const uniqueFacilityIds = new Set(
    [
      ...nonVaFacilityAppointmentIds,
      ...videoAppointmentIds,
      ...vaFacilityAppointmentIds,
    ].filter(id => !!id),
  );
  let facilityData = null;
  if (uniqueFacilityIds.size > 0) {
    facilityData = await getLocations({
      facilityIds: Array.from(uniqueFacilityIds),
    });
  }

  return facilityData;
}

export function fetchFutureAppointments() {
  return async (dispatch, getState) => {
    dispatch({
      type: FETCH_FUTURE_APPOINTMENTS,
    });

    recordEvent({
      event: `${GA_PREFIX}-get-future-appointments-started`,
    });

    recordEvent({
      event: `${GA_PREFIX}-get-pending-appointments-started`,
    });

    try {
      const data = await Promise.all([
        getBookedAppointments({
          startDate: moment().format('YYYY-MM-DD'),
          endDate: moment()
            .add(13, 'months')
            .format('YYYY-MM-DD'),
        }),
        getAppointmentRequests({
          startDate: moment()
            .subtract(30, 'days')
            .format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
        })
          .then(requests => {
            dispatch({
              type: FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
              data: requests,
            });

            recordEvent({
              event: `${GA_PREFIX}-get-pending-appointments-retrieved`,
            });

            if (vaosExpressCare(getState())) {
              recordItemsRetrieved(
                'express_care',
                requests.filter(appt => appt.vaos.isExpressCare).length,
              );
            }

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
      ]);

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
        data[0]?.filter(appt => isAtlasLocation(appt)).length,
      );

      recordItemsRetrieved(
        'video_va_facility',
        data[0]?.filter(appt => isVideoVAFacility(appt)).length,
      );

      recordItemsRetrieved(
        'video_gfe',
        data[0]?.filter(appt => isVideoGFE(appt)).length,
      );

      recordItemsRetrieved(
        'video_store_forward',
        data[0]?.filter(appt => isVideoStoreForward(appt)).length,
      );

      dispatch({
        type: FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
        data: data[0],
      });

      try {
        const facilityData = await getAdditionalFacilityInfo(
          [].concat(...data),
        );

        if (facilityData) {
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
    dispatch({
      type: FETCH_PAST_APPOINTMENTS,
      selectedIndex,
    });

    recordEvent({
      event: `${GA_PREFIX}-get-past-appointments-started`,
    });

    try {
      const data = await getBookedAppointments({
        startDate,
        endDate,
      });

      dispatch({
        type: FETCH_PAST_APPOINTMENTS_SUCCEEDED,
        data,
        startDate,
        endDate,
      });

      recordEvent({
        event: `${GA_PREFIX}-get-past-appointments-retrieved`,
      });

      try {
        const facilityData = await getAdditionalFacilityInfo(
          getState().appointments.past,
        );

        if (facilityData) {
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

const UNABLE_TO_KEEP_APPT = '5';
const VALID_CANCEL_CODES = new Set(['4', '5', '6']);

export function cancelAppointment(appointment) {
  return {
    type: CANCEL_APPOINTMENT,
    appointment,
  };
}

const CANCELLED_REQUEST = 'Cancelled';
export function confirmCancelAppointment() {
  return async (dispatch, getState) => {
    const appointment = getState().appointments.appointmentToCancel;
    const isConfirmedAppointment =
      appointment.vaos?.appointmentType === APPOINTMENT_TYPES.vaAppointment;
    const eventPrefix = `${GA_PREFIX}-cancel-appointment-submission`;
    const additionalEventdata = {
      appointmentType: !isConfirmedAppointment ? 'pending' : 'confirmed',
      facilityType:
        appointment.vaos?.isCommunityCare || appointment.isCommunityCare
          ? 'cc'
          : 'va',
    };
    let apiData = appointment.legacyVAR?.apiData || appointment.apiData;
    let cancelReasons = null;
    let cancelReason = null;

    try {
      recordEvent({
        event: eventPrefix,
        ...additionalEventdata,
      });

      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED,
      });

      if (!isConfirmedAppointment) {
        apiData = await updateRequest({
          ...appointment.legacyVAR.apiData,
          status: CANCELLED_REQUEST,
          appointmentRequestDetailCode: ['DETCODE8'],
        });
      } else {
        const facilityId = getVARFacilityId(appointment);

        const cancelData = {
          appointmentTime: moment
            .parseZone(appointment.start)
            .format('MM/DD/YYYY HH:mm:ss'),
          clinicId: getVARClinicId(appointment),
          facilityId,
          remarks: '',
          // Grabbing this from the api data because it's not clear if
          // we have to send the real name or if the friendly name is ok
          clinicName:
            appointment.legacyVAR.apiData.vdsAppointments[0].clinic.name,
          cancelCode: 'PC',
        };

        cancelReasons = await getCancelReasons(facilityId);

        if (
          cancelReasons.some(reason => reason.number === UNABLE_TO_KEEP_APPT)
        ) {
          cancelReason = UNABLE_TO_KEEP_APPT;
          await updateAppointment({
            ...cancelData,
            cancelReason,
          });
        } else if (
          cancelReasons.some(reason => VALID_CANCEL_CODES.has(reason.number))
        ) {
          cancelReason = cancelReasons.find(reason =>
            VALID_CANCEL_CODES.has(reason.number),
          );
          await updateAppointment({
            ...cancelData,
            cancelReason: cancelReason.number,
          });
        } else {
          throw new Error('Unable to find valid cancel reason');
        }
      }

      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED_SUCCEEDED,
        apiData,
      });

      recordEvent({
        event: `${eventPrefix}-successful`,
        ...additionalEventdata,
      });
      resetDataLayer();
    } catch (e) {
      const isVaos400Error = has400LevelError(e);
      if (isVaos400Error) {
        Sentry.withScope(scope => {
          scope.setExtra('error', e);
          scope.setExtra('cancelReasons', cancelReasons);
          scope.setExtra('cancelReason', cancelReason);
          Sentry.captureMessage('Cancel failed due to bad request');
        });
      } else {
        captureError(e, true);
      }
      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED_FAILED,
        isVaos400Error,
      });

      recordEvent({
        event: `${eventPrefix}-failed`,
        ...additionalEventdata,
      });
      resetDataLayer();
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

export function fetchExpressCareWindows() {
  return async (dispatch, getState) => {
    dispatch({
      type: FETCH_EXPRESS_CARE_WINDOWS,
    });

    const initialState = getState();
    const userSiteIds = selectSystemIds(initialState);
    const address = selectVet360ResidentialAddress(initialState);

    try {
      const settings = await getRequestEligibilityCriteria(userSiteIds);
      let facilityData;

      if (address?.latitude && address?.longitude) {
        const facilityIds = settings
          .filter(
            facility =>
              facility.customRequestSettings?.find(
                setting => setting.id === EXPRESS_CARE,
              )?.supported,
          )
          .map(f => f.id);
        if (facilityIds.length) {
          try {
            facilityData = await getLocations({ facilityIds });
          } catch (error) {
            // Still allow people into EC if the facility data call fails
            captureError(error);
          }
        }
      }

      dispatch({
        type: FETCH_EXPRESS_CARE_WINDOWS_SUCCEEDED,
        settings,
        facilityData,
        address,
        nowUtc: moment.utc(),
      });
    } catch (error) {
      captureError(error);
      dispatch({
        type: FETCH_EXPRESS_CARE_WINDOWS_FAILED,
      });
    }
  };
}
