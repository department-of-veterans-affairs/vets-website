import environment from '~/platform/utilities/environment';
import { apiRequest } from '~/platform/utilities/api';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

/**
 * Gets the folder list for the current user.
 * @returns
 */
export const getFolderList = () => {
  return apiRequest(
    `${apiBasePath}/messaging/folders?page=1&per_page=999&useCache=false`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
