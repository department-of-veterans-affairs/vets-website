import { apiRequest } from '../utils/helpers';

export function checkRefreshStatus() {
  return (dispatch) => {
    apiRequest('/v0/health_records/refresh',
      null,
      (response) => {
        return dispatch({
          type: 'REFRESH_POLL_SUCCESS',
          data: response.data,
        });
      },
      () => dispatch({
        type: 'REFRESH_POLL_FAILURE'
      })
    );
  };
}
