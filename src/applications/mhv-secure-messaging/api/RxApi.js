import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

/**
 * Gets a prescription by its ID
 * @param {Long} prescriptionId - The ID of the prescription to retrieve
 * @returns {Promise} - Promise resolving to the prescription data
 */
export const getPrescriptionById = prescriptionId => {
  const path = `${apiBasePath}/prescriptions/${prescriptionId}`;
  return apiRequest(path, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
