/**
 * Appointment utility methods
 * @module utils/appointment
 *
 */

import environment from 'platform/utilities/environment';

/**
 * Replaces a mock facility id with a real facility id in non production environments
 *
 * @param {string} facilityId
 * @returns {string}
 */

export function getRealFacilityId(facilityId) {
  if (!environment.isProduction() && facilityId) {
    return facilityId.replace('983', '442').replace('984', '552');
  }

  return facilityId;
}
