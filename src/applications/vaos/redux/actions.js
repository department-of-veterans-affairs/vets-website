/* eslint-disable no-prototype-builtins */
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import moment from 'moment';
import { selectPatientFacilities } from '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors';
import {
  getAppointmentRequests,
  getVAAppointmentLocationId,
} from '../services/appointment';
import { getLocations } from '../services/location';
import { GA_PREFIX } from '../utils/constants';
import { captureError } from '../utils/error';
import {
  selectFeatureCCDirectScheduling,
  selectFeatureVAOSServiceRequests,
  selectFeatureFeSourceOfTruth,
} from './selectors';
import { getIsInCCPilot } from '../referral-appointments/utils/pilot';

export const FETCH_FACILITY_LIST_DATA_SUCCEEDED =
  'vaos/FETCH_FACILITY_LIST_DATA_SUCCEEDED';

export const FETCH_PENDING_APPOINTMENTS = 'vaos/FETCH_PENDING_APPOINTMENTS';
export const FETCH_PENDING_APPOINTMENTS_FAILED =
  'vaos/FETCH_PENDING_APPOINTMENTS_FAILED';
export const FETCH_PENDING_APPOINTMENTS_SUCCEEDED =
  'vaos/FETCH_PENDING_APPOINTMENTS_SUCCEEDED';

/*
   * The facility data we get back from the various endpoints for
   * requests and appointments does not have basics like address or phone.
   *
   * We want to show that basic info on the list page, so this goes and fetches
   * it separately, but doesn't block the list page from displaying
   */
export async function getAdditionalFacilityInfo(futureAppointments) {
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
export function getAdditionalFacilityInfoV2(appointments) {
  // Facility information included with v2 appointment api call.
  return appointments
    ?.map(appt => appt?.vaos?.facilityData ?? null)
    .filter(n => n);
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
      const featureCCDirectScheduling = selectFeatureCCDirectScheduling(state);
      const useFeSourceOfTruth = selectFeatureFeSourceOfTruth(state);
      const patientFacilities = selectPatientFacilities(state);
      const includeEPS = getIsInCCPilot(
        featureCCDirectScheduling,
        patientFacilities || [],
      );

      const pendingAppointments = await getAppointmentRequests({
        startDate: moment()
          .subtract(120, 'days')
          .format('YYYY-MM-DD'),
        endDate: moment()
          .add(featureVAOSServiceRequests ? 2 : 0, 'days')
          .format('YYYY-MM-DD'),
        includeEPS,
        useFeSourceOfTruth,
      });

      const data = pendingAppointments?.filter(
        appt => !appt.hasOwnProperty('meta'),
      );
      const backendServiceFailures = pendingAppointments.find(
        appt => appt.hasOwnProperty('meta') || null,
      );

      dispatch({
        type: FETCH_PENDING_APPOINTMENTS_SUCCEEDED,
        data,
        backendServiceFailures,
      });

      recordEvent({
        event: `${GA_PREFIX}-get-pending-appointments-retrieved`,
      });

      try {
        let facilityData;
        if (featureVAOSServiceRequests) {
          facilityData = getAdditionalFacilityInfoV2(data);
        } else {
          facilityData = await getAdditionalFacilityInfo(data);
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

      return data;
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
