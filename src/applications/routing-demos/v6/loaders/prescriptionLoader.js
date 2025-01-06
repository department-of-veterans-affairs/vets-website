import { defer } from 'react-router-dom-v5-compat';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';

export async function prescriptionLoader({ params }) {
  const { id } = params;
  try {
    const prescriptionPromise = apiRequest(
      `${environment.API_URL}/my_health/v1/prescriptions/${id}`,
    );
    const infoPromise = apiRequest(
      `${environment.API_URL}/my_health/v1/prescriptions/${id}/info`,
    );

    return defer({
      prescriptions: await prescriptionPromise,
      info: infoPromise,
    });
  } catch (e) {
    throw new Error('Error loading prescription data');
  }
}
