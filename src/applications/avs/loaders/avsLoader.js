import { defer } from 'react-router-dom-v5-compat';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';

const apiBasePath = `${environment.API_URL}/avs/v0`;

export async function avsLoader({ params }) {
  const { id } = params;
  try {
    const data = apiRequest(`${apiBasePath}/avs/${id}`).then(response => {
      return response.data.attributes;
    });
    return defer({
      avs: data,
    });
  } catch (e) {
    throw new Error('Error loading prescription data');
  }
}

export default avsLoader;
