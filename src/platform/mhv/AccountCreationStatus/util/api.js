import environment from '~/platform/utilities/environment';
import { apiRequest } from '~/platform/utilities/api';

export const getMHVAccount = () => {
  return apiRequest(`${environment.API_URL}/v0/user/mhv_user_account`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(error => {
    return error;
  });
};
