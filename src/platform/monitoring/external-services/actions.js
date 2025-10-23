import { apiRequest } from 'platform/utilities/api';

export const FETCH_BACKEND_STATUSES_FAILURE = 'FETCH_BACKEND_STATUSES_FAILURE';
export const FETCH_BACKEND_STATUSES_SUCCESS = 'FETCH_BACKEND_STATUSES_SUCCESS';
export const LOADING_BACKEND_STATUSES = 'LOADING_BACKEND_STATUSES';

const BASE_URL = '/backend_statuses';

export function getBackendStatuses() {
  return dispatch => {
    dispatch({ type: LOADING_BACKEND_STATUSES });

    return apiRequest(BASE_URL)
      .then(({ data }) =>
        dispatch({ type: FETCH_BACKEND_STATUSES_SUCCESS, data }),
      )
      .catch(() => dispatch({ type: FETCH_BACKEND_STATUSES_FAILURE }));
  };
}
