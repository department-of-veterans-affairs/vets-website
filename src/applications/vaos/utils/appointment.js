/**
 * Appointment utility methods
 * @module utils/appointment
 *
 */

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { addDays, differenceInDays } from 'date-fns';
import {
  TYPES_OF_EYE_CARE,
  TYPES_OF_SLEEP_CARE,
  AUDIOLOGY_TYPES_OF_CARE,
  TYPES_OF_MENTAL_HEALTH,
  TYPES_OF_CARE,
  SERVICE_CATEGORY,
} from './constants';

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
    ...TYPES_OF_MENTAL_HEALTH,
    ...TYPES_OF_CARE,
    ...SERVICE_CATEGORY,
  ];

  return allTypesOfCare.find(
    ({ idV2 = '', ccId = '', id = '' }) =>
      idV2 === inputId || ccId === inputId || id === inputId,
  );
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
 * Function to get the time remaining to file a travel claim
 * @param {String} appointmentStart - Appointment start date
 * @returns {String} - Duration of time in days to file a claim
 */

export function getDaysRemainingToFileClaim(appointmentStart) {
  const today = new Date();
  const deadline = addDays(appointmentStart, 30);
  const days = differenceInDays(deadline, today);
  if (days < 0) {
    return 0;
  }
  return days;
}

/**
 * Function to format the drive time and distance into a readable string.
 *
 * @param {number|null} driveTimeInSeconds - The drive time in seconds.
 * @param {number|null} driveTimeDistance - The distance in miles.
 * @returns {string|null} - A formatted string representing the drive time and distance,
 *                         or null if either input is falsy.
 * @example
 * // returns "5 hour and 15 minute drive (300 miles)"
 * getDriveTimeString(18900, 300);
 *
 * // returns "45 minute drive (30 miles)"
 * getDriveTimeString(2700, 30);
 *
 * // returns null
 * getDriveTimeString(null, 30);
 */
export function getDriveTimeString(driveTimeInSeconds, driveTimeDistance) {
  if (!driveTimeInSeconds || !driveTimeDistance) {
    return null;
  }

  let driveTimeString = '';
  if (driveTimeInSeconds >= 3600) {
    const hours = Math.floor(driveTimeInSeconds / 3600);
    const minutes = Math.floor((driveTimeInSeconds % 3600) / 60);

    if (minutes > 0) {
      driveTimeString = `${hours} hour and ${minutes} minute drive (${driveTimeDistance} miles)`;
    } else {
      driveTimeString = `${hours} hour${
        hours > 1 ? 's' : ''
      } drive (${driveTimeDistance} miles)`;
    }
  } else {
    const minutes = Math.floor(driveTimeInSeconds / 60);
    driveTimeString = `${minutes} minute${
      minutes > 1 ? 's' : ''
    } drive (${driveTimeDistance} miles)`;
  }

  return driveTimeString;
}
