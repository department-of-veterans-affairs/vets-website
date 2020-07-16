import appendQuery from 'append-query';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

export const FETCH_CONTESTABLE_ISSUES_INIT = 'FETCH_CONTESTABLE_ISSUES_INIT';
export const FETCH_CONTESTABLE_ISSUES_SUCCEEDED =
  'FETCH_CONTESTABLE_ISSUES_SUCCEEDED';
export const FETCH_CONTESTABLE_ISSUES_FAILED =
  'FETCH_CONTESTABLE_ISSUES_FAILED';

export function getContestableIssues() {
  return dispatch => {
    dispatch({ type: FETCH_CONTESTABLE_ISSUES_INIT });
    const url = '/appeals/contestable_issues';
    return apiRequest(url)
      .then(response =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
          response,
        }),
      )
      .catch(errors =>
        dispatch({ type: FETCH_CONTESTABLE_ISSUES_FAILED, errors }),
      );
  };
}
