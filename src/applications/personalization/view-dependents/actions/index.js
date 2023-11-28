import recordEvent from '~/platform/monitoring/record-event';
import { fetchDataAttrsFromApi } from '~/platform/user/profile/utilities';

export const FETCH_ALL_DEPENDENTS_SUCCESS = 'FETCH_ALL_DEPENDENTS_SUCCESS';
export const FETCH_ALL_DEPENDENTS_FAILED = 'FETCH_ALL_DEPENDENTS_FAILED';

export function fetchAllDependents() {
  return async dispatch => {
    const response = await fetchDataAttrsFromApi(
      '/dependents_applications/show',
    );

    if (response.errors) {
      recordEvent({
        event: `disability-view-dependents-load-failed`,
        'error-key': `${response.errors[0].status}_internal_error`,
      });
      dispatch({
        type: FETCH_ALL_DEPENDENTS_FAILED,
        response,
      });
    } else {
      recordEvent({ event: `disability-view-dependents-load-success` });
      dispatch({
        type: FETCH_ALL_DEPENDENTS_SUCCESS,
        response,
      });
    }
  };
}
