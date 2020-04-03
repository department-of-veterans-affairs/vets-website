import moment from 'moment';
import * as Sentry from '@sentry/browser';
import { FETCH_STATUS, GA_PREFIX } from '../utils/constants';
import { getMomentConfirmedDate, isCommunityCare } from '../utils/appointment';
import recordEvent from 'platform/monitoring/record-event';
import { resetDataLayer } from '../utils/events';

import {
  getConfirmedAppointments,
  getPendingAppointments,
  getCancelReasons,
  getRequestMessages,
  updateAppointment,
  updateRequest,
  getFacilitiesInfo,
  getClinicInstitutions,
} from '../api';

import { captureError } from '../utils/error';
import { STARTED_NEW_APPOINTMENT_FLOW } from './sitewide';

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

function aggregateClinicsBySystem(appointments) {
  const facilityClinicListMap = new Map();

  appointments.forEach(appt => {
    const facility = facilityClinicListMap.get(appt.facilityId);
    if (facility) {
      facility.add(appt.clinicId);
    } else {
      facilityClinicListMap.set(appt.facilityId, new Set([appt.clinicId]));
    }
  });

  return facilityClinicListMap;
}

async function getClinicDataBySystem(facilityClinicListMap) {
  // Don't overload the backend with requests until we better understand
  // the impact
  if (facilityClinicListMap.size > 3) {
    Sentry.withScope(scope => {
      scope.setExtra('size', facilityClinicListMap.size);
      Sentry.captureMessage('Too many clinic requests required');
    });
    return [];
  }

  const facilityEntries = Array.from(facilityClinicListMap.entries());

  const clinicData = await Promise.all(
    facilityEntries
      .filter(entry => entry[1]?.size > 0)
      .map(([facilityId, clinicSet]) =>
        getClinicInstitutions(facilityId, Array.from(clinicSet)),
      ),
  );

  // We get an array of arrays of clinic data, which we can flatten
  return [].concat(...clinicData);
}

/*
 * The facility data we get back from the various endpoints for
 * requests and appointments does not have basics like address or phone.
 * Additionally, for VA appointments, the facilityId returned is not
 * the real facility id, it's the system id.
 *
 * We want to show that basic info on the list page, so this goes and fetches
 * it separately, but doesn't block the list page from displaying
 *
 * 1. Break the appt list into VA appts and everything else
 * 2. For everything but VA appts, collect the facility ids
 * 3. For VA appts, collect the facility (i.e. system) ids and the clinic ids
 *    associated with each appt
 * 4. Fetch the full clinic data for each system and specified clinics
 * 5. Collect the real facility ids from the clinic data
 * 6. De-dupe the facility ids for both non-VA and VA appointments
 * 7. Fetch the full facility data for all the unique facility ids we've collected
 */
async function getAdditionalFacilityInfo(futureAppointments) {
  // Get facility ids from non-VA appts or requests
  const requestsOrNonVAFacilityAppointments = futureAppointments.filter(
    appt => !appt.clinicId,
  );
  let facilityIds = requestsOrNonVAFacilityAppointments
    .map(appt => appt.facilityId || appt.facility?.facilityCode)
    .filter(id => !!id);

  // Get facility ids from VA appointments
  const vaFacilityAppointments = futureAppointments.filter(
    appt => appt.clinicId,
  );
  let clinicInstitutionList = null;
  const facilityClinicListMap = aggregateClinicsBySystem(
    vaFacilityAppointments,
  );

  clinicInstitutionList = await getClinicDataBySystem(facilityClinicListMap);
  facilityIds = facilityIds.concat(
    clinicInstitutionList.map(clinic => clinic.institutionCode),
  );

  const uniqueFacilityIds = new Set(facilityIds);
  let facilityData = null;
  if (uniqueFacilityIds.size > 0) {
    facilityData = await getFacilitiesInfo(Array.from(uniqueFacilityIds));
  }

  return {
    facilityData,
    clinicInstitutionList,
  };
}

export function fetchFutureAppointments() {
  return async (dispatch, getState) => {
    if (getState().appointments.futureStatus === FETCH_STATUS.notStarted) {
      dispatch({
        type: FETCH_FUTURE_APPOINTMENTS,
      });

      try {
        const data = await Promise.all([
          getConfirmedAppointments(
            'va',
            moment()
              .startOf('day')
              .toISOString(),
            moment()
              .startOf('day')
              .add(1, 'years')
              .toISOString(),
          ),
          getConfirmedAppointments(
            'cc',
            moment().format('YYYY-MM-DD'),
            moment()
              .add(1, 'years')
              .format('YYYY-MM-DD'),
          ),
          getPendingAppointments(
            moment()
              .subtract(30, 'days')
              .format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD'),
          ),
        ]);

        dispatch({
          type: FETCH_FUTURE_APPOINTMENTS_SUCCEEDED,
          data,
          today: moment(),
        });

        try {
          const {
            clinicInstitutionList,
            facilityData,
          } = await getAdditionalFacilityInfo(getState().appointments.future);

          if (facilityData) {
            dispatch({
              type: FETCH_FACILITY_LIST_DATA_SUCCEEDED,
              clinicInstitutionList,
              facilityData,
            });
          }
        } catch (error) {
          captureError(error);
        }
      } catch (error) {
        captureError(error);
        dispatch({
          type: FETCH_FUTURE_APPOINTMENTS_FAILED,
          error,
        });
      }
    }
  };
}

export function fetchPastAppointments(startDate, endDate) {
  return async (dispatch, getState) => {
    dispatch({
      type: FETCH_PAST_APPOINTMENTS,
    });

    try {
      const data = await Promise.all([
        getConfirmedAppointments(
          'va',
          moment(startDate).toISOString(),
          moment(endDate).toISOString(),
        ),
        getConfirmedAppointments('cc', startDate, endDate),
      ]);

      dispatch({
        type: FETCH_PAST_APPOINTMENTS_SUCCEEDED,
        data,
        startDate,
        endDate,
      });

      try {
        const {
          clinicInstitutionList,
          facilityData,
        } = await getAdditionalFacilityInfo(getState().appointments.past);

        if (facilityData) {
          dispatch({
            type: FETCH_FACILITY_LIST_DATA_SUCCEEDED,
            clinicInstitutionList,
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

const SUBMITTED_REQUEST = 'Submitted';
const CANCELLED_REQUEST = 'Cancelled';
export function confirmCancelAppointment() {
  return async (dispatch, getState) => {
    const appointment = getState().appointments.appointmentToCancel;
    const isPendingRequest = appointment.status === SUBMITTED_REQUEST;
    const eventPrefix = `${GA_PREFIX}-cancel-appointment-submission`;
    const additionalEventdata = {
      appointmentType: isPendingRequest ? 'pending' : 'confirmed',
      facilityType: isCommunityCare(appointment) ? 'cc' : 'va',
    };

    try {
      recordEvent({
        event: eventPrefix,
        ...additionalEventdata,
      });

      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED,
      });

      if (isPendingRequest) {
        await updateRequest({
          ...appointment,
          status: CANCELLED_REQUEST,
          appointmentRequestDetailCode: ['DETCODE8'],
        });
      } else {
        const cancelData = {
          appointmentTime: getMomentConfirmedDate(appointment).format(
            'MM/DD/YYYY HH:mm:ss',
          ),
          clinicId: appointment.clinicId,
          facilityId: appointment.facilityId,
          remarks: '',
          clinicName: appointment.vdsAppointments[0].clinic.name,
          cancelCode: 'PC',
        };

        const cancelReasons = await getCancelReasons(appointment.facilityId);

        if (
          cancelReasons.some(reason => reason.number === UNABLE_TO_KEEP_APPT)
        ) {
          await updateAppointment({
            ...cancelData,
            cancelReason: UNABLE_TO_KEEP_APPT,
          });
        } else if (
          cancelReasons.some(reason => VALID_CANCEL_CODES.has(reason.number))
        ) {
          const cancelReason = cancelReasons.find(reason =>
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
      });

      recordEvent({
        event: `${eventPrefix}-successful`,
        ...additionalEventdata,
      });
      resetDataLayer();
    } catch (e) {
      captureError(e, true);
      dispatch({
        type: CANCEL_APPOINTMENT_CONFIRMED_FAILED,
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
