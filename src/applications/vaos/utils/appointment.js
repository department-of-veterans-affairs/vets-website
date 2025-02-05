/**
 * Appointment utility methods
 * @module utils/appointment
 *
 */

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { format, parseISO } from 'date-fns';
import {
  TYPES_OF_EYE_CARE,
  TYPES_OF_SLEEP_CARE,
  AUDIOLOGY_TYPES_OF_CARE,
  TYPES_OF_CARE,
  SERVICE_CATEGORY,
} from './constants';

export const CANCELLED_APPOINTMENT_SET = new Set([
  'CANCELLED BY CLINIC & AUTO RE-BOOK',
  'CANCELLED BY CLINIC',
  'CANCELLED BY PATIENT & AUTO-REBOOK',
  'CANCELLED BY PATIENT',
]);

// Appointments in these "HIDE_STATUS_SET"s should show in list, but their status should be hidden
export const FUTURE_APPOINTMENTS_HIDE_STATUS_SET = new Set([
  'ACT REQ/CHECKED IN',
  'ACT REQ/CHECKED OUT',
]);

export const PAST_APPOINTMENTS_HIDE_STATUS_SET = new Set([
  'ACTION REQUIRED',
  'INPATIENT APPOINTMENT',
  'INPATIENT/ACT REQ',
  'INPATIENT/CHECKED IN',
  'INPATIENT/CHECKED OUT',
  'INPATIENT/FUTURE',
  'INPATIENT/NO ACT TAKN',
  'NO ACTION TAKEN',
  'NO-SHOW & AUTO RE-BOOK',
  'NO-SHOW',
  'NON-COUNT',
]);

/**
 * Replaces a mock facility id with a real facility id in non production environments
 *
 * @param {string} facilityId
 * @returns {string}
 */
export function getRealFacilityId(facilityId) {
  if ((!environment.isProduction() || window.Cypress) && facilityId) {
    return facilityId.replace('983', '442').replace('984', '552');
  }

  return facilityId;
}

/**
 * Converts back from a real facility id to our test facility ids
 * in lower environments
 *
 * @param {String} facilityId - facility id to convert
 * @returns A facility id with either 442 or 552 replaced with 983 or 984
 */
export function getTestFacilityId(facilityId) {
  if ((facilityId && !environment.isProduction()) || window.Cypress) {
    return facilityId.replace('442', '983').replace('552', '984');
  }

  return facilityId;
}

export function getTypeOfCareById(inputId) {
  const allTypesOfCare = [
    ...TYPES_OF_EYE_CARE,
    ...TYPES_OF_SLEEP_CARE,
    ...AUDIOLOGY_TYPES_OF_CARE,
    ...TYPES_OF_CARE,
    ...SERVICE_CATEGORY,
  ];

  return allTypesOfCare.find(
    ({ idV2 = '', ccId = '', id = '' }) =>
      idV2 === inputId || ccId === inputId || id === inputId,
  );
}

/**
 * Method to get patient video instruction
 * @param {Appointment} appointment A FHIR appointment resource
 * @return {string} Returns patient video instruction title and exclude remaining data
 */

export function getPatientInstruction(appointment) {
  if (appointment?.patientInstruction.includes('Medication Review')) {
    return 'Medication Review';
  }
  if (appointment?.patientInstruction.includes('Video Visit Preparation')) {
    return 'Video Visit Preparation';
  }
  return null;
}

/**
 * Get the provider name based on api version
 *
 *
 * @export
 * @param {Object} appointment an appointment object
 * @returns {String} Returns the provider first and last name
 */
export function getProviderName(appointment) {
  if (appointment.version === 1) {
    const { providerName } = appointment.communityCareProvider;
    return providerName;
  }

  if (appointment.practitioners !== undefined) {
    const providers = appointment.practitioners
      .filter(person => !!person.name)
      .map(person => `${person.name.given.join(' ')} ${person.name.family} `);
    if (providers.length > 0) {
      return providers;
    }
    return null;
  }
  return null;
}

/**
 * Function to generate appointment REST API URL
 *
 * @param {*} startDate - Appointment start date
 * @param {*} endDate - Appointment end date
 * @param {*} [statuses=[]] - Appointment statusesm i.e. ['booked', 'arrived', 'fulfilled', 'cancelled']
 * @param {number} [version=2] - API version number
 * @returns URL string
 */
export function generateAppointmentUrl(
  startDate,
  endDate,
  statuses = [],
  version = 2,
) {
  const start = format(parseISO(startDate), 'yyyy-MM-dd');
  const end = format(parseISO(endDate), 'yyyy-MM-dd');

  return `/vaos/v${version}/appointments?_include=facilities,clinics&start=${start}&end=${end}&${statuses
    .map(status => `statuses[]=${status}`)
    .join('&')}`;
}

export const TIME_TEXT = {
  AM: 'in the morning',
  PM: 'in the afternoon',
  'No Time Selected': '',
};
