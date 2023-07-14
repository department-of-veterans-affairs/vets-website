import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const apiBasePath = `${environment.API_URL}/avs/v0`;

/**
 * Get an AVS by ID
 * @param {String} id
 *
 * @returns {Object} AVS
 */
export const getAvs = async id => {
  return apiRequest(`${apiBasePath}/avs/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
