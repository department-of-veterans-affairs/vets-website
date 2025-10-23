import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';

export const getFacilitiesByIds = facilityIDs => {
  return apiRequest(
    `${environment.API_URL}/v1/facilities/va?ids=${facilityIDs.join(',')}`,
  );
};
