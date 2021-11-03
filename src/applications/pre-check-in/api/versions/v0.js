import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { makeApiCall } from '../../utils/api';

const v0 = {
  getSession: async token => {
    const url = '/check_in/v2/sessions/';
    const json = await makeApiCall(
      apiRequest(`${environment.API_URL}${url}${token}`),
      'get-current-session',
      token,
    );
    return {
      ...json,
    };
  },
};
export { v0 };
