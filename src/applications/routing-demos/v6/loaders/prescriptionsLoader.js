import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';

export async function prescriptionsLoader() {
  try {
    const response = await apiRequest(
      `${environment.API_URL}/my_health/v1/prescriptions`,
    );
    return response.data;
  } catch (e) {
    throw new Error('Error loading prescriptions');
  }
}
