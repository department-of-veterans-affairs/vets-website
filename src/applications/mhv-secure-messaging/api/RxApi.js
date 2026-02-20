import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';

/**
 * Gets a prescription by its ID
 * @param {Long} prescriptionId - The ID of the prescription to retrieve
 * @param {boolean} isCernerPilot - Whether to use v2 API for Oracle Health patients
 * @returns {Promise} - Promise resolving to the prescription data
 */
export const getPrescriptionById = (
  prescriptionId,
  isCernerPilot = false,
  stationNumber,
) => {
  const version = isCernerPilot ? 'v2' : 'v1';
  const queryParam =
    isCernerPilot && stationNumber
      ? `?station_number=${encodeURIComponent(stationNumber)}`
      : '';
  const path = `${
    environment.API_URL
  }/my_health/${version}/prescriptions/${prescriptionId}${queryParam}`;
  return apiRequest(path, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
