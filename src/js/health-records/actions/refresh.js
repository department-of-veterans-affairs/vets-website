import { apiRequest } from '../../common/helpers/api';

export function initialAppRefresh() {
  return (dispatch) => {
    dispatch({ type: 'INITIAL_LOADING' });

    apiRequest(
      '/health_records/refresh',
      null,
      () => dispatch({
        type: 'INITIAL_REFRESH_SUCCESS'
      }),
      (response) => {
        dispatch({ type: 'INITIAL_REFRESH_FAILURE', errors: response.errors });
      }
    );
  };
}

export function checkRefreshStatus() {
  return (dispatch) => {
    apiRequest('/health_records/refresh',
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
