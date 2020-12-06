import { useState, useEffect } from 'react';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { requestStates } from 'platform/utilities/constants';

export default function usePatientFacilities(facilityIds) {
  const [facilities, setFacilities] = useState(null);
  const [status, setStatus] = useState(requestStates.notCalled);

  const idQueryParam = facilityIds.join(',');
  const apiUrl = `${environment.API_URL}/v1/facilities/va?ids=${idQueryParam}`;
  // const apiUrl = `https://dev-api.va.gov/v1/facilities/va?ids=${idQueryParam}`;

  useEffect(
    () => {
      async function getFacilities() {
        try {
          const response = await apiRequest(apiUrl);
          setFacilities(response.data);
          setStatus(requestStates.succeeded);
        } catch (error) {
          setStatus(requestStates.failed);
        }
      }

      setStatus(requestStates.pending);
      getFacilities();
    },
    [facilityIds, setStatus, setFacilities],
  );

  return [facilities, status];
}
