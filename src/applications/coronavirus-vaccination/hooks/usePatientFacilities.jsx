import { useState, useEffect } from 'react';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { requestStates } from 'platform/utilities/constants';

const FACILITIES_API = `${environment.API_URL}/v1/facilities/va`;

export default function usePatientFacilities(facilityIds = []) {
  const [facilities, setFacilities] = useState(null);
  const [status, setStatus] = useState(requestStates.notCalled);

  useEffect(
    () => {
      async function getFacilities() {
        try {
          const idQueryParam = facilityIds.join(',');
          const apiUrl = `${FACILITIES_API}?ids=${idQueryParam}`;

          // const apiUrl = `https://dev-api.va.gov/v1/facilities/va?ids=${idQueryParam}`;
          const response = await apiRequest(apiUrl);

          setFacilities(response.data);
          setStatus(requestStates.succeeded);
        } catch (error) {
          setStatus(requestStates.failed);
        }
      }

      if (facilityIds.length > 0) {
        setStatus(requestStates.pending);
        getFacilities();
      }
    },
    [facilityIds, setStatus, setFacilities],
  );

  return [facilities, status];
}
