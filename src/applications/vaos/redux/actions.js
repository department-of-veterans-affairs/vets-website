/* eslint-disable no-prototype-builtins */
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { selectPatientFacilities } from '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors';
import { addDays, subDays } from 'date-fns';
import { getIsInPilotUserStations } from '../referral-appointments/utils/pilot';
import { getAppointmentRequests } from '../services/appointment';
import { GA_PREFIX } from '../utils/constants';
import { captureError } from '../utils/error';
import {
  selectFeatureCCDirectScheduling,
  selectFeatureUseBrowserTimezone,
} from './selectors';

export const FETCH_FACILITY_LIST_DATA_SUCCEEDED =
  'vaos/FETCH_FACILITY_LIST_DATA_SUCCEEDED';

export const FETCH_PENDING_APPOINTMENTS = 'vaos/FETCH_PENDING_APPOINTMENTS';
export const FETCH_PENDING_APPOINTMENTS_FAILED =
  'vaos/FETCH_PENDING_APPOINTMENTS_FAILED';
export const FETCH_PENDING_APPOINTMENTS_SUCCEEDED =
  'vaos/FETCH_PENDING_APPOINTMENTS_SUCCEEDED';

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
      const featureCCDirectScheduling = selectFeatureCCDirectScheduling(state);
      const patientFacilities = selectPatientFacilities(state);
      const featureUseBrowserTimezone = selectFeatureUseBrowserTimezone(state);
      const includeEPS = getIsInPilotUserStations(
        featureCCDirectScheduling,
        patientFacilities || [],
      );

      const pendingAppointments = await getAppointmentRequests({
        startDate: subDays(new Date(), 120),
        endDate: addDays(new Date(), 2),
        includeEPS,
        featureUseBrowserTimezone,
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
        const facilityData = getAdditionalFacilityInfoV2(data);
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
