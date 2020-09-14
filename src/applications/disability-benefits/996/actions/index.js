import { apiRequest } from 'platform/utilities/api';

export const FETCH_CONTESTABLE_ISSUES_INIT = 'FETCH_CONTESTABLE_ISSUES_INIT';
export const FETCH_CONTESTABLE_ISSUES_SUCCEEDED =
  'FETCH_CONTESTABLE_ISSUES_SUCCEEDED';
export const FETCH_CONTESTABLE_ISSUES_FAILED =
  'FETCH_CONTESTABLE_ISSUES_FAILED';

export function getContestableIssues({ benefitType = 'compensation' } = {}) {
  return dispatch => {
    dispatch({ type: FETCH_CONTESTABLE_ISSUES_INIT });
    const url = `/higher_level_reviews/contestable_issues/${benefitType}`;
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
