import { useState, useEffect } from 'react';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { requestStates } from 'platform/utilities/constants';

const FACILITIES_API = `${environment.API_URL}/v1/facilities/va`;
// const FACILITIES_API = `https://dev-api.va.gov/v1/facilities/va`;

export default function useFacilitiesApi(facilityIds = []) {
  const apiUrl = `${FACILITIES_API}?ids=${facilityIds.join(',')}`;

  const [facilities, setFacilities] = useState(null);
  const [status, setStatus] = useState(requestStates.notCalled);

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
    [setStatus, setFacilities],
  );

  return [facilities, status];
}
