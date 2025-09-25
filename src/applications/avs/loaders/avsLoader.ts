import { defer } from 'react-router-dom-v5-compat';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import type { RouteParams, AvsApiResponse } from '../types';

const apiBasePath = `${environment.API_URL}/avs/v0`;

export function avsLoader({ params }: { params: RouteParams }) {
  const { id } = params;

  if (!id) {
    throw new Error('ID parameter is required');
  }

  const data = apiRequest(`${apiBasePath}/avs/${id}`).then(
    (response: AvsApiResponse) => {
      return response.data.attributes;
    },
  );

  return defer({
    avs: data,
  });
}

export default avsLoader;
